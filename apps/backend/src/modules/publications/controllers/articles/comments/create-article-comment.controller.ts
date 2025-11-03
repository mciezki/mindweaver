import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../../locales';
import { createArticleComment } from '../../../services/articles/comments/create-article-comment.service';

export const createArticleCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { articleId } = req.params;
    const userId = req.user?.userId;
    const { content } = req.body;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const result = await createArticleComment(userId, articleId, {
      content,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
