import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { findOrCreateConversation } from '../services/find-or-create-conversation.service';

export const findOrCreateConversationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { participantId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.unauthorized'));
      err.statusCode = 401;
      throw err;
    }

    const { conversation, isNew } = await findOrCreateConversation(
      userId,
      participantId,
    );

    res.status(isNew ? 201 : 200).json(conversation);
  } catch (error) {
    next(error);
  }
};
