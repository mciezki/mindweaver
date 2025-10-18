import { Router } from 'express';

import upload from '../../config/multer.config';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { createOwnershipMiddleware } from '../../middlewares/createOwnership.middleware';
import { createThread } from './controllers/create-thread.controller';
import { deleteThread } from './controllers/delete-thread.controller';
import { thread } from './controllers/thread.controller';
import { threads } from './controllers/threads.controller';
import { threadLike } from './controllers/toggle-thread-like.controller';
import { updateThread } from './controllers/update-thread.controller';
import {
  validateCreateThread,
  validateUpdateThread,
} from './threads.validator';

const isThreadOwner = createOwnershipMiddleware('socialThread');

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
router.post('/:id/like', authMiddleware, threadLike);

export default router;
