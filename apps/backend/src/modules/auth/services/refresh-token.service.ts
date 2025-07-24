import {
  AuthResponse,
} from '@mindweave/types';
import jwt from 'jsonwebtoken';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';
import { generateRefreshToken } from '../../../utils/functions/generate-refresh-token';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../../../utils/consts';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const revokeRefreshToken = async (token: string): Promise<void> => {
  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: { token }
  })

  if (refreshTokenRecord && !refreshTokenRecord.isRevoked) {
    await prisma.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { isRevoked: true }
    })
  }
}

// ______________________________________

export const refreshAccessToken = async (oldRefreshToken: string): Promise<AuthResponse> => {
  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
    include: { user: true },
  });

  if (!refreshTokenRecord || refreshTokenRecord.isRevoked || refreshTokenRecord.expiresAt < new Date()) {
    const err: any = new Error(getMessage('auth.error.invalidToken'));
    err.statusCode = 401; // Unauthorized
    throw err;
  }

  if (!refreshTokenRecord.user) {
    const err: any = new Error(getMessage('common.userNotFound'));
    err.statusCode = 404;
    throw err;
  }

  const user = refreshTokenRecord.user;

  await prisma.refreshToken.update({
    where: { id: refreshTokenRecord.id },
    data: { isRevoked: true },
  });

  const newAccessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  const { refreshToken: newRefreshToken, refreshTokenExpiresAt: newRefreshTokenExpiresAt } = generateRefreshToken(JWT_REFRESH_EXPIRES_IN)

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken, userId: user.id, expiresAt: newRefreshTokenExpiresAt, isRevoked: false
    }
  })

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken: newAccessToken, refreshToken: newRefreshToken }
}