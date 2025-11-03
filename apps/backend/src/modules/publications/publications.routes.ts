import { Router } from 'express';

import upload from '../../config/multer.config';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { createOwnershipMiddleware } from '../../middlewares/createOwnership.middleware';
import { optionalAuthMiddleware } from '../../middlewares/optionalAuth.middleware';
import { articleController } from './controllers/articles/article.controller';
import { articlesController } from './controllers/articles/articles.controller';
import { changeStatusController } from './controllers/articles/change-article-status.controller';
import { articleCommentsController } from './controllers/articles/comments/article-comments.controller';
import { createArticleCommentController } from './controllers/articles/comments/create-article-comment.controller';
import { deleteArticleCommentController } from './controllers/articles/comments/delete-article-comment.controller';
import { updateArticleCommentController } from './controllers/articles/comments/update-article-comment.controller';
import { createArticleController } from './controllers/articles/create-article.controller';
import { deleteArticleController } from './controllers/articles/delete-article.controller';
import { articleRateController } from './controllers/articles/toggle-article-rates.controller';
import { updateArticleController } from './controllers/articles/update-article.controller';
import { categoriesController } from './controllers/categories.controller';
import { categoryController } from './controllers/category.controller';
import { createCategoryController } from './controllers/create-category.controller';
import { deleteCategoryController } from './controllers/delete-category.controller';
import { updateCategoryController } from './controllers/update-category.controller';
import {
  validateChangeArticleStatus,
  validateCreateArticle,
  validateCreateArticleComment,
  validateCreateCategory,
  validateRateArticle,
  validateUpdateArticle,
  validateUpdateArticleComment,
  validateUpdateCategory,
} from './publications.validator';

const isCategoryOwner = createOwnershipMiddleware(
  'publicationCategory',
  'categoryId',
);

const isArticleOwner = createOwnershipMiddleware(
  'publicationArticle',
  'articleId',
);

const isCommentOwner = createOwnershipMiddleware(
  'publicationArticleComment',
  'commentId',
);

const router = Router();

router.get('/user/:userId/categories', categoriesController);
router.get(
  '/user/:userId/categories/:slugOrCategoryId/articles/:status',
  optionalAuthMiddleware,
  articlesController,
);

router.post(
  '/categories',
  authMiddleware,
  validateCreateCategory,
  createCategoryController,
);

router.get('/categories/:slugOrCategoryId', categoryController);

router.patch(
  '/categories/:categoryId',
  authMiddleware,
  isCategoryOwner,
  validateUpdateCategory,
  updateCategoryController,
);

router.delete(
  '/categories/:categoryId',
  authMiddleware,
  isCategoryOwner,
  deleteCategoryController,
);

router.post(
  '/articles/create',
  authMiddleware,
  upload.fields([{ name: 'coverArticleImage', maxCount: 1 }]),
  validateCreateArticle,
  createArticleController,
);

router.patch(
  '/articles/:articleId/status',
  authMiddleware,
  isArticleOwner,
  validateChangeArticleStatus,
  changeStatusController,
);

router.get(
  '/articles/:slugOrArticleId',
  optionalAuthMiddleware,
  articleController,
);

router.delete(
  '/articles/:articleId',
  authMiddleware,
  isArticleOwner,
  deleteArticleController,
);

router.patch(
  '/articles/:articleId',
  authMiddleware,
  isArticleOwner,
  upload.fields([{ name: 'coverArticleImage', maxCount: 1 }]),
  validateUpdateArticle,
  updateArticleController,
);

router.post(
  '/articles/:articleId/rate',
  authMiddleware,
  validateRateArticle,
  articleRateController,
);

router.post(
  '/articles/:articleId/comment',
  authMiddleware,
  validateCreateArticleComment,
  createArticleCommentController,
);

router.get('/articles/:articleId/comments', articleCommentsController);

router.patch(
  '/articles/:articleId/comments/:commentId',
  authMiddleware,
  isCommentOwner,
  validateUpdateArticleComment,
  updateArticleCommentController,
);

router.delete(
  '/articles/:articleId/comments/:commentId',
  authMiddleware,
  isCommentOwner,
  deleteArticleCommentController,
);

export default router;
