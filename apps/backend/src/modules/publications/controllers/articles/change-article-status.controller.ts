import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { changeArticleStatus } from '../../services/articles/change-article-status.service';

export const changeStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.body;
    const { articleId } = req.params;

    const updatedArticle = await changeArticleStatus(articleId, {
      status,
    });

    res.status(200).json({
      message: getMessage('publications.articles.success.updated'),
      article: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};
