import { NextFunction, Request, Response } from 'express';
import { getCategory } from '../services/category.service';


export const category = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { categoryId } = req.params;

        const category = await getCategory(categoryId);

        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};
