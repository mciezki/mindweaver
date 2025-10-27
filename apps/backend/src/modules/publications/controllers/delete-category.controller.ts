import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { deletePublicationCategory } from '../services/delete-category.service';

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;

    await deletePublicationCategory(categoryId);

    res.status(200).json({
      message: getMessage('publications.categories.success.deleted'),
    });
  } catch (error) {
    next(error);
  }
};
