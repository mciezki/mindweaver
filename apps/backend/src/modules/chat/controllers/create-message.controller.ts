import { CreateMessageRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { getIO } from '../../../socket';
import { SOCKET_EVENTS } from '../../../utils/sockets';
import { createMessage } from '../services/create-message.service';

export const createMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.userId;
    const body: CreateMessageRequest = req.body;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.unauthorized'));
      err.statusCode = 401;
      throw err;
    }

    const { message, recipients } = await createMessage(
      userId,
      conversationId,
      body,
    );

    const io = getIO();

    recipients.forEach((recipientId) => {
      if (recipientId !== userId) {
        io.to(recipientId).emit(SOCKET_EVENTS.message, message);
        console.log(`📡 Emitted 'conversation:message' to user ${recipientId}`);
      }
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
