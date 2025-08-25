import {Router} from 'express';
import {authenticate, authorize} from '../middlewares/auth.middleware';
import {USER_ROLES} from '../constants/roles';
import {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
  getCardById,
} from '../controllers/card.controller';

const router = Router();

// Get all cards with role-based filtering
router.get('/', authenticate, getAllCards);

// Create card (Admin and Manager only)
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  createCard
);

// Update card with ownership validation
router.put('/:id', authenticate, updateCard);

// Delete card (Admin only)
router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN), deleteCard);

// Get single card by ID with role-based access
router.get('/:id', authenticate, getCardById);

export {router as cardRoutes};
