import { ArticleRate, ToggleRateResponse } from '@mindweave/types';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const toggleArticleRates = async (
    userId: string,
    articleId: string,
    rate: ArticleRate
): Promise<ToggleRateResponse> => {
    try {
        let result: ToggleRateResponse;

        const existingRate = await prisma.publicationArticleRate.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        });

        if (existingRate) {
            if (existingRate.rate === rate) {
                await prisma.publicationArticleRate.delete({
                    where: {
                        userId_articleId: {
                            userId,
                            articleId,
                        },
                    },
                });
                result = { rate: null }
            } else {
                result = await prisma.publicationArticleRate.update({
                    where: {
                        userId_articleId: {
                            userId,
                            articleId,
                        },
                    },
                    data: { rate }
                });
                result = { rate }
            }
        } else {
            await prisma.publicationArticleRate.create({
                data: {
                    userId,
                    articleId,
                    rate,
                },
            });
            result = { rate }
        }

        return result
    } catch (error: any) {
        if (error.code === 'P2003' || error.code === 'P2025') {
            const err: any = new Error(getMessage('publications.articles.error.notFound'));
            err.statusCode = 404;
            throw err;
        }
        throw error;
    }
};
