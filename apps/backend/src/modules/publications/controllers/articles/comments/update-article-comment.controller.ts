import { PublicationArticleCommentRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../../locales';
import { updateArticleComment } from '../../../services/articles/comments/update-article-comment.service';

export const updateArticleCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    const { content }: PublicationArticleCommentRequest = req.body;

    const updatedComment = await updateArticleComment(commentId, {
      content,
    });

    res.status(200).json({
      message: getMessage('publications.comments.success.updated'),
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};
