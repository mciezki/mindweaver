import {
  ConversationResponse,
  InboxResponse,
  PaginationOptions,
} from '@mindweave/types';

import prisma from '../../../database/prisma';
import {
  mapConversationToResponse,
  mapMessageToResponse,
  messageSelect,
} from '../chat.utils';

export const getConversations = async (
  userId: string,
  options: PaginationOptions,
): Promise<InboxResponse> => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const whereCondition = {
    participants: {
      some: {
        userId,
      },
    },
  };

  try {
    const [conversationsFromDb, totalCount] = await prisma.$transaction([
      prisma.conversation.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          lastMessageAt: 'desc',
        },
        include: {
          participants: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: messageSelect,
          },
        },
      }),
      prisma.conversation.count({ where: whereCondition }),
    ]);

    const conversations: ConversationResponse[] = await Promise.all(
      conversationsFromDb.map(async (conversation) => {
        const baseResponse = await mapConversationToResponse(conversation);

        const myParticipantEntry = conversation.participants.find(
          (participant) => participant.userId === userId,
        );
        const lastReadAt = myParticipantEntry?.lastReadAt || new Date(0);

        const unreadCount = await prisma.conversationMessage.count({
          where: {
            conversationId: conversation.id,
            createdAt: {
              gt: lastReadAt,
            },
          },
        });

        const lastMessagePayload = conversation.messages[0];
        const lastMessage = lastMessagePayload
          ? mapMessageToResponse(lastMessagePayload)
          : null;

        return {
          ...baseResponse,
          unreadCount,
          lastMessage,
        };
      }),
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      conversations,
      meta: {
        totalCount,
        currentPage: page,
        totalPages,
        limit,
      },
    };
  } catch (error) {
    throw error;
  }
};
