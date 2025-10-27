import { PublicationCategoryResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';

export const getUserCategories = async (
  userId: string,
): Promise<PublicationCategoryResponse[]> => {
  try {
    const categoriesFromDb = await prisma.publicationCategory.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
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
            articles: true,
          },
        },
      },
    });

    const categories = categoriesFromDb.map(({ _count, ...categoryData }) => ({
      ...categoryData,
      articlesNumber: _count.articles,
    }));

    return categories;
  } catch (error: any) {
    throw error;
  }
};
