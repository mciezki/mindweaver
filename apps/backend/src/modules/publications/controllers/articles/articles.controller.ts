import { ArticleStatus } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { getUserArticlesList } from '../../services/articles/articles.service';

export const articlesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, slugOrCategoryId, status } = req.params;
    const viewerId = req.user?.userId;
    const { search, page, limit } = req.query;

    const asertedStatus = status.toUpperCase() as ArticleStatus;
    const searchString = (search as string) || '';
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 25;

    if (asertedStatus !== 'DRAFT' && asertedStatus !== 'PUBLISHED') {
      const err: any = new Error();
      err.statusCode = 400;
      throw err;
    }

    if (asertedStatus === 'DRAFT' && userId !== viewerId) {
      const err: any = new Error();
      err.statusCode = 403;
      throw err;
    }

    if (pageNumber < 1 || limitNumber < 1) {
      const err: any = new Error(getMessage('pagination.error.invalidParams'));
      err.statusCode = 400;
      throw err;
    }

    const result = await getUserArticlesList(
      userId,
      slugOrCategoryId,
      asertedStatus,
      {
        search: searchString,
        page: pageNumber,
        limit: limitNumber,
      },
    );

    res.status(200).json({
      articles: result.articles,
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
