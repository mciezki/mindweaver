import {
  PaginationOptions,
  PublicThreadsList,
  ThreadResponse,
} from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../database/prisma';
import { shuffleArray } from '../../../utils/functions/shuffle-array';

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

  const threadSelect = {
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
  };

  try {
    let threads: ThreadResponse[];
    const totalCount = await prisma.socialThread.count({
      where: whereCondition,
    });

    if (hasSearchTerm) {
      threads = await prisma.socialThread.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: threadSelect,
      });
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
            select: threadSelect,
          }),
        );

        const results = await Promise.all(promises);
        const validThreads = results.filter((thread) => thread !== null);
        threads = shuffleArray(validThreads) as ThreadResponse[];
      }
    }

    const totalPages = Math.ceil(totalCount / limit);

    return { threads, totalCount, totalPages };
  } catch (error: any) {
    throw error;
  }
};
