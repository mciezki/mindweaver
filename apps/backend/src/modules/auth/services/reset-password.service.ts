import bcrypt from 'bcryptjs';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { sendPasswordResetEmail } from '../../../services/email.service';
import { generateShortToken } from '../../../utils/functions/generate-short-token';

export const requestResetUserPassword = async (
  email: string,
): Promise<{ message: string }> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: getMessage('auth.success.resetPasswordRequest') };
  }

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      used: false,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  const resetToken = generateShortToken(24);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt: expiresAt,
    },
  });

  await sendPasswordResetEmail(email, resetToken);

  return { message: getMessage('auth.success.resetPasswordRequest') };
};

// ______________________________________

export const resetUserPassword = async (
  token: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetRecord) {
    const err: any = new Error(
      getMessage('auth.error.invalidPasswordResetToken'),
    );
    err.statusCode = 400;
    throw err;
  }

  if (resetRecord.used) {
    const err: any = new Error(getMessage('auth.error.tokenAlreadyUsed'));
    err.statusCode = 400;
    throw err;
  }

  if (resetRecord.expiresAt < new Date()) {
    const err: any = new Error(getMessage('auth.error.tokenExpired'));
    err.statusCode = 400;
    throw err;
  }

  if (!resetRecord.user) {
    const err: any = new Error(getMessage('common.userNotFound'));
    err.statusCode = 404;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
  ]);

  return { message: getMessage('auth.success.resetPassword') };
};
