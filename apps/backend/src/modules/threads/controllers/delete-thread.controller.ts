import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { deleteUserThread } from '../services/delete-thread.service';

export const deleteThread = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user?.userId;

        const { id } = req.params;

        if (!userId) {
            const err: any = new Error(getMessage('auth.error.invalidToken'));
            err.statusCode = 401;
            throw err;
        }

        await deleteUserThread(id);

        res.status(200).json({
            message: getMessage('threads.success.deleted'),
        });
    } catch (error) {
        next(error);
    }
};
