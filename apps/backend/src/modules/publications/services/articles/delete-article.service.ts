import prisma from '../../../../database/prisma';
import { getMessage } from '../../../../locales';

export const deletePublicationArticle = async (id: string): Promise<void> => {
  try {
    await prisma.publicationArticle.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: any = new Error(getMessage('articles.error.notFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
