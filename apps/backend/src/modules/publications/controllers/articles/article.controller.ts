import { NextFunction, Request, Response } from 'express';

import { getArticle } from '../../services/articles/article.service';

export const articleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slugOrArticleId } = req.params;
    const viewerId = req.user?.userId;

    const article = await getArticle(slugOrArticleId, viewerId);

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};
