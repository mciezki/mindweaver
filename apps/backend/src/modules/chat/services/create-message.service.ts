import { CreateMessageRequest, MessageResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { mapMessageToResponse, messageSelect } from '../chat.utils';

interface CreateMessageResult {
  message: MessageResponse;
  recipients: string[];
}

export const createMessage = async (
  userId: string,
  conversationId: string,
  data: CreateMessageRequest,
): Promise<CreateMessageResult> => {
  try {
    const [newMessage, updatedConversation] = await prisma.$transaction([
      prisma.conversationMessage.create({
        data: {
          content: data.content,
          conversationId: conversationId,
          senderId: userId,
        },
        select: messageSelect,
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
        include: { participants: { select: { userId: true } } },
      }),
    ]);

    const recipientIds = updatedConversation.participants.map(
      (participant) => participant.userId,
    );

    return {
      message: mapMessageToResponse(newMessage),
      recipients: recipientIds,
    };
  } catch (error: any) {
    if (error.code === 'P2003') {
      const err: any = new Error(getMessage('error.badRequest'));
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
};
