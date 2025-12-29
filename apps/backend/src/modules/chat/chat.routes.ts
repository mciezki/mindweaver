import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { isConversationParticipant } from '../../middlewares/isConversationParticipant.middleware';
import {
  validateCreateConversation,
  validateCreateMessage,
} from './chat.validator';
import { createMessageController } from './controllers/create-message.controller';
import { findOrCreateConversationController } from './controllers/find-or-create-conversation.controller';
import { getConversationsController } from './controllers/get-conversations.controller';
import { getMessagesController } from './controllers/get-messages.controller';
import { markAsReadController } from './controllers/mark-as-read.controller';

const router = Router();

router.post(
  '/conversations',
  authMiddleware,
  validateCreateConversation,
  findOrCreateConversationController,
);

router.post(
  '/conversations/:conversationId/messages',
  authMiddleware,
  isConversationParticipant,
  validateCreateMessage,
  createMessageController,
);

router.get(
  '/conversations/:conversationId/messages',
  authMiddleware,
  isConversationParticipant,
  getMessagesController,
);

router.post(
  '/conversations/:conversationId/read',
  authMiddleware,
  isConversationParticipant,
  markAsReadController,
);

router.get('/conversations', authMiddleware, getConversationsController);

export default router;
