import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { registerUser } from '../services/register.service';

export const registerController = async (
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
