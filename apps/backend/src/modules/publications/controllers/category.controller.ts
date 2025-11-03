import { NextFunction, Request, Response } from 'express';

import { getCategory } from '../services/category.service';

export const categoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slugOrCategoryId } = req.params;

    const category = await getCategory(slugOrCategoryId);

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};
