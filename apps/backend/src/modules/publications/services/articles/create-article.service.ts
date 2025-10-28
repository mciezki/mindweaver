import { CreatePublicationArticle, PublicationArticle } from '@mindweave/types';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const createNewArticle = async (
  userId: string,
  articleData: CreatePublicationArticle,
): Promise<PublicationArticle> => {
  try {
    const newArticleFromDb = await prisma.publicationArticle.create({
      data: {
        contentHtml: articleData.contentHtml,
        coverImage: articleData.coverImage,
        slug: articleData.slug,
        title: articleData.title,
        status: 'DRAFT',
        category: { connect: { id: articleData.categoryId } },
        user: { connect: { id: userId } },
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
      },
    });

    const { rates, ...newArticle } = newArticleFromDb;

    return {
      ...newArticle,
      commentsNumber: 0,
      rates: { likes: 0, dislikes: 0 },
    };
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      const err: any = new Error(
        getMessage('publications.articles.error.slugExists'),
      );
      err.statusCode = 409;
      throw err;
    }
    if (error.code === 'P2003') {
      const err: any = new Error(
        getMessage('publications.articles.error.notFound'),
      );
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
