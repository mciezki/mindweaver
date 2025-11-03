import { NextFunction, Request, Response } from 'express';

import { getUserCategories } from '../services/categories.service';

export const categoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const categories = await getUserCategories(userId);

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
