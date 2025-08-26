import {Request, Response, NextFunction} from 'express';
import {User} from '../models/User';
import {MESSAGES} from '../constants/messages';
import {USER_ROLES} from '../constants/roles';
import {AuthRequest} from '../middlewares/auth.middleware';
import jwt, {SignOptions} from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const options: SignOptions = {
    expiresIn: '1d', // 1 day expiry
  };
  return jwt.sign({userId}, process.env.JWT_SECRET as jwt.Secret, options);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({email});
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.ERROR.INVALID_CREDENTIALS,
      });
    }

    const token = generateToken(user._id);

    // Return JWT token directly in response body
    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGIN,
      data: {
        user: user.toJSON(),
        token: token, // Include token in response
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // No need to clear cookies anymore, just return success
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is populated by the authenticate middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email, password, firstName, lastName, role} = req.body;
    console.log(email, password, firstName, lastName, role);

    if (role === USER_ROLES.ADMIN) {
      console.log('this should run');
      return res.status(403).json({
        success: false,
        message: 'Cannot create a new admin',
      });
    }

    // Only admin can create users/managers
    if (req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.ADMIN_ONLY,
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.ERROR.USER_EXISTS,
      });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || USER_ROLES.USER,
      createdBy: req.user._id,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: MESSAGES.SUCCESS.SIGNUP,
      data: {user: user.toJSON()},
    });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email, password, firstName, lastName, secretPassword} = req.body;

    // Check secret password (hardcoded for security)
    const ADMIN_SECRET = 'create-admin-2025-secret-key';
    if (secretPassword !== ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Invalid secret password',
      });
    }

    // Check if any admin user already exists
    const existingAdmin = await User.findOne({role: USER_ROLES.ADMIN});
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists. Cannot create another admin.',
      });
    }

    // Check if user with this email exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.ERROR.USER_EXISTS,
      });
    }

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, firstName, and lastName are required',
      });
    }

    const adminUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: USER_ROLES.ADMIN,
    });

    await adminUser.save();

    const token = generateToken(adminUser._id);

    // Return JWT token directly in response body for the newly created admin
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: adminUser.toJSON(),
        token: token, // Include token in response
      },
    });
  } catch (error) {
    next(error);
  }
};
