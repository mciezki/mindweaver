import { NextFunction, Request, Response } from 'express';
import prisma from '../database/prisma';
import { getMessage } from '../locales';

export const isConversationParticipant = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: getMessage('auth.error.unauthorized') });
            return
        }

        if (!conversationId) {
            res.status(400).json({
                message: getMessage('conversations.validation.conversationId')
            });
            return
        }

        const participant = await prisma.conversationParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: userId,
                    conversationId: conversationId,
                },
            },
        });

        if (!participant) {
            res.status(403).json({ message: getMessage('auth.error.forbidden') });
            return
        }

        next();
    } catch (error) {
        next(error);
    }
};