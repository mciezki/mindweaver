import { PublicUser } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const getPublicUser = async (
  slugOrId: string | undefined,
): Promise<PublicUser> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: slugOrId }, { slug: slugOrId }],
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        birthday: true,
        sex: true,
        createdAt: true,
        profileName: true,
        slug: true,
        description: true,
        profileImage: true,
        coverImage: true,
      },
    });

    if (!user) {
      const err: any = new Error(getMessage('auth.common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }

    return user;
  } catch (error: any) {
    throw error;
  }
};
