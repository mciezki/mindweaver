import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../locales';

export const validateCreateConversation = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const { participantId } = req.body;
    const userId = req.user?.userId;

    if (!participantId || typeof participantId !== 'string') {
        res
            .status(400)
            .json({ message: getMessage('conversations.validation.participantId') });
        return;
    }

    if (participantId === userId) {
        res
            .status(400)
            .json({
                message: getMessage('conversations.validation.cannotChatWithSelf'),
            });
        return;
    }

    next();
};

export const validateCreateMessage = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({
            message: getMessage('conversations.validation.message.required')
        });
        return;
    }

    if (content.length > 5000) {
        res.status(400).json({
            message: getMessage('conversations.validation.message.max')
        });
        return;
    }

    next();
};