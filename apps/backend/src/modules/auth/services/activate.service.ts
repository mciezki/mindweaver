import {
  User,
} from '@mindweave/types';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';


export const activateAccount = async (activationToken: string): Promise<User> => {
  const activationRecord = await prisma.activationToken.findUnique({
    where: { token: activationToken },
    include: { user: true }
  })

  if (!activationRecord) {
    const err: any = new Error(getMessage('auth.error.invalidActivationToken'));
    err.statusCode = 400;
    throw err
  }

  if (activationRecord.used) {
    const err: any = new Error(getMessage('auth.error.tokenAlreadyUsed'));
    err.statusCode = 400;
    throw err;
  }

  if (activationRecord.expiresAt < new Date()) {
    const err: any = new Error(getMessage('auth.error.tokenExpired'));
    err.statusCode = 400;
    throw err;
  }

  if (!activationRecord.user) {
    const err: any = new Error(getMessage('common.userNotFound'));
    err.statusCode = 404;
    throw err;
  }

  const [updatedUser, updatedTokenRecord] = await prisma.$transaction([
    prisma.user.update({
      where: { id: activationRecord.userId },
      data: { active: true },
      select: {
        id: true, email: true, name: true, surname: true,
        birthday: true, sex: true, createdAt: true, updatedAt: true,
        type: true, active: true,
      }
    }),
    prisma.activationToken.update({
      where: { id: activationRecord.id },
      data: { used: true }
    })
  ])

  return { ...updatedUser }
}