import { RegisterRequest } from '@mindweave/types';
import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../../locales';
import { updateUserProfile } from '../services/update-user.service';
import { uploadImageToCloudinary } from '../../../services/cloudinary.service';

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    const updateData: Partial<RegisterRequest> = req.body;

    if (req.files) {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      if (files['profileImage'] && files['profileImage'][0]) {
        const profileImageUrl = await uploadImageToCloudinary(files['profileImage'][0]);
        updateData.profileImage = profileImageUrl;
      }

      if (files['coverImage'] && files['coverImage'][0]) {
        const coverImageUrl = await uploadImageToCloudinary(files['coverImage'][0]);
        updateData.coverImage = coverImageUrl;
      }
    }

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