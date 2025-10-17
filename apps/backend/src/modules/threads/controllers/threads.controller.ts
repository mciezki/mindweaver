import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { getPublicThreadsList } from '../services/threads.service';

export const threads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, page, limit } = req.query;

    const searchString = (search as string) || '';
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 25;

    if (pageNumber < 1 || limitNumber < 1) {
      const err: any = new Error(getMessage('pagination.error.invalidParams'));
      err.statusCode = 400;
      throw err;
    }

    const result = await getPublicThreadsList({
      search: searchString,
      page: pageNumber,
      limit: limitNumber,
    });

    res.status(200).json({
      threads: result.threads,
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
