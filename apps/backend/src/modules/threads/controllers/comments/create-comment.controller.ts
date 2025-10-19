import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { createThreadComment } from '../../services/comments/create-comment.service';

export const threadComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: threadId } = req.params;
    const userId = req.user?.userId;
    const { content, parentId } = req.body;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const result = await createThreadComment(userId, threadId, {
      content,
      parentId,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
