import { NextFunction, Request, Response } from 'express';

import { getArticle } from '../../services/articles/article.service';

export const article = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { articleId } = req.params;
    const viewerId = req.user?.userId;

    const article = await getArticle(articleId, viewerId);

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};
