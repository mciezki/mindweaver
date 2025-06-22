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

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '1h';

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

export const updateUser = async (
  userId: number,
  updateData: Partial<RegisterRequest>,
): Promise<User> => {
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

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
