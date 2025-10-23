import { CreateThreadRequest, ThreadResponse } from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import {
  fullThreadSelectShape,
  simpleThreadSelectShape,
} from '../threads.utils';

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
        ...fullThreadSelectShape,
        originalThread: {
          select: simpleThreadSelectShape,
        },
      },
    });

    const { _count, ...rest } = updatedThread;
    const transformedThread = {
      ...rest,
      counts: {
        likes: _count.likes,
        comments: _count.comments,
        shares: _count.shares,
      },
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
