import { NextFunction, Request, Response } from "express";
import { getThread } from "../services/thread.service";

export const thread = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const thread = await getThread(id);

        res.status(200).json(thread)

    } catch (error) { next(error) }
};