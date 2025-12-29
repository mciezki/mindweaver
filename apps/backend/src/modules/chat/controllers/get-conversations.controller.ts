import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { getConversations } from '../services/get-conversations.service';

export const getConversationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { page, limit } = req.query;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.unauthorized'));
      err.statusCode = 401;
      throw err;
    }

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 20;

    if (pageNumber < 1 || limitNumber < 1) {
      const err: any = new Error(getMessage('pagination.error.invalidParams'));
      err.statusCode = 400;
      throw err;
    }

    const result = await getConversations(userId, {
      page: pageNumber,
      limit: limitNumber,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
