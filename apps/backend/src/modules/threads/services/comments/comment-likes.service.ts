import {
    PaginationOptions,
    LikesList,
} from '@mindweave/types';

import prisma from '../../../../database/prisma';

export const getCommentLikes = async (
    commentId: string,
    options: PaginationOptions,
): Promise<LikesList> => {
    const { page = 1, limit = 25 } = options;
    const skip = (page - 1) * limit;

    const whereCondition = {
        commentId,
    };

    try {
        const [likes, totalCount] = await prisma.$transaction([
            prisma.socialThreadCommentLike.findMany({
                where: whereCondition,
                skip: skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            profileName: true,
                            profileImage: true,
                            type: true,
                        },
                    },
                },
            }),
            prisma.socialThreadCommentLike.count({ where: whereCondition }),
        ]);


        const totalPages = Math.ceil(totalCount / limit);

        return { likes, totalCount, totalPages };
    } catch (error: any) {
        throw error;
    }
};
