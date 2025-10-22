import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { getThreadLikes } from '../services/thread-likes.service';

export const threadLikes = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { threadId } = req.params
        const { page, limit } = req.query;

        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 25;

        if (pageNumber < 1 || limitNumber < 1) {
            const err: any = new Error(getMessage('pagination.error.invalidParams'));
            err.statusCode = 400;
            throw err;
        }

        const result = await getThreadLikes(threadId, {
            page: pageNumber,
            limit: limitNumber,
        });

        res.status(200).json({
            likes: result.likes,
            meta: {
                totalCount: result.totalCount,
                currentPage: pageNumber,
                totalPages: result.totalPages,
                limit: limitNumber,
            },
        });
    } catch (error) {
        next(error);
    }
};
