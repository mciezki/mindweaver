import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { toggleThreadLike } from '../services/toggle-thread-like.service';

export const threadLikeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { threadId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const result = await toggleThreadLike(userId, threadId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
