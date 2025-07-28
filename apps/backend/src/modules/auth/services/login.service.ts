import { AuthResponse, LoginRequest } from '@mindweave/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../../../utils/consts';
import { generateRefreshToken } from '../../../utils/functions/generate-refresh-token';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const loginUser = async (
  loginData: LoginRequest,
): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
  });

  if (!user) {
    const err: any = new Error(getMessage('auth.error.invalidCredentials'));
    err.statusCode = 401;
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(
    loginData.password,
    user.password,
  );

  if (!isPasswordValid) {
    const err: any = new Error(getMessage('auth.error.invalidCredentials'));
    err.statusCode = 401;
    throw err;
  }

  if (!user.active) {
    const err: any = new Error(getMessage('auth.error.accountNotActivated'));
    err.statusCode = 403;
    throw err;
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );

  const { refreshToken, refreshTokenExpiresAt } = generateRefreshToken(
    JWT_REFRESH_EXPIRES_IN,
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
      isRevoked: false,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};
