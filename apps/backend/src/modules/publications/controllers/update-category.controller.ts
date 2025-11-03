import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { updatePublicationCategory } from '../services/update-category.service';

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, slug, description } = req.body;
    const { categoryId } = req.params;

    const updatedCategory = await updatePublicationCategory(categoryId, {
      name,
      description,
      slug,
    });

    res.status(200).json({
      message: getMessage('publications.categories.success.updated'),
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
