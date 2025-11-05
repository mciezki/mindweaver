import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { markAsRead } from '../services/mark-as-read.service';

export const markAsReadController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.unauthorized'));
      err.statusCode = 401;
      throw err;
    }

    await markAsRead(userId, conversationId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
