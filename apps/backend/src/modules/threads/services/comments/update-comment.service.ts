import { CommentResponse, ThreadCommentRequest } from '@mindweave/types';
import { Prisma } from '@prisma/client';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const updateThreadComment = async (
  id: string,
  commentData: Partial<ThreadCommentRequest>,
): Promise<CommentResponse> => {
  try {
    const dataToUpdate: Prisma.SocialThreadCommentUpdateInput = {};

    if (commentData.content !== undefined) {
      dataToUpdate.content = commentData.content;
    }

    const updatedComment = await prisma.socialThreadComment.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        parentId: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            profileName: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    const { _count, ...rest } = updatedComment;
    const transformedComment = {
      ...rest,
      counts: { likes: _count.likes, replies: _count.replies },
    };

    return transformedComment;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: any = new Error(getMessage('error.notFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
