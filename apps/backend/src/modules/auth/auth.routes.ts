import { Router } from 'express';

import upload from '../../config/multer.config';
import { getMessage } from '../../locales';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  validateLogin,
  validateProfileUpdate,
  validateRegister,
  validateRequestResetPassword,
  validateResetPassword,
} from './auth.validator';
import { activate } from './controllers/activate.controller';
import { login } from './controllers/login.controller';
import { logout } from './controllers/logout.controller';
import { profile } from './controllers/profile.controller';
import { refresh } from './controllers/refresh-token.controller';
import { register } from './controllers/register.controller';
import {
  requestResetPassword,
  resetPassword,
} from './controllers/reset-password.controller';
import { updateProfile } from './controllers/update-user.controller';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

router.post('/activate', activate);

router.post(
  '/request-password-reset',
  validateRequestResetPassword,
  requestResetPassword,
);
router.post('/reset-password', validateResetPassword, resetPassword);

router.patch(
  '/profile/update',
  authMiddleware,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  validateProfileUpdate,
  updateProfile,
);

router.post('/refresh', refresh);

router.get('/profile', authMiddleware, profile);

export default router;
