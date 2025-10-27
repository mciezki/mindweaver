import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const deletePublicationCategory = async (id: string): Promise<void> => {
  try {
    await prisma.publicationCategory.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: any = new Error(getMessage('common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
