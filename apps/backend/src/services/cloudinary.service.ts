import { v2 as cloudinary } from 'cloudinary';

import { getMessage } from '../locales';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
): Promise<string> => {
  try {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'mindweave_profiles',
    });

    return result.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    const err: any = new Error(
      getMessage('upload.error.cloudinaryUploadFailed'),
    );
    err.statusCode = 500;
    throw err;
  }
};

export const uploadMultipleFilesToCloudinary = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map((file) => uploadImageToCloudinary(file));

  const urls = await Promise.all(uploadPromises);

  return urls;
};

export const deleteImageFromCloudinary = async (
  imageUrl: string,
): Promise<void> => {
  try {
    const publicId = imageUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      const folder = 'mindweave_profiles';
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    } else {
      console.warn('Could not extract publicId from image URL:', imageUrl);
    }
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
  }
};

const getPublicIdFromUrl = (imageUrl: string): string | null => {
  const parts = imageUrl.split('/');
  const folderIndex = parts.indexOf('mindweave_threads');

  if (folderIndex === -1 || folderIndex + 1 >= parts.length) {
    console.warn('Could not extract publicId from image URL:', imageUrl);
    return null;
  }

  const publicIdWithExtension = parts.slice(folderIndex).join('/');
  const publicId = publicIdWithExtension.substring(
    0,
    publicIdWithExtension.lastIndexOf('.'),
  );

  return publicId;
};

export const deleteMultipleImagesFromCloudinary = async (
  imageUrls: string[],
): Promise<void> => {
  if (!imageUrls || imageUrls.length === 0) {
    return;
  }

  try {
    const publicIds = imageUrls
      .map(getPublicIdFromUrl)
      .filter((id): id is string => id !== null);

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }
  } catch (error: any) {
    console.error('Cloudinary multiple delete error:', error);
  }
};
