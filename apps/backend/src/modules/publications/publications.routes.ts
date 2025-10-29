import { Router } from 'express';

import upload from '../../config/multer.config';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { createOwnershipMiddleware } from '../../middlewares/createOwnership.middleware';
import { createArticle } from './controllers/articles/create-article.controller';
import { categories } from './controllers/categories.controller';
import { category } from './controllers/category.controller';
import { createCategory } from './controllers/create-category.controller';
import { deleteCategory } from './controllers/delete-category.controller';
import { updateCategory } from './controllers/update-category.controller';
import {
  validateChangeArticleStatus,
  validateCreateArticle,
  validateCreateCategory,
  validateUpdateArticle,
  validateUpdateCategory,
} from './publications.validator';
import { changeStatus } from './controllers/articles/change-article-status.controller';
import { deleteArticle } from './controllers/articles/delete-article.controller';
import { updateArticle } from './controllers/articles/update-article.controller';

const isCategoryOwner = createOwnershipMiddleware(
  'publicationCategory',
  'categoryId',
);

const isArticleOwner = createOwnershipMiddleware(
  'publicationArticle',
  'articleId',
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

router.post(
  '/articles/create',
  authMiddleware,
  upload.fields([{ name: 'coverArticleImage', maxCount: 1 }]),
  validateCreateArticle,
  createArticle,
);

router.patch(
  '/articles/:articleId/status',
  authMiddleware,
  isArticleOwner,
  validateChangeArticleStatus,
  changeStatus,
);

router.delete(
  '/articles/:articleId',
  authMiddleware,
  isArticleOwner,
  deleteArticle,
);

router.patch(
  '/articles/:articleId',
  authMiddleware,
  isArticleOwner,
  upload.fields([{ name: 'coverArticleImage', maxCount: 1 }]),
  validateUpdateArticle,
  updateArticle,
);

export default router;
