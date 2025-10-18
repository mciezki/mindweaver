import { ThreadResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const getThread = async (
  id: string | undefined,
): Promise<ThreadResponse> => {
  try {
    const thread = await prisma.socialThread.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        mediaUrls: true,
        _count: {
          select: {
            likes: true
          }
        },
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
      },
    });

    if (!thread) {
      const err: any = new Error(getMessage('threads.error.notFound'));
      err.statusCode = 404;
      throw err;
    }

    return thread;
  } catch (error: any) {
    if (error.code === 'P2023') {
      const err: any = new Error(getMessage('threads.error.invalidId'));
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
};
