import { ConversationResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { mapConversationToResponse } from '../chat.utils';

interface FindOrCreateResult {
  conversation: ConversationResponse;
  isNew: boolean;
}

export const findOrCreateConversation = async (
  userId: string,
  participantId: string,
): Promise<FindOrCreateResult> => {
  try {
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: userId } } },
          { participants: { some: { userId: participantId } } },
          {
            participants: {
              every: { userId: { in: [userId, participantId] } },
            },
          },
        ],
      },
      include: {
        participants: true,
      },
    });

    if (existingConversation) {
      const mappedConversation =
        await mapConversationToResponse(existingConversation);
      return { conversation: mappedConversation, isNew: false };
    }

    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId: userId }, { userId: participantId }],
        },
      },
      include: {
        participants: true,
      },
    });

    const mappedConversation = await mapConversationToResponse(newConversation);
    return { conversation: mappedConversation, isNew: true };
  } catch (error: any) {
    if (error.code === 'P2003' || error.code === 'P2025') {
      const err: any = new Error(getMessage('auth.common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
