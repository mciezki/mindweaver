import { CreatePublicationCategoryRequest, PublicationCategory } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const createNewCategory = async (
  userId: string,
  categoryData: CreatePublicationCategoryRequest,
): Promise<PublicationCategory> => {
  try {
    const newCategory = await prisma.publicationCategory.create({
      data: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        user: { connect: { id: userId } },
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        slug: true,
        description: true,
      },
    });

    return newCategory
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      const err: any = new Error(getMessage('publications.categories.error.slugExists'));
      err.statusCode = 409;
      throw err;
    }
    if (error.code === 'P2003') {
      const err: any = new Error(getMessage('common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
