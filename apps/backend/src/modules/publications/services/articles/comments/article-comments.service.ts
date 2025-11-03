import {
  ArticleCommentCommentsList,
  PaginationOptions,
  ThreadCommentsList,
} from '@mindweave/types';

import prisma from '../../../../../database/prisma';

export const getArticleComments = async (
  articleId: string,
  options: PaginationOptions,
): Promise<ArticleCommentCommentsList> => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const whereCondition = {
    articleId,
  };

  try {
    const [comments, totalCount] = await prisma.$transaction([
      prisma.publicationArticleComment.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          articleId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
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
      prisma.publicationArticleComment.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { comments, totalCount, totalPages };
  } catch (error: any) {
    throw error;
  }
};
