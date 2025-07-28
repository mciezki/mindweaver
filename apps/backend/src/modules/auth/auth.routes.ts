import { Router } from 'express';

import upload from '../../config/multer.config';

import { getMessage } from '../../locales';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateLogin, validateRegister, validateRequestResetPassword, validateResetPassword, validateProfileUpdate } from './auth.validator';
import { register } from './controllers/register.controller';
import { login } from './controllers/login.controller';
import { logout } from './controllers/logout.controller';
import { activate } from './controllers/activate.controller';
import { requestResetPassword, resetPassword } from './controllers/reset-password.controller';
import { updateProfile } from './controllers/update-user.controller';
import { refresh } from './controllers/refresh-token.controller';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout)

router.post('/activate', activate);

router.post('/request-password-reset', validateRequestResetPassword, requestResetPassword)
router.post('/reset-password', validateResetPassword, resetPassword)

router.patch('/profile/update', authMiddleware, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]), validateProfileUpdate, updateProfile);

router.post('/refresh', refresh)

// TODO: Make normal endpoint from database
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    message: getMessage('auth.success.profileFetched'),
    user: req.user,
  });
});

export default router;
