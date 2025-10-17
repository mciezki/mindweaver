import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { getPublicUser } from '../services/user.service';

export const user = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slugOrId } = req.params;

    if (!slugOrId) {
      const err: any = new Error(getMessage('auth.common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }

    const user = await getPublicUser(slugOrId);

    res.status(200).json({ ...user });
  } catch (error) {
    next(error);
  }
};
