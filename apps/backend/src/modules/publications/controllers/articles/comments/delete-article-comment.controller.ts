import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../../locales';
import { deleteArticleComment } from '../../../services/articles/comments/delete-article-comment.service';

export const deleteArticleCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    await deleteArticleComment(commentId);

    res.status(200).json({
      message: getMessage('publications.comments.success.deleted'),
    });
  } catch (error) {
    next(error);
  }
};
