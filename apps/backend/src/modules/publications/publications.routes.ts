import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { createOwnershipMiddleware } from '../../middlewares/createOwnership.middleware';
import { categories } from './controllers/categories.controller';
import { category } from './controllers/category.controller';
import { createCategory } from './controllers/create-category.controller';
import { deleteCategory } from './controllers/delete-category.controller';
import { updateCategory } from './controllers/update-category.controller';
import {
  validateCreateCategory,
  validateUpdateCategory,
} from './publications.validator';

const isCategoryOwner = createOwnershipMiddleware(
  'publicationCategory',
  'categoryId',
);

const router = Router();

router.get('/user/:userId/categories', categories);

router.post(
  '/categories',
  authMiddleware,
  validateCreateCategory,
  createCategory,
);

router.get('/categories/:categoryId', category);

router.patch(
  '/categories/:categoryId',
  authMiddleware,
  isCategoryOwner,
  validateUpdateCategory,
  updateCategory,
);

router.delete(
  '/categories/:categoryId',
  authMiddleware,
  isCategoryOwner,
  deleteCategory,
);

export default router;
