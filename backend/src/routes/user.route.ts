import {Router} from 'express';
import {authenticate, authorize} from '../middlewares/auth.middleware';
import {USER_ROLES} from '../constants/roles';
import {
  getAllUsers,
  getUserProfile,
  getUserById,
} from '../controllers/user.controller';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), getAllUsers);

// Get user profile (any authenticated user)
router.get('/profile', authenticate, getUserProfile);

// Get user by ID (admin only)
router.get('/:id', authenticate, authorize(USER_ROLES.ADMIN), getUserById);

export {router as userRoutes};
