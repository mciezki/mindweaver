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
import { generateShortToken } from '../../utils/generate-short-token';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '24h';

export const registerUser = async (
  registeredUser: RegisterRequest,
): Promise<Omit<AuthResponse, 'token'>> => {
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

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

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