import {
  CreatePublicationArticle,
} from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../../locales';
import { uploadImageToCloudinary } from '../../../../services/cloudinary.service';
import { createNewArticle } from '../../services/articles/create-article.service';

export const createArticle = async (
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

    const articleData: CreatePublicationArticle = req.body;

    if (req.files) {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      if (files['coverArticleImage'] && files['coverArticleImage'][0]) {
        const coverImageUrl = await uploadImageToCloudinary(
          files['coverArticleImage'][0],
        );
        articleData.coverImage = coverImageUrl;
      }
    }

    const createdArticle = await createNewArticle(userId, articleData);

    res.status(201).json({
      message: getMessage('publications.articles.success.created'),
      article: createdArticle,
    });
  } catch (error) {
    next(error);
  }
};
