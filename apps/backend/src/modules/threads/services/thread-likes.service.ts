import { LikesList, PaginationOptions } from '@mindweave/types';

import prisma from '../../../database/prisma';

export const getThreadLikes = async (
  threadId: string,
  options: PaginationOptions,
): Promise<LikesList> => {
  const { page = 1, limit = 25 } = options;
  const skip = (page - 1) * limit;

  const whereCondition = {
    threadId,
  };

  try {
    const [likes, totalCount] = await prisma.$transaction([
      prisma.socialThreadLike.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              profileName: true,
              profileImage: true,
              type: true,
            },
          },
        },
      }),
      prisma.socialThreadLike.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { likes, totalCount, totalPages };
  } catch (error: any) {
    throw error;
  }
};
