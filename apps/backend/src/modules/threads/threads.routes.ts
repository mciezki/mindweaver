import { Router } from 'express';

import upload from '../../config/multer.config';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { createOwnershipMiddleware } from '../../middlewares/createOwnership.middleware';
import { threadComment } from './controllers/comments/create-comment.controller';
import { deleteComment } from './controllers/comments/delete-comment.controller';
import { createThread } from './controllers/create-thread.controller';
import { deleteThread } from './controllers/delete-thread.controller';
import { thread } from './controllers/thread.controller';
import { threads } from './controllers/threads.controller';
import { threadLike } from './controllers/toggle-thread-like.controller';
import { updateThread } from './controllers/update-thread.controller';
import {
  validateCreateThread,
  validateCreateThreadComment,
  validateUpdateThread,
} from './threads.validator';

const isThreadOwner = createOwnershipMiddleware('socialThread');
const isCommentOwner = createOwnershipMiddleware('socialThreadComment');

const router = Router();

router.post(
  '/create',
  authMiddleware,
  upload.array('media', 5),
  validateCreateThread,
  createThread,
);

router.patch(
  '/:id',
  authMiddleware,
  isThreadOwner,
  upload.array('media', 5),
  validateUpdateThread,
  updateThread,
);

router.delete('/:id', authMiddleware, isThreadOwner, deleteThread);
router.get('/', threads);
router.get('/:id', thread);

// likes
router.post('/:id/like', authMiddleware, threadLike);

// comments
router.post(
  '/:id/comment',
  authMiddleware,
  validateCreateThreadComment,
  threadComment,
);
router.delete('/comments/:id', authMiddleware, isCommentOwner, deleteComment);

export default router;
