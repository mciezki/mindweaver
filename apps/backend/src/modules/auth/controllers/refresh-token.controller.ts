import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import {
  COOKIES_BASIC_OPTIONS,
  JWT_EXPIRES_IN_SECONDS,
  JWT_REFRESH_EXPIRES_IN,
} from '../../../utils/consts';
import { refreshAccessToken } from '../services/refresh-token.service';

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const { user, accessToken, refreshToken } =
      await refreshAccessToken(oldRefreshToken);

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

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};
