import { CreateThreadRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { shareUserThread } from '../services/share-thread.service';

export const shareThreadController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { threadId } = req.params;
    const { content } = req.body;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const shareData: Partial<CreateThreadRequest> = { content };

    const sharedThread = await shareUserThread(userId, threadId, shareData);

    res.status(201).json({
      message: getMessage('threads.success.shared'),
      thread: sharedThread,
    });
  } catch (error) {
    next(error);
  }
};
