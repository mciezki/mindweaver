import { PaginationOptions, PublicThreadsList } from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../database/prisma';
import {
  fullThreadSelectShape,
  simpleThreadSelectShape,
} from '../../threads/threads.utils';

export const getUserThreadsList = async (
  slugOrId: string | undefined,
  options: PaginationOptions,
): Promise<PublicThreadsList> => {
  const { page = 1, limit = 10, search = '' } = options;
  const skip = (page - 1) * limit;

  const searchCondition: Prisma.SocialThreadWhereInput | undefined =
    search.trim() !== ''
      ? {
          OR: [{ content: { contains: search, mode: 'insensitive' } }],
        }
      : undefined;

  const whereCondition: Prisma.SocialThreadWhereInput = {
    user: {
      OR: [{ id: slugOrId }, { slug: slugOrId }],
    },
    ...searchCondition,
  };

  try {
    const threadsFromDb = await prisma.socialThread.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        ...fullThreadSelectShape,
        originalThread: {
          select: simpleThreadSelectShape,
        },
      },
    });

    const threads = threadsFromDb.map(({ _count, ...threadData }) => ({
      ...threadData,
      counts: {
        likes: _count.likes,
        comments: _count.comments,
        shares: _count.shares,
      },
    }));

    const totalCount = await prisma.socialThread.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return { threads, totalCount, totalPages };
  } catch (error: any) {
    throw error;
  }
};
