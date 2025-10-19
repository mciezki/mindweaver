import { ToggleLikeResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const toggleThreadLike = async (
  userId: string,
  threadId: string,
): Promise<ToggleLikeResponse> => {
  try {
    const existingLike = await prisma.socialThreadLike.findUnique({
      where: {
        userId_threadId: {
          userId,
          threadId,
        },
      },
    });

    if (existingLike) {
      await prisma.socialThreadLike.delete({
        where: {
          userId_threadId: {
            userId,
            threadId,
          },
        },
      });
    } else {
      await prisma.socialThreadLike.create({
        data: {
          userId,
          threadId,
        },
      });
    }

    return {
      liked: !existingLike,
    };
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: any = new Error(getMessage('threads.error.notFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
