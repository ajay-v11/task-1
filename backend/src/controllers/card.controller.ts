import {Response, NextFunction} from 'express';
import {Card} from '../models/Card';
import {User} from '../models/User';
import {MESSAGES} from '../constants/messages';
import {USER_ROLES} from '../constants/roles';
import {AuthRequest} from '../middlewares/auth.middleware';
import mongoose from 'mongoose';

export const getAllCards = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role, _id: userId} = req.user;
    let cards;

    // Role-based filtering
    if (role === USER_ROLES.ADMIN) {
      // Admin can see all cards
      cards = await Card.find()
        .populate('createdBy', 'firstName lastName email role')
        .sort({createdAt: -1});
    } else if (role === USER_ROLES.MANAGER) {
      // Manager can see all cards but only edit their own
      cards = await Card.find()
        .populate('createdBy', 'firstName lastName email role')
        .sort({createdAt: -1});
    } else {
      // User can only see cards assigned to them
      cards = await Card.find({assignedTo: req.user.email})
        .populate('createdBy', 'firstName lastName email role')
        .sort({createdAt: -1});
    }

    res.status(200).json({
      success: true,
      message: 'Cards retrieved successfully',
      data: {cards},
    });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role, _id: creatorId} = req.user;

    // Only Admin and Manager can create cards
    if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.MANAGER) {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Manager can create cards',
      });
    }

    // Debug: Log incoming payload shape
    try {
      console.log('[createCard] content-type:', req.headers['content-type']);
      console.log('[createCard] has body:', typeof req.body !== 'undefined');
      if (req.body) {
        console.log('[createCard] body keys before parse:', Object.keys(req.body));
      }
      console.log('[createCard] has file:', !!req.file);
    } catch (e) {}

    // Ensure body exists and parse nested JSON fields if they arrived as strings (multipart/form-data)
    const rawBody: any = req.body || {};
    let {
      fullName,
      title,
      location,
      companyName,
      description,
      contact,
      socialLinks,
      services,
      products,
      gallery,
      assignedTo,
    } = rawBody;

    try {
      if (typeof contact === 'string') contact = JSON.parse(contact);
    } catch (_) {}
    try {
      if (typeof socialLinks === 'string') socialLinks = JSON.parse(socialLinks);
    } catch (_) {}
    try {
      if (typeof services === 'string') services = JSON.parse(services);
    } catch (_) {}
    try {
      if (typeof products === 'string') products = JSON.parse(products);
    } catch (_) {}
    try {
      if (typeof gallery === 'string') gallery = JSON.parse(gallery);
    } catch (_) {}

    // The profile picture is now handled by Multer middleware
    const profilePicture = req.file ? req.file.buffer : undefined;

    // Validate required fields
    if (
      !fullName ||
      !title ||
      !location ||
      !companyName ||
      !description ||
      !(contact && contact.email) ||
      !assignedTo
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Full name, title, location, company name, description, contact email, and assigned user email are required',
      });
    }

    // Validate that the assigned user exists
    const assignedUser = await User.findOne({ email: assignedTo });
    if (!assignedUser) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user with this email does not exist',
      });
    }

    const card = new Card({
      profilePicture,
      fullName,
      title,
      location,
      companyName,
      description,
      contact,
      socialLinks,
      services,
      products,
      gallery,
      assignedTo,
      createdBy: creatorId,
    });

    await card.save();

    // Populate the created card
    await card.populate('createdBy', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      data: {card},
    });
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role, _id: userId} = req.user;
    const {id} = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card ID format',
      });
    }

    // Find the card first
    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    // Check permissions
    let canEdit = false;
    if (role === USER_ROLES.ADMIN) {
      canEdit = true; // Admin can edit any card
    } else if (
      role === USER_ROLES.MANAGER &&
      card.createdBy.toString() === userId
    ) {
      canEdit = true; // Manager can edit only their own cards
    } else if (
      role === USER_ROLES.USER &&
      card.assignedTo === req.user.email
    ) {
      canEdit = true; // User can edit only cards assigned to them
    }

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this card',
      });
    }

    // Ensure body exists and parse nested JSON fields if they arrived as strings (multipart/form-data)
    const rawBody: any = req.body || {};
    let {
      fullName,
      title,
      location,
      companyName,
      description,
      contact,
      socialLinks,
      services,
      products,
      gallery,
      assignedTo,
    } = rawBody;

    try {
      if (typeof contact === 'string') contact = JSON.parse(contact);
    } catch (_) {}
    try {
      if (typeof socialLinks === 'string') socialLinks = JSON.parse(socialLinks);
    } catch (_) {}
    try {
      if (typeof services === 'string') services = JSON.parse(services);
    } catch (_) {}
    try {
      if (typeof products === 'string') products = JSON.parse(products);
    } catch (_) {}
    try {
      if (typeof gallery === 'string') gallery = JSON.parse(gallery);
    } catch (_) {}

    const updateData: any = {
      fullName,
      title,
      location,
      companyName,
      description,
      contact,
      socialLinks,
      services,
      products,
      gallery,
      assignedTo,
      lastUpdatedAt: new Date(),
    };

    // If a new file is uploaded, update the profile picture
    if (req.file) {
      updateData.profilePicture = req.file.buffer;
    }

    // If assignedTo is being updated, validate the user exists
    if (assignedTo && assignedTo !== card.assignedTo) {
      const assignedUser = await User.findOne({ email: assignedTo });
      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user with this email does not exist',
        });
      }
    }

    // Update the card
    const updatedCard = await Card.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'firstName lastName email role');

    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      data: {card: updatedCard},
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role} = req.user;
    const {id} = req.params;

    // Only Admin can delete cards
    if (role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only Admin can delete cards',
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card ID format',
      });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    await Card.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Card deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCardById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role, _id: userId} = req.user;
    const {id} = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card ID format',
      });
    }

    const card = await Card.findById(id)
      .populate('createdBy', 'firstName lastName email role');

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    // Check access permissions
    let canView = false;
    if (role === USER_ROLES.ADMIN || role === USER_ROLES.MANAGER) {
      canView = true; // Admin and Manager can view all cards
    } else if (
      role === USER_ROLES.USER &&
      card.assignedTo === req.user.email
    ) {
      canView = true; // User can view only cards assigned to them
    }

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this card',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Card retrieved successfully',
      data: {card},
    });
  } catch (error) {
    next(error);
  }
};

export const getCardProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card ID format',
      });
    }

    const card = await Card.findById(id).select('profilePicture');
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    if (!card.profilePicture) {
      return res.status(404).json({
        success: false,
        message: 'Profile picture not found',
      });
    }

    // Convert Buffer to base64
    const base64 = card.profilePicture.toString('base64');
    const mimeType = 'image/jpeg'; // Default to JPEG, you could detect this from the original file

    res.status(200).json({
      success: true,
      data: {
        image: `data:${mimeType};base64,${base64}`,
        mimeType,
      },
    });
  } catch (error) {
    next(error);
  }
};
