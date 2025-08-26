import {Router} from 'express';
import {authenticate, authorize} from '../middlewares/auth.middleware';
import {USER_ROLES} from '../constants/roles';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersForDropdown,
} from '../controllers/user.controller';

const router = Router();

// Get all users (Admin and Manager only)
router.get('/', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), getAllUsers);

// Get users for dropdown (Admin and Manager only) - simplified user list
router.get('/dropdown', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), getUsersForDropdown);

// Get user by ID (Admin and Manager only)
router.get('/:id', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), getUserById);

// Update user (Admin and Manager only)
router.put('/:id', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), updateUser);

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN), deleteUser);

export {router as userRoutes};
