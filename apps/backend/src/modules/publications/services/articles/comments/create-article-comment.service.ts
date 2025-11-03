import {
  PublicationArticleComment,
  PublicationArticleCommentRequest,
  ThreadCommentRequest,
} from '@mindweave/types';

import prisma from '../../../../../database/prisma';
import { getMessage } from '../../../../../locales';

export const createArticleComment = async (
  userId: string,
  articleId: string,
  commentData: PublicationArticleCommentRequest,
): Promise<PublicationArticleComment> => {
  try {
    const comment = await prisma.publicationArticleComment.create({
      data: {
        content: commentData.content,
        user: { connect: { id: userId } },
        article: { connect: { id: articleId } },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        articleId: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            profileName: true,
            profileImage: true,
            type: true,
          },
        },
      },
    });

    return comment;
  } catch (error: any) {
    if (error.code === 'P2003') {
      const err: any = new Error(
        getMessage('publications.articles.error.notFound'),
      );
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
