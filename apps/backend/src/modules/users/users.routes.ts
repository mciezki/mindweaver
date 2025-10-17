import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { slug } from './controllers/slug.controller';
import { userThreads } from './controllers/user-threads.controller';
import { user } from './controllers/user.controller';
import { users } from './controllers/users.controller';

const router = Router();

router.get('/slug', authMiddleware, slug);
router.get('/:slugOrId/threads', userThreads);
router.get('/:slugOrId', user);
router.get('/', users);

export default router;
