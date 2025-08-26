import {Response, NextFunction} from 'express';
import {User} from '../models/User';
import {MESSAGES} from '../constants/messages';
import {USER_ROLES} from '../constants/roles';
import {AuthRequest} from '../middlewares/auth.middleware';
import mongoose from 'mongoose';

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role} = req.user;

    // Only Admin can get all users
    if (role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.ADMIN_ONLY,
      });
    }

    const users = await User.find()
      .select('-password')
      .populate('createdBy', 'firstName lastName email role')
      .sort({createdAt: -1});

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {users},
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersForDropdown = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role} = req.user;

    // Only Admin and Manager can get users for dropdown
    if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.MANAGER) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const users = await User.find()
      .select('firstName lastName email role')
      .sort({firstName: 1, lastName: 1});

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {users},
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {_id: userId} = req.user;

    const user = await User.findById(userId)
      .select('-password')
      .populate('createdBy', 'firstName lastName email role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {user},
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role} = req.user;
    const {id} = req.params;

    // Only Admin can get user by ID
    if (role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.ADMIN_ONLY,
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const user = await User.findById(id)
      .select('-password')
      .populate('createdBy', 'firstName lastName email role');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {user},
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role} = req.user;
    const {id} = req.params;
    const updateData = req.body;

    // Only Admin and Manager can update users
    if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.MANAGER) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.role; // Only admin should be able to change roles

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {user: updatedUser},
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role} = req.user;
    const {id} = req.params;

    // Only Admin can delete users
    if (role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only Admin can delete users',
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
