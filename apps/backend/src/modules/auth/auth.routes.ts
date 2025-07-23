import { Router } from 'express';

import { getMessage } from '../../locales';
import { login, register, update, activate, requestResetPassword, resetPassword, logout, refresh } from './auth.controller';
import { authMiddleware } from './auth.middleware';
import { validateLogin, validateRegister, validateRequestResetPassword, validateResetPassword } from './auth.validator';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout)

router.post('/activate', activate);

router.post('/request-password-reset', validateRequestResetPassword, requestResetPassword)
router.post('/reset-password', validateResetPassword, resetPassword)

router.patch('/update', authMiddleware, update);

router.post('/refresh', refresh)

// TODO: Make normal endpoint from database
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    message: getMessage('auth.success.profileFetched'),
    user: req.user,
  });
});

export default router;
