import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createThread } from "./controllers/create-thread.controller";
import { deleteThread } from "./controllers/delete-thread.controller";
import { createOwnershipMiddleware } from "../../middlewares/createOwnership.middleware";
import { updateThread } from "./controllers/update-thread.controller";
import { threads } from "./controllers/threads.controller";
import { thread } from "./controllers/thread.controller";

import { validateCreateThread, validateUpdateThread } from "./threads.validator";
import upload from "../../config/multer.config";

const isThreadOwner = createOwnershipMiddleware('socialThread');

const router = Router();

router.post('/create', authMiddleware, upload.array('media', 5), validateCreateThread, createThread)
router.patch('/:id', authMiddleware, isThreadOwner, upload.array('media', 5), validateUpdateThread, updateThread)
router.delete('/:id', authMiddleware, isThreadOwner, deleteThread)
router.get('/', threads)
router.get('/:id', thread)

export default router;
