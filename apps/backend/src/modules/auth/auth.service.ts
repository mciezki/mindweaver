import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@mindweave/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../database/prisma';
import { getMessage } from '../../locales';
import { sendActivationEmail, sendPasswordResetEmail } from '../../services/email.service';
import { generateShortToken } from '../../utils/functions/generate-short-token';
import { generateRefreshToken } from '../../utils/functions/generate-refresh-token';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../../utils/consts';

const JWT_SECRET = process.env.JWT_SECRET || '';


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
        active: false
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
        active: true
      },
    });

    const activationToken = generateShortToken(5);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.activationToken.create({
      data: {
        token: activationToken,
        userId: user.id,
        expiresAt: expiresAt
      }
    })

    await sendActivationEmail(user.email, activationToken, user.name || user.email);

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

// ______________________________________

export const updateUser = async (
  userId: string,
  updateData: Partial<RegisterRequest>,
): Promise<Omit<User, 'active'>> => {
  const { birthday, password, ...restOfUpdateData } = updateData;

  const dataToUpdate: Partial<RegisterRequest> = { ...restOfUpdateData };

  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  if (birthday) {
    const formattedBirthday = new Date(birthday);
    if (isNaN(formattedBirthday.getTime())) {
      const err: any = new Error(
        getMessage('auth.error.invalidBirthdayFormat'),
      );
      err.statusCode = 400;
      throw err;
    }
    dataToUpdate.birthday = formattedBirthday;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dataToUpdate,
        updatedAt: new Date(),
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
      },
    });

    return updatedUser;
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      const err: any = new Error(getMessage('auth.error.emailExists'));
      err.statusCode = 409;
      throw err;
    }
    if (error.code === 'P2025') {
      const err: any = new Error(getMessage('common.userNotFound'));
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};

// ______________________________________

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

  const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const { refreshToken, refreshTokenExpiresAt } = generateRefreshToken(JWT_REFRESH_EXPIRES_IN)

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
      isRevoked: false
    }
  })

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

// ______________________________________

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

// ______________________________________

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

// ______________________________________

export const requestResetUserPassword = async (email: string): Promise<{ message: string }> => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return { message: getMessage('auth.success.resetPasswordRequest') }
  }

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      used: false,
      expiresAt: {
        gte: new Date()
      }
    }
  });

  const resetToken = generateShortToken(24);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt: expiresAt
    }
  });

  await sendPasswordResetEmail(email, resetToken);

  return { message: getMessage('auth.success.resetPasswordRequest') }
}

// ______________________________________

export const resetUserPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!resetRecord) {
    const err: any = new Error(getMessage('auth.error.invalidPasswordResetToken'))
    err.statusCode = 400;
    throw err
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
      data: { password: hashedPassword }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true }
    })
  ]);

  return { message: getMessage('auth.success.resetPassword') }
}