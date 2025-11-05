import { CreateMessageRequest } from "@mindweave/types";
import { NextFunction, Response, Request } from "express";
import { getMessage } from "../../../locales";
import { createMessage } from "../services/create-message.service";

export const createMessageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?.userId;
        const body: CreateMessageRequest = req.body;


        if (!userId) {
            const err: any = new Error(getMessage('auth.error.unauthorized'));
            err.statusCode = 401;
            throw err;
        }

        const newMessage = await createMessage(userId, conversationId, body)

        res.status(201).json(newMessage);
    } catch (error) {
        next(error)
    }
}