import {
    PaginationOptions,
    ThreadCommentsList,
} from '@mindweave/types';

import prisma from '../../../../database/prisma';

export const getThreadCommentReplies = async (
    parentId: string,
    options: PaginationOptions,
): Promise<ThreadCommentsList> => {
    const { page = 1, limit = 2 } = options;
    const skip = (page - 1) * limit;

    const whereCondition = {
        parentId
    };

    try {
        const [commentRepliesFromDb, totalCount] = await prisma.$transaction([
            prisma.socialThreadComment.findMany({
                where: whereCondition,
                skip: skip,
                take: limit,
                orderBy: {
                    createdAt: 'asc',
                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    parentId: true,
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
                    _count: {
                        select: {
                            likes: true,
                            replies: true,
                        },
                    },
                },
            }),
            prisma.socialThreadComment.count({ where: whereCondition }),
        ]);


        const commentReplies = commentRepliesFromDb.map(({ _count, ...rest }) => ({
            ...rest,
            counts: {
                likes: _count.likes,
                replies: _count.replies
            }
        }))

        const totalPages = Math.ceil(totalCount / limit);

        return { comments: commentReplies, totalCount, totalPages };
    } catch (error: any) {
        throw error;
    }
};
