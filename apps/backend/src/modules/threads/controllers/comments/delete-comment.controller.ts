import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { deleteThreadComment } from '../../services/comments/delete-comment.service';

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    await deleteThreadComment(commentId);

    res.status(200).json({
      message: getMessage('threads.comment.deleted'),
    });
  } catch (error) {
    next(error);
  }
};
