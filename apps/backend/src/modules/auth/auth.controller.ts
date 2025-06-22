import { RegisterRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../locales';
import { loginUser, registerUser, updateUser } from './auth.service';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name, surname, birthday, sex } = req.body;

    const result = await registerUser({
      email,
      password,
      name,
      surname,
      birthday,
      sex,
    });
    res
      .status(201)
      .json({ message: getMessage('auth.success.registered'), ...result });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    const updateData: Partial<RegisterRequest> = req.body;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 409;
      throw err;
    }

    const updatedUser = await updateUser(userId, updateData);

    res.status(200).json({
      message: getMessage('auth.success.profileUpdated'),
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    res
      .status(200)
      .json({ message: getMessage('auth.success.loggedIn'), ...result });
  } catch (error) {
    next(error);
  }
};
