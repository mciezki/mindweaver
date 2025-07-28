import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import {
  requestResetUserPassword,
  resetUserPassword,
} from '../services/reset-password.service';

export const requestResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      const err: any = new Error(getMessage('auth.error.emailRequired'));
      err.statusCode = 400;
      throw err;
    }

    const result = await requestResetUserPassword(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ______________________________________

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, newPassword } = req.body;

    const result = await resetUserPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
