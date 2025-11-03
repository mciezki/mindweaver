import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { COOKIES_BASIC_OPTIONS } from '../../../utils/consts';
import { revokeRefreshToken } from '../services/refresh-token.service';

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', COOKIES_BASIC_OPTIONS);
    res.clearCookie('accessToken', COOKIES_BASIC_OPTIONS);

    res.status(200).json({ message: getMessage('auth.success.loggedOut') });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
