import { ProposedUserSlug } from '@mindweave/types';
import crypto from 'crypto';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { sanitizeSlug } from '../../../utils/functions/sanitize-slug';

export const getUniqueUserSlug = async (
  userId: string | undefined,
): Promise<ProposedUserSlug> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        surname: true,
        profileName: true,
      },
    });

    if (!user) {
      const err: any = new Error(getMessage('auth.common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }

    let baseSlug: string;
    if (user.profileName) {
      baseSlug = sanitizeSlug(user.profileName);
    } else if (user.name && user.surname) {
      baseSlug = sanitizeSlug(`${user.name}-${user.surname}`);
    } else {
      baseSlug = `user-${user.id.slice(0, 8)}`;
    }

    let proposedSlug = baseSlug;

    while (true) {
      const existingUser = await prisma.user.findFirst({
        where: {
          slug: proposedSlug,
          NOT: {
            id: userId,
          },
        },
        select: { id: true },
      });

      if (!existingUser) {
        break;
      }

      const randomSuffix = crypto.randomBytes(3).toString('hex');
      proposedSlug = `${baseSlug}-${randomSuffix}`;
    }

    return { slug: proposedSlug };
  } catch (error: any) {
    throw error;
  }
};
