import { User } from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';

export const getProfile = async (userId: string | undefined): Promise<User> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        birthday: true,
        sex: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        active: true,
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
