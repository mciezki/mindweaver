import { AuthResponse, RegisterRequest } from '@mindweave/types';
import bcrypt from 'bcryptjs';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { sendActivationEmail } from '../../../services/email.service';
import { generateShortToken } from '../../../utils/functions/generate-short-token';

export const registerUser = async (
  registeredUser: RegisterRequest,
): Promise<Omit<AuthResponse, 'accessToken' | 'refreshToken'>> => {
  const hashedPassword = await bcrypt.hash(registeredUser.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        ...registeredUser,
        password: hashedPassword,
        birthday: new Date(registeredUser.birthday),
        active: false,
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
      },
    });

    const activationToken = generateShortToken(5);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.activationToken.create({
      data: {
        token: activationToken,
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    await sendActivationEmail(
      user.email,
      activationToken,
      user.name || user.email,
    );

    return { user };
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      const err: any = new Error(getMessage('auth.error.emailExists'));
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
};
