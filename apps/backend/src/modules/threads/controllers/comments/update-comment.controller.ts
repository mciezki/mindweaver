import { ThreadCommentRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { updateThreadComment } from '../../services/comments/update-comment.service';

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    const { content }: ThreadCommentRequest = req.body;

    const updatedComment = await updateThreadComment(commentId, {
      content,
    });

    res.status(200).json({
      message: getMessage('threads.comment.updated'),
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};
