import { NextFunction, Request, Response } from 'express';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import {
  deleteMultipleImagesFromCloudinary,
  uploadMultipleFilesToCloudinary,
} from '../../../services/cloudinary.service';
import { updateUserThread } from '../services/update-thread.service';

interface UpdateThreadBody {
  content?: string;
  existingMediaUrls?: string;
}

export const updateThread = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const currentThread = await prisma.socialThread.findUnique({
      where: { id },
      select: { mediaUrls: true },
    });

    if (!currentThread) {
      const err: any = new Error(getMessage('error.notFound'));
      err.statusCode = 404;
      throw err;
    }

    const {
      content,
      existingMediaUrls: existingMediaUrlsJSON,
    }: UpdateThreadBody = req.body;
    const newFiles = req.files as Express.Multer.File[];

    let existingMediaUrls: string[] = [];
    if (existingMediaUrlsJSON) {
      try {
        existingMediaUrls = JSON.parse(existingMediaUrlsJSON);
      } catch {
        const err: any = new Error(getMessage('upload.error.invalidFileType'));
        err.statusCode = 400;
        throw err;
      }
    }

    const newlyUploadedUrls = await uploadMultipleFilesToCloudinary(newFiles);

    const finalMediaUrls = [...existingMediaUrls, ...newlyUploadedUrls];

    const urlsToDelete = currentThread.mediaUrls.filter(
      (url) => !finalMediaUrls.includes(url),
    );

    await deleteMultipleImagesFromCloudinary(urlsToDelete);

    const updatedThread = await updateUserThread(id, {
      content,
      mediaUrls: finalMediaUrls,
    });

    res.status(200).json({
      message: getMessage('threads.success.updated'),
      thread: updatedThread,
    });
  } catch (error) {
    next(error);
  }
};
