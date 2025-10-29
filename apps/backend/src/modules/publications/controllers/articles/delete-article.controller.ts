import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { deletePublicationArticle } from '../../services/articles/delete-article.service';

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { articleId } = req.params;

    await deletePublicationArticle(articleId);

    res.status(200).json({
      message: getMessage('publications.articles.success.deleted'),
    });
  } catch (error) {
    next(error);
  }
};
