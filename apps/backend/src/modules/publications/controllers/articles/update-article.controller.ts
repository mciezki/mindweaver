import {
    CreatePublicationArticle,
    CreateThreadRequest,
} from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { deleteImageFromCloudinary, uploadImageToCloudinary } from '../../../../services/cloudinary.service';
import { updateUserArticle } from '../../services/articles/update-article.service';
import prisma from '../../../../database/prisma';

export const updateArticle = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { articleId } = req.params;
        const articleData: Partial<CreatePublicationArticle> = req.body;

        const currentArticle = await prisma.publicationArticle.findUnique({
            where: { id: articleId },
            select: { coverImage: true },
        });

        if (!currentArticle) {
            const err: any = new Error(getMessage('error.notFound'));
            err.statusCode = 404;
            throw err;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const newCoverImageFile = files?.['coverArticleImage']?.[0];

        if (newCoverImageFile) {
            if (currentArticle.coverImage) {
                await deleteImageFromCloudinary(currentArticle.coverImage);
            }
            articleData.coverImage = await uploadImageToCloudinary(newCoverImageFile);
        } else if (articleData.coverImage === null) {
            if (currentArticle.coverImage) {
                await deleteImageFromCloudinary(currentArticle.coverImage);
            }
        }

        const updatedArticle = await updateUserArticle(articleId, articleData);

        res.status(200).json({
            message: getMessage('publications.articles.success.updated'),
            article: updatedArticle,
        });
    } catch (error) {
        next(error);
    }
};
