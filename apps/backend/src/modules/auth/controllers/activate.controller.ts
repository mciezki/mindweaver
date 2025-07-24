import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { activateAccount } from '../services/activate.service';

export const activate = async (req: Request,
  res: Response,
  next: NextFunction,) => {
  try {
    const { token } = req.body;

    if (!token) {
      const err: any = new Error(getMessage('auth.error.missingActivationToken'))
      err.statusCode = 400;
      throw err;
    }

    if (typeof token !== 'string' || token.length !== 5) {
      const err: any = new Error(getMessage('auth.error.invalidActivationTokenFormat'));
      err.statusCode = 400;
      throw err;
    }
    const result = await activateAccount(token);

    res.status(200).json({
      message: getMessage('auth.success.accountActivated'),
      user: result,
    });
  } catch (error) {
    next(error);
  }
}