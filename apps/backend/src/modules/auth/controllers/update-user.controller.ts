import { RegisterRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { updateUserProfile } from '../services/update-user.service';

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    console.log(userId)

    const updateData: Partial<RegisterRequest> = req.body;

    if (!userId) {
      const err: any = new Error(getMessage('auth.error.invalidToken'));
      err.statusCode = 401;
      throw err;
    }

    const updatedUser = await updateUserProfile(userId, updateData);

    res.status(200).json({
      message: getMessage('auth.success.profileUpdated'),
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};