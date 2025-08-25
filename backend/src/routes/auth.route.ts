import {Router} from 'express';
import {createUser, login, createAdmin} from '../controllers/auth.controller';
import {authenticate, authorize} from '../middlewares/auth.middleware';
import {USER_ROLES} from '../constants/roles';

const router = Router();

router.post('/login', login);
router.post('/create-admin', createAdmin);
router.post(
  '/create-user',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  createUser
);

export {router as authRoutes};
