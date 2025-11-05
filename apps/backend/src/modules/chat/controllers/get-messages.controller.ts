import { CreateMessageRequest } from "@mindweave/types";
import { NextFunction, Response, Request } from "express";
import { getMessage } from "../../../locales";
import { createMessage } from "../services/create-message.service";
import { getConversationMessages } from "../services/get-messages.service";

export const getMessagesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;
        const { page, limit } = req.query;
        const userId = req.user?.userId;

        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 30;

        if (pageNumber < 1 || limitNumber < 1) {
            const err: any = new Error(getMessage('pagination.error.invalidParams'));
            err.statusCode = 400;
            throw err;
        }



        if (!userId) {
            const err: any = new Error(getMessage('auth.error.unauthorized'));
            err.statusCode = 401;
            throw err;
        }

        const result = await getConversationMessages(conversationId, {
            page: pageNumber,
            limit: limitNumber,
        })

        res.status(200).json({
            messages: result.messages,
            meta: {
                totalCount: result.totalCount,
                currentPage: pageNumber,
                totalPages: result.totalPages,
                limit: limitNumber,
            },
        });
    } catch (error) {
        next(error)
    }
}