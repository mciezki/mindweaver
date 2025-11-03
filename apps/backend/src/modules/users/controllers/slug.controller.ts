import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { getUniqueUserSlug } from '../services/slug.service';

export const slugController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const err: any = new Error(getMessage('auth.common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }

    const generatedSlug = await getUniqueUserSlug(userId);

    res.status(200).json({ ...generatedSlug });
  } catch (error) {
    next(error);
  }
};
