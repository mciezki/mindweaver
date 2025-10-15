import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createThread } from "./controllers/create-thread.controller";
import { deleteThread } from "./controllers/delete-thread.controller";
import { createOwnershipMiddleware } from "../../middlewares/createOwnership.middleware";
import upload from "../../config/multer.config";
import { updateThread } from "./controllers/update-thread.controller";

const isThreadOwner = createOwnershipMiddleware('socialThread');

const router = Router();

router.post('/create', authMiddleware, upload.array('media', 5), createThread)
router.patch('/:id', authMiddleware, upload.array('media', 5), updateThread)
router.delete('/:id', authMiddleware, isThreadOwner, deleteThread)


export default router;