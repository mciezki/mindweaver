import { ThreadResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const getThread = async (
  id: string | undefined,
): Promise<ThreadResponse> => {
  try {
    const threadFromDb = await prisma.socialThread.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        mediaUrls: true,
        user: {
          select: {
            id: true,
            profileName: true,
            name: true,
            surname: true,
            type: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!threadFromDb) {
      const err: any = new Error(getMessage('threads.error.notFound'));
      err.statusCode = 404;
      throw err;
    }

    const { _count, ...threadData } = threadFromDb;

    return {
      ...threadData,
      counts: {
        likes: _count.likes,
        comments: _count.comments,
      },
    };
  } catch (error: any) {
    if (error.code === 'P2023') {
      const err: any = new Error(getMessage('threads.error.invalidId'));
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
};
