import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import {
  COOKIES_BASIC_OPTIONS,
  JWT_EXPIRES_IN_SECONDS,
  JWT_REFRESH_EXPIRES_IN,
} from '../../../utils/consts';
import { loginUser } from '../services/login.service';

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    res.cookie('refreshToken', refreshToken, {
      ...COOKIES_BASIC_OPTIONS,
      expires: new Date(
        Date.now() + JWT_REFRESH_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
    });

    res.cookie('accessToken', accessToken, {
      ...COOKIES_BASIC_OPTIONS,
      expires: new Date(Date.now() + JWT_EXPIRES_IN_SECONDS * 1000),
    });

    res
      .status(200)
      .json({ message: getMessage('auth.success.loggedIn'), user });
  } catch (error) {
    next(error);
  }
};
