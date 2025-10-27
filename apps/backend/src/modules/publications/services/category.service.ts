import { PublicationCategoryResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';


export const getCategory = async (
  id: string | undefined,
): Promise<PublicationCategoryResponse> => {
  try {
    const categoryFromDb = await prisma.publicationCategory.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            articles: true
          }
        }
      },
    });

    if (!categoryFromDb) {
      const err: any = new Error(getMessage('publications.categories.error.notFound'));
      err.statusCode = 404;
      throw err;
    }

    const { _count, ...categoryData } = categoryFromDb;

    return {
      ...categoryData,
      articlesNumber: _count.articles
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
