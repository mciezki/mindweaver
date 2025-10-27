import { CreatePublicationCategoryRequest, PublicationCategory } from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';


export const updatePublicationCategory = async (
    id: string,
    categoryData: Partial<CreatePublicationCategoryRequest>,
): Promise<PublicationCategory> => {
    try {
        const dataToUpdate: Prisma.PublicationCategoryUpdateInput = {};

        if (categoryData.name !== undefined) {
            dataToUpdate.name = categoryData.name;
        }
        if (categoryData.description !== undefined) {
            dataToUpdate.description = categoryData.description;
        }
        if (categoryData.slug !== undefined) {
            dataToUpdate.slug = categoryData.slug;
        }

        const updatedCategory = await prisma.publicationCategory.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                name: true,
                slug: true,
                description: true
            },
        });

        return updatedCategory;
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            const err: any = new Error(getMessage('publications.categories.error.slugExists'));
            err.statusCode = 409;
            throw err;
        }
        if (error.code === 'P2025') {
            const err: any = new Error(getMessage('error.notFound'));
            err.statusCode = 404;
            throw err;
        }
        throw error;
    }
};
