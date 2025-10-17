import { PaginationOptions, PublicThreadsList, PublicUserList } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { Prisma } from '@prisma/client';

export const getUserThreadsList = async (slugOrId: string | undefined, options: PaginationOptions): Promise<PublicThreadsList> => {
    const { page = 1, limit = 10, search = '' } = options;
    const skip = (page - 1) * limit;

    const searchCondition: Prisma.SocialThreadWhereInput | undefined = search.trim() !== '' ? {
        OR: [
            { content: { contains: search, mode: 'insensitive' } },
        ]
    } : undefined

    const whereCondition: Prisma.SocialThreadWhereInput = {
        user: {

            OR: [
                { id: slugOrId },
                { slug: slugOrId }
            ],
        },
        ...searchCondition,
    };

    try {
        const threads = await prisma.socialThread.findMany({
            where: whereCondition,
            skip: skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                mediaUrls: true,
                user: {
                    select: {
                        id: true, profileName: true, name: true, surname: true, type: true, profileImage: true
                    }
                },
            },
        });

        const totalCount = await prisma.socialThread.count({
            where: whereCondition
        })

        const totalPages = Math.ceil(totalCount / limit)

        return { threads, totalCount, totalPages };
    } catch (error: any) {
        throw error;
    }
};
