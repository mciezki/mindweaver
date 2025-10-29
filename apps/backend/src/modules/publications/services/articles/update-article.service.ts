import {
    CreatePublicationArticle,
    PublicationArticle,
} from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const updateUserArticle = async (
    id: string,
    articleData: Partial<CreatePublicationArticle>,
): Promise<PublicationArticle> => {
    const dataToUpdate: Prisma.PublicationArticleUpdateInput = {};

    if (articleData.title !== undefined) {
        dataToUpdate.title = articleData.title;
    }
    if (articleData.coverImage !== undefined) {
        dataToUpdate.coverImage = articleData.coverImage;
    }
    if (articleData.slug !== undefined) {
        dataToUpdate.slug = articleData.slug;
    }
    if (articleData.contentHtml !== undefined) {
        dataToUpdate.contentHtml = articleData.contentHtml;
    }
    if (articleData.categoryId !== undefined) {
        dataToUpdate.category = {
            connect: {
                id: articleData.categoryId
            }
        };
    }

    try {
        const [updatedArticle, likes, dislikes] = await prisma.$transaction([

            prisma.publicationArticle.update({
                where: { id },
                data: dataToUpdate,
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

                        }
                    }
                },
            }),
            prisma.publicationArticleRate.count({ where: { articleId: id, rate: 'LIKE' } }),
            prisma.publicationArticleRate.count({ where: { articleId: id, rate: 'DISLIKE' } })
        ])

        const { _count, ...article } = updatedArticle

        return { ...article, commentsNumber: _count.comments, rates: { likes, dislikes } };
    } catch (error: any) {
        if (error.code === 'P2025') {
            const err: any = new Error(getMessage('error.notFound'));
            err.statusCode = 404;
            throw err;
        }
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
