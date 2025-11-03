import { PublicationArticle } from '@mindweave/types';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const getArticle = async (
  slugOrArticleId: string | undefined,
  viewerId: string | undefined,
): Promise<PublicationArticle> => {
  try {
    if (!slugOrArticleId) {
      const err: any = new Error(getMessage('threads.error.invalidId'));
      err.statusCode = 400;
      throw err;
    }

    const [articleFromDb, likes, dislikes] = await prisma.$transaction([
      prisma.publicationArticle.findFirst({
        where: {
          OR: [{ id: slugOrArticleId }, { slug: slugOrArticleId }],
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
          rates: true,
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
            },
          },
        },
      }),
      prisma.publicationArticleRate.count({
        where: {
          article: { OR: [{ id: slugOrArticleId }, { slug: slugOrArticleId }] },
          rate: 'LIKE',
        },
      }),
      prisma.publicationArticleRate.count({
        where: {
          article: { OR: [{ id: slugOrArticleId }, { slug: slugOrArticleId }] },
          rate: 'DISLIKE',
        },
      }),
    ]);

    if (!articleFromDb) {
      const err: any = new Error(
        getMessage('publications.articles.error.notFound'),
      );
      err.statusCode = 404;
      throw err;
    }

    if (
      articleFromDb.status === 'DRAFT' &&
      articleFromDb.user.id !== viewerId
    ) {
      const err: any = new Error(
        getMessage('publications.articles.error.notFound'),
      );
      err.statusCode = 404;
      throw err;
    }

    const { _count, ...articleData } = articleFromDb;

    return {
      ...articleData,
      commentsNumber: _count.comments,
      rates: { likes, dislikes },
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
