import { CreateThreadRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { uploadMultipleFilesToCloudinary } from '../../../services/cloudinary.service';
import { createNewThread } from '../services/create-thread.service';

export const createThread = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            const err: any = new Error(getMessage('auth.error.invalidToken'));
            err.statusCode = 401;
            throw err;
        }

        const threadData: CreateThreadRequest = req.body;

        const files = req.files as Express.Multer.File[];

        if (files && files.length > 0) {
            const mediaUrls = await uploadMultipleFilesToCloudinary(files);
            threadData.mediaUrls = mediaUrls;
        }

        const createdThread = await createNewThread(userId, threadData);

        res.status(201).json({
            message: getMessage('threads.success.created'),
            thread: createdThread,
        });
    } catch (error) {
        next(error);
    }
};
