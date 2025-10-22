import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { toggleCommentLike } from '../../services/comments/toggle-comment-like.service';

export const commentLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const result = await toggleCommentLike(userId, commentId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
