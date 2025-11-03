import {
  ArticleStatus,
  PaginationOptions,
  PublicationArticlesList,
} from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../../database/prisma';

export const getUserArticlesList = async (
  userId: string,
  slugOrCategoryId: string,
  status: ArticleStatus,
  options: PaginationOptions,
): Promise<PublicationArticlesList> => {
  const { page = 1, limit = 10, search = '' } = options;
  const skip = (page - 1) * limit;

  const searchCondition: Prisma.PublicationArticleWhereInput | undefined =
    search.trim() !== ''
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

  const whereCondition: Prisma.PublicationArticleWhereInput = {
    userId,
    status,
    category: {
      OR: [{ id: slugOrCategoryId }, { slug: slugOrCategoryId }],
    },
    ...searchCondition,
  };

  try {
    const [articlesFromDb, totalCount] = await prisma.$transaction([
      prisma.publicationArticle.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          categoryId: true,
          title: true,
          contentHtml: true,
          coverImage: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
          slug: true,
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
              comments: true,
              rates: true,
            },
          },
        },
      }),
      prisma.publicationArticle.count({
        where: whereCondition,
      }),
    ]);

    const articles = articlesFromDb.map(({ _count, ...article }) => ({
      ...article,
      counts: {
        comments: _count.comments,
        rates: _count.rates,
      },
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return { articles, totalCount, totalPages };
  } catch (error: any) {
    throw error;
  }
};
