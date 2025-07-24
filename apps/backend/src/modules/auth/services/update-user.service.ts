import {
  RegisterRequest,
  User,
} from '@mindweave/types';
import bcrypt from 'bcryptjs';

import prisma from '../../../database/prisma';
import { getMessage } from '../../../locales';


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