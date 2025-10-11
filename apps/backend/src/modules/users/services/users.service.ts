import { PaginationOptions, PublicUserList } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { Prisma } from '@prisma/client';

export const getPublicUsersList = async (options: PaginationOptions): Promise<PublicUserList> => {
    const { page = 1, limit = 10, search = '' } = options;
    const skip = (page - 1) * limit;

    const searchCondition: Prisma.UserWhereInput | undefined = search.trim() !== '' ? {
        OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
            { surname: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { profileName: { contains: search, mode: 'insensitive' } },
        ]
    } : undefined

    const whereCondition: Prisma.UserWhereInput = {
        active: true,
        ...searchCondition,
    };

    try {
        const users = await prisma.user.findMany({
            where: whereCondition,
            skip: skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                birthday: true,
                sex: true,
                createdAt: true,
                profileName: true,
                slug: true,
                description: true,
                profileImage: true,
                coverImage: true,
            },
        });

        const totalCount = await prisma.user.count({
            where: whereCondition
        })

        const totalPages = Math.ceil(totalCount / limit)

        return { users, totalCount, totalPages };
    } catch (error: any) {
        throw error;
    }
};
