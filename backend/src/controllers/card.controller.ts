import {Response, NextFunction} from 'express';
import {Card} from '../models/Card';
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
        .populate('assignedTo', 'firstName lastName email role')
        .sort({createdAt: -1});
    } else if (role === USER_ROLES.MANAGER) {
      // Manager can see all cards but only edit their own
      cards = await Card.find()
        .populate('createdBy', 'firstName lastName email role')
        .populate('assignedTo', 'firstName lastName email role')
        .sort({createdAt: -1});
    } else {
      // User can only see cards assigned to them
      cards = await Card.find({assignedTo: userId})
        .populate('createdBy', 'firstName lastName email role')
        .populate('assignedTo', 'firstName lastName email role')
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

    const {
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
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !title ||
      !location ||
      !companyName ||
      !description ||
      !contact?.email ||
      !assignedTo
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Full name, title, location, company name, description, contact email, and assigned user are required',
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
    await card.populate('assignedTo', 'firstName lastName email role');

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
      card.assignedTo.toString() === userId
    ) {
      canEdit = true; // User can edit only cards assigned to them
    }

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this card',
      });
    }

    const {
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
    } = req.body;

    // Update the card
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      {
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
        lastUpdatedAt: new Date(),
      },
      {new: true, runValidators: true}
    )
      .populate('createdBy', 'firstName lastName email role')
      .populate('assignedTo', 'firstName lastName email role');

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
      .populate('createdBy', 'firstName lastName email role')
      .populate('assignedTo', 'firstName lastName email role');

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
      card.assignedTo._id.toString() === userId
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
