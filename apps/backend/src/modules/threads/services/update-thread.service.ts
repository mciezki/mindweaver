import { CreateThreadRequest, ThreadResponse } from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const updateUserThread = async (
  id: string,
  threadData: Partial<CreateThreadRequest>,
): Promise<ThreadResponse> => {
  try {
    const dataToUpdate: Prisma.SocialThreadUpdateInput = {};

    if (threadData.content !== undefined) {
      dataToUpdate.content = threadData.content;
    }
    if (threadData.mediaUrls !== undefined) {
      dataToUpdate.mediaUrls = threadData.mediaUrls;
    }

    const updatedThread = await prisma.socialThread.update({
      where: { id },
      data: dataToUpdate,
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

    const { _count, ...rest } = updatedThread;
    const transformedThread = {
      ...rest,
      counts: { likes: _count.likes, comments: _count.comments },
    };

    return transformedThread;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: any = new Error(getMessage('error.notFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
