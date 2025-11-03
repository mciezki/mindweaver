import {
  CommentResponse,
  PublicationArticleComment,
  PublicationArticleCommentRequest,
  ThreadCommentRequest,
} from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../../../database/prisma';
import { getMessage } from '../../../../../locales';

export const updateArticleComment = async (
  commentId: string,
  commentData: Partial<PublicationArticleCommentRequest>,
): Promise<PublicationArticleComment> => {
  try {
    const dataToUpdate: Prisma.PublicationArticleCommentUpdateInput = {};

    if (commentData.content !== undefined) {
      dataToUpdate.content = commentData.content;
    }

    const updatedComment = await prisma.publicationArticleComment.update({
      where: { id: commentId },
      data: dataToUpdate,
      select: {
        id: true,
        articleId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
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

    return updatedComment;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: any = new Error(getMessage('error.notFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
