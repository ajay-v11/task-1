import {Router} from 'express';
import {authenticate, authorize} from '../middlewares/auth.middleware';
import {USER_ROLES} from '../constants/roles';
import {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
  getCardById,
  getCardProfileImage,
} from '../controllers/card.controller';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Get all cards with role-based filtering
router.get('/', authenticate, getAllCards);

// Get card profile image
router.get('/:id/profile-image', authenticate, getCardProfileImage);

// Create card (Admin and Manager only) with file upload
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  upload.single('profilePicture'),
  createCard
);

// Update card with ownership validation and file upload
router.put('/:id', authenticate, upload.single('profilePicture'), updateCard);

// Delete card (Admin only)
router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN), deleteCard);

// Get single card by ID with role-based access
router.get('/:id', authenticate, getCardById);

export {router as cardRoutes};
