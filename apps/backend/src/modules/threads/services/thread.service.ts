import { ThreadResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { fullThreadSelectShape, simpleThreadSelectShape } from '../threads.utils';

export const getThread = async (
  id: string | undefined,
): Promise<ThreadResponse> => {
  try {
    const threadFromDb = await prisma.socialThread.findUnique({
      where: {
        id,
      },
      select: {
        ...fullThreadSelectShape,
        originalThread: {
          select: simpleThreadSelectShape,
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
        shares: _count.shares
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
