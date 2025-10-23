import {
  PaginationOptions,
  PublicThreadsList,
  ThreadResponse,
} from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../database/prisma';
import { shuffleArray } from '../../../utils/functions/shuffle-array';
import { fullThreadSelectShape, simpleThreadSelectShape } from '../threads.utils';

export const getPublicThreadsList = async (
  options: PaginationOptions,
): Promise<PublicThreadsList> => {
  const { page = 1, limit = 10, search = '' } = options;
  const skip = (page - 1) * limit;

  const hasSearchTerm = search.trim() !== '';

  const whereCondition: Prisma.SocialThreadWhereInput = {
    user: { active: true },
    ...(hasSearchTerm && {
      OR: [
        { content: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { surname: { contains: search, mode: 'insensitive' } },
              { profileName: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ],
    }),
  };



  try {
    let threads: ThreadResponse[];
    const totalCount = await prisma.socialThread.count({
      where: whereCondition,
    });

    if (hasSearchTerm) {
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

      threads = threadsFromDb.map(({ _count, ...threadData }) => ({
        ...threadData,
        counts: {
          likes: _count.likes,
          comments: _count.comments,
          shares: _count.shares
        },
      }));
    } else {
      if (totalCount === 0) {
        threads = [];
      } else {
        const take = Math.min(limit, totalCount);
        const randomOffsets = new Set<number>();
        while (randomOffsets.size < take) {
          randomOffsets.add(Math.floor(Math.random() * totalCount));
        }

        const promises = Array.from(randomOffsets).map((offset) =>
          prisma.socialThread.findFirst({
            where: whereCondition,
            skip: offset,
            take: 1,
            select: {
              ...fullThreadSelectShape,
              originalThread: {
                select: simpleThreadSelectShape,
              },
            },
          }),
        );

        const results = await Promise.all(promises);

        const validThreads = results.filter((thread) => thread !== null);
        const mappedThreads = validThreads.map(({ _count, ...threadData }): ThreadResponse => ({
          ...threadData,
          counts: {
            likes: _count.likes,
            comments: _count.comments,
            shares: _count.shares
          },
        }));

        threads = shuffleArray(mappedThreads) as ThreadResponse[];
      }
    }

    const totalPages = Math.ceil(totalCount / limit);

    return { threads, totalCount, totalPages };
  } catch (error: any) {
    throw error;
  }
};
