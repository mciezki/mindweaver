import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { getProfile } from '../services/profile.service';

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const err: any = new Error(getMessage('auth.common.noUserId'));
      err.statusCode = 404;
      throw err;
    }

    const profile = await getProfile(userId);

    res
      .status(200)
      .json({ message: getMessage('auth.success.profileFetched'), profile });
  } catch (error) {
    next(error);
  }
};
