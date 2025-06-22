import { AuthResponse, LoginRequest, RegisterRequest } from '@mindweave/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../database/prisma';
import { getMessage } from '../../locales';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '1h';

export const registerUser = async (
  registeredUser: RegisterRequest,
): Promise<AuthResponse> => {
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
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { user, token };
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      const err: any = new Error(getMessage('auth.error.emailExists'));
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
};

export const loginUser = async (loginData: LoginRequest) => {
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
