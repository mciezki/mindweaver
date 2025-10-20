import { NextFunction, Request, Response } from 'express';

import { getThread } from '../services/thread.service';

export const thread = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { threadId } = req.params;

    const thread = await getThread(threadId);

    res.status(200).json(thread);
  } catch (error) {
    next(error);
  }
};
