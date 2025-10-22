import { Router } from 'express';

import upload from '../../config/multer.config';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { createOwnershipMiddleware } from '../../middlewares/createOwnership.middleware';
import { commentLikes } from './controllers/comments/comment-likes.controller';
import { commentReplies } from './controllers/comments/comment-replies.controller';
import { comments } from './controllers/comments/comments.controller';
import { createComment } from './controllers/comments/create-comment.controller';
import { deleteComment } from './controllers/comments/delete-comment.controller';
import { commentLike } from './controllers/comments/toggle-comment-like.controller';
import { updateComment } from './controllers/comments/update-comment.controller';
import { createThread } from './controllers/create-thread.controller';
import { deleteThread } from './controllers/delete-thread.controller';
import { threadLikes } from './controllers/thread-likes.controller';
import { thread } from './controllers/thread.controller';
import { threads } from './controllers/threads.controller';
import { threadLike } from './controllers/toggle-thread-like.controller';
import { updateThread } from './controllers/update-thread.controller';
import {
  validateCreateThread,
  validateCreateThreadComment,
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
  createThread,
);

router.patch(
  '/:threadId',
  authMiddleware,
  isThreadOwner,
  upload.array('media', 5),
  validateUpdateThread,
  updateThread,
);

router.delete('/:threadId', authMiddleware, isThreadOwner, deleteThread);
router.get('/', threads);
router.get('/:threadId', thread);

// likes
router.post('/:threadId/like', authMiddleware, threadLike);
router.get('/:threadId/likes', authMiddleware, threadLikes);

// comments
router.get('/:threadId/comments', authMiddleware, comments);

router.post(
  '/:threadId/comments',
  authMiddleware,
  validateCreateThreadComment,
  createComment,
);
router.delete(
  '/comments/:commentId',
  authMiddleware,
  isCommentOwner,
  deleteComment,
);
router.patch(
  '/comments/:commentId',
  authMiddleware,
  isCommentOwner,
  validateUpdateThreadComment,
  updateComment,
);
router.get('/comments/:commentId/replies', authMiddleware, commentReplies);
router.get('/comments/:commentId/likes', authMiddleware, commentLikes);
router.post('/comments/:commentId/like', authMiddleware, commentLike);

export default router;
