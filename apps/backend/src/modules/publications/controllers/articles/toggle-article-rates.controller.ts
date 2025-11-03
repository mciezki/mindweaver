import { ArticleRate } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { toggleArticleRates } from '../../services/articles/toggle-article-rates.service';

export const articleRate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { articleId } = req.params;
    const { rate } = req.body;
    const userId = req.user?.userId;

    const assertedRate = rate.toUpperCase() as ArticleRate;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const result = await toggleArticleRates(userId, articleId, assertedRate);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
