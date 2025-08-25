import {Router} from 'express';
import {authenticate, authorize} from '../middlewares/auth.middleware';
import {USER_ROLES} from '../constants/roles';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(USER_ROLES.ADMIN), (req, res) => {
  res.json({message: 'Get all users - admin only'});
});

// Get user profile
router.get('/profile', authenticate, (req, res) => {
  res.json({message: 'Get user profile - any authenticated user'});
});

export {router as userRoutes};
