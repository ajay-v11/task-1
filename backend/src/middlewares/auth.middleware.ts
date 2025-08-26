import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/User';
import {MESSAGES} from '../constants/messages';
import {UserRole} from '../constants/roles';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get token from cookies first, fallback to Authorization header
    let token = req.cookies?.token;
    console.log('token is ', token);

    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
          success: false,
          message: MESSAGES.ERROR.UNAUTHORIZED,
        });
      }
      token = authHeader.substring(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.ERROR.USER_NOT_FOUND,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: MESSAGES.ERROR.TOKEN_INVALID,
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.ERROR.UNAUTHORIZED,
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN,
      });
    }

    next();
  };
};
