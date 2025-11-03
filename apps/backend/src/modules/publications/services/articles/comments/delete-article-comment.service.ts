import prisma from '../../../../../database/prisma';
import { getMessage } from '../../../../../locales';

export const deleteArticleComment = async (
  commentId: string,
): Promise<void> => {
  try {
    await prisma.publicationArticleComment.delete({
      where: { id: commentId },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: any = new Error(
        getMessage('publications.comments.error.notFound'),
      );
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
