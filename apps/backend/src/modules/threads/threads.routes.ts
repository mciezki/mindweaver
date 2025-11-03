import { Router } from 'express';

import upload from '../../config/multer.config';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { createOwnershipMiddleware } from '../../middlewares/createOwnership.middleware';
import { commentLikesController } from './controllers/comments/comment-likes.controller';
import { commentRepliesController } from './controllers/comments/comment-replies.controller';
import { commentsController } from './controllers/comments/comments.controller';
import { createCommentController } from './controllers/comments/create-comment.controller';
import { deleteCommentController } from './controllers/comments/delete-comment.controller';
import { commentLikeController } from './controllers/comments/toggle-comment-like.controller';
import { updateCommentController } from './controllers/comments/update-comment.controller';
import { createThreadController } from './controllers/create-thread.controller';
import { deleteThreadController } from './controllers/delete-thread.controller';
import { shareThreadController } from './controllers/share-thread.controller';
import { threadLikesController } from './controllers/thread-likes.controller';
import { threadController } from './controllers/thread.controller';
import { threadsController } from './controllers/threads.controller';
import { threadLikeController } from './controllers/toggle-thread-like.controller';
import { updateThreadController } from './controllers/update-thread.controller';
import {
  validateCreateThread,
  validateCreateThreadComment,
  validateShareThread,
  validateUpdateThread,
  validateUpdateThreadComment,
} from './threads.validator';

const isThreadOwner = createOwnershipMiddleware('socialThread', 'threadId');
const isCommentOwner = createOwnershipMiddleware(
  'socialThreadComment',
  'commentId',
);

const router = Router();

router.post(
  '/create',
  authMiddleware,
  upload.array('media', 5),
  validateCreateThread,
  createThreadController,
);

router.patch(
  '/:threadId',
  authMiddleware,
  isThreadOwner,
  upload.array('media', 5),
  validateUpdateThread,
  updateThreadController,
);

router.delete(
  '/:threadId',
  authMiddleware,
  isThreadOwner,
  deleteThreadController,
);
router.get('/', threadsController);
router.get('/:threadId', threadController);
router.post(
  '/:threadId/share',
  authMiddleware,
  validateShareThread,
  shareThreadController,
);

// likes
router.post('/:threadId/like', authMiddleware, threadLikeController);
router.get('/:threadId/likes', authMiddleware, threadLikesController);

// comments
router.get('/:threadId/comments', authMiddleware, commentsController);

router.post(
  '/:threadId/comments',
  authMiddleware,
  validateCreateThreadComment,
  createCommentController,
);
router.delete(
  '/comments/:commentId',
  authMiddleware,
  isCommentOwner,
  deleteCommentController,
);
router.patch(
  '/comments/:commentId',
  authMiddleware,
  isCommentOwner,
  validateUpdateThreadComment,
  updateCommentController,
);
router.get(
  '/comments/:commentId/replies',
  authMiddleware,
  commentRepliesController,
);
router.get(
  '/comments/:commentId/likes',
  authMiddleware,
  commentLikesController,
);
router.post('/comments/:commentId/like', authMiddleware, commentLikeController);

export default router;
