import { CreateThreadRequest, ThreadResponse } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const createNewThread = async (
    userId: string,
    threadData: CreateThreadRequest,
): Promise<ThreadResponse> => {
    try {
        const newThread = await prisma.socialThread.create({
            data: {
                content: threadData.content,
                mediaUrls: threadData.mediaUrls,
                user: { connect: { id: userId } }
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                mediaUrls: true,
                user: {
                    select: {
                        id: true,
                        profileName: true,
                        name: true,
                        surname: true,
                        type: true,
                        profileImage: true,
                    }
                }
            }
        });

        return newThread;
    } catch (error: any) {
        if (error.code === 'P2025') {
            const err: any = new Error(getMessage('common.userNotFound'));
            err.statusCode = 404;
            throw err;
        }
        throw error;
    }
};
