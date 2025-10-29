import {
    ArticleChangeStatusRequest,
    PublicationArticle,
} from '@mindweave/types';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const changeArticleStatus = async (
    id: string,
    data: ArticleChangeStatusRequest,
): Promise<PublicationArticle> => {
    try {
        const [updatedArticle, likes, dislikes] = await prisma.$transaction([

            prisma.publicationArticle.update({
                where: { id },
                data: { status: data.status },
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
        throw error;
    }
};
