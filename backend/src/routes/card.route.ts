import {Router} from 'express';
import {authenticate, authorize} from '../middlewares/auth.middleware';
import {USER_ROLES} from '../constants/roles';

const router = Router();

// Placeholder routes with proper role-based access
router.get('/', authenticate, (req, res) => {
  res.json({
    message: 'Get all cards - role-based filtering will be implemented here',
  });
});

router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  (req, res) => {
    res.json({message: 'Create card - only admin and manager can create'});
  }
);

router.put('/:id', authenticate, (req, res) => {
  res.json({
    message:
      'Update card - ownership and role-based restrictions will be checked here',
  });
});

router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN), (req, res) => {
  res.json({message: 'Delete card - only admin can delete'});
});

export {router as cardRoutes};
