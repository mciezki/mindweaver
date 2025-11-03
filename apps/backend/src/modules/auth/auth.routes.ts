import { Router } from 'express';

import upload from '../../config/multer.config';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  validateLogin,
  validateProfileUpdate,
  validateRegister,
  validateRequestResetPassword,
  validateResetPassword,
} from './auth.validator';
import { activateController } from './controllers/activate.controller';
import { loginController } from './controllers/login.controller';
import { logoutController } from './controllers/logout.controller';
import { profileController } from './controllers/profile.controller';
import { refreshController } from './controllers/refresh-token.controller';
import { registerController } from './controllers/register.controller';
import {
  requestResetPasswordController,
  resetPasswordController,
} from './controllers/reset-password.controller';
import { updateProfileController } from './controllers/update-user.controller';

const router = Router();

router.post('/register', validateRegister, registerController);
router.post('/login', validateLogin, loginController);
router.post('/logout', logoutController);

router.post('/activate', activateController);

router.post(
  '/request-password-reset',
  validateRequestResetPassword,
  requestResetPasswordController,
);
router.post('/reset-password', validateResetPassword, resetPasswordController);

router.patch(
  '/profile/update',
  authMiddleware,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  validateProfileUpdate,
  updateProfileController,
);

router.post('/refresh', refreshController);

router.get('/profile', authMiddleware, profileController);

export default router;
