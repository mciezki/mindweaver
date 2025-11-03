import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../../locales';
import { getArticleComments } from '../../../services/articles/comments/article-comments.service';

export const articleCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { articleId } = req.params;
    const { page, limit } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 25;

    if (pageNumber < 1 || limitNumber < 1) {
      const err: any = new Error(getMessage('pagination.error.invalidParams'));
      err.statusCode = 400;
      throw err;
    }

    const result = await getArticleComments(articleId, {
      page: pageNumber,
      limit: limitNumber,
    });

    res.status(200).json({
      comments: result.comments,
      meta: {
        totalCount: result.totalCount,
        currentPage: pageNumber,
        totalPages: result.totalPages,
        limit: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};
