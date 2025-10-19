import { CommentResponse, ThreadCommentRequest } from '@mindweave/types';

import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const createThreadComment = async (
  userId: string,
  threadId: string,
  commentData: ThreadCommentRequest,
): Promise<CommentResponse> => {
  try {
    const { _count, ...rest } = await prisma.socialThreadComment.create({
      data: {
        content: commentData.content,
        user: { connect: { id: userId } },
        thread: { connect: { id: threadId } },
        ...(commentData.parentId && {
          parent: {
            connect: { id: commentData.parentId },
          },
        }),
      },
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

    const newComment = {
      ...rest,
      counts: { likes: _count.likes, replies: _count.replies },
    };

    return newComment;
  } catch (error: any) {
    if (error.code === 'P2003') {
      const err: any = new Error(getMessage('threads.error.notFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
