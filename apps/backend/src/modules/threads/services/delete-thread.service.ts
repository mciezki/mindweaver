import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const deleteUserThread = async (
    id: string,
) => {
    try {
        return await prisma.socialThread.delete({
            where: { id: id }

        });

    } catch (error: any) {
        if (error.code === 'P2025') {
            const err: any = new Error(getMessage('common.userNotFound'));
            err.statusCode = 404;
            throw err;
        }
        throw error;
    }
};
