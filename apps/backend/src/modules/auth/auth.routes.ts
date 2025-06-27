import { Router } from 'express';

import { getMessage } from '../../locales';
import { login, register, update } from './auth.controller';
import { authMiddleware } from './auth.middleware';
import { validateLogin, validateRegister } from './auth.validator';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.patch('/update', authMiddleware, update);

// TODO: Make normal endpoint from database
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    message: getMessage('auth.success.profileFetched'),
    user: req.user,
  });
});

export default router;
