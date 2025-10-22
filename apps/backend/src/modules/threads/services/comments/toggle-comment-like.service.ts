import { ToggleLikeResponse } from '@mindweave/types';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const toggleCommentLike = async (
  userId: string,
  commentId: string,
): Promise<ToggleLikeResponse> => {
  try {
    const existingLike = await prisma.socialThreadCommentLike.findUnique({
      where: {
        commentId_userId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      await prisma.socialThreadCommentLike.delete({
        where: {
          commentId_userId: {
            userId,
            commentId,
          },
        },
      });
    } else {
      await prisma.socialThreadCommentLike.create({
        data: {
          userId,
          commentId,
        },
      });
    }

    return {
      liked: !existingLike,
    };
  } catch (error: any) {
    if (error.code === 'P2003' || error.code === 'P2025') {
      const err: any = new Error(getMessage('threads.comment.notFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
