import { CreatePublicationCategoryRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { createNewCategory } from '../services/create-category.service';

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const categoryData: CreatePublicationCategoryRequest = req.body;

    const createdCategory = await createNewCategory(userId, categoryData);

    res.status(201).json({
      message: getMessage('publications.categories.success.created'),
      category: createdCategory,
    });
  } catch (error) {
    next(error);
  }
};
