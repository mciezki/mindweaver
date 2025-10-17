import { Router } from "express";
import { user } from "./controllers/user.controller";
import { users } from "./controllers/users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { slug } from "./controllers/slug.controller";
import { userThreads } from "./controllers/user-threads.controller";

const router = Router();

router.get('/slug', authMiddleware, slug)
router.get('/:slugOrId/threads', userThreads)
router.get('/:slugOrId', user)
router.get('/', users)

export default router;