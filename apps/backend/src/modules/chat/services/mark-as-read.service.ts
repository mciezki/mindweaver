import prisma from "../../../database/prisma";
import { getMessage } from "../../../locales";

export const markAsRead = async (userId: string,
    conversationId: string,
): Promise<void> => {
    try {

        await prisma.conversationParticipant.update({
            where: {
                userId_conversationId: {
                    userId, conversationId
                }
            },
            data: {
                lastReadAt: new Date()
            }
        })

    } catch (error: any) {
        if (error.code === 'P2025') {
            const err: any = new Error(getMessage('error.notFound'));
            err.statusCode = 404;
            throw err;
        }
        throw error;
    }
}