import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { slugController } from './controllers/slug.controller';
import { userThreadsController } from './controllers/user-threads.controller';
import { userController } from './controllers/user.controller';
import { usersController } from './controllers/users.controller';

const router = Router();

router.get('/slug', authMiddleware, slugController);
router.get('/:slugOrId/threads', userThreadsController);
router.get('/:slugOrId', userController);
router.get('/', usersController);

export default router;
