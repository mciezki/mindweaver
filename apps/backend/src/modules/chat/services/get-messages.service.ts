import {
  MessageResponse,
  PaginatedMessages,
  PaginationOptions,
  ThreadCommentsList,
} from '@mindweave/types';

import prisma from '../../../database/prisma';
import { mapMessageToResponse, messageSelect } from '../chat.utils';

export const getConversationMessages = async (
  conversationId: string,
  options: PaginationOptions,
): Promise<PaginatedMessages> => {
  const { page = 1, limit = 30 } = options;
  const skip = (page - 1) * limit;

  const whereCondition = {
    conversationId,
  };

  try {
    const [messagesFromDb, totalCount] = await prisma.$transaction([
      prisma.conversationMessage.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: messageSelect,
      }),
      prisma.conversationMessage.count({ where: whereCondition }),
    ]);

    const messages: MessageResponse[] =
      messagesFromDb.map(mapMessageToResponse);

    const totalPages = Math.ceil(totalCount / limit);

    return { messages, totalCount, totalPages };
  } catch (error: any) {
    throw error;
  }
};
