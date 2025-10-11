import { Router } from "express";
import { user } from "./controllers/user.controller";
import { users } from "./controllers/users.controller";

const router = Router();

router.get('/:slugOrId', user)
router.get('/', users)

export default router;