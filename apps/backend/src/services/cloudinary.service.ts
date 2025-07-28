import { v2 as cloudinary } from 'cloudinary';
import { getMessage } from '../locales';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadImageToCloudinary = async (file: Express.Multer.File): Promise<string> => {
    try {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'mindweave_profiles',
        });

        return result.secure_url;
    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        const err: any = new Error(getMessage('upload.error.cloudinaryUploadFailed'));
        err.statusCode = 500;
        throw err;
    }
};

export const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
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