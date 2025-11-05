import { CreateMessageRequest, MessageResponse } from "@mindweave/types";
import prisma from "../../../database/prisma";
import { mapMessageToResponse, messageSelect } from "../chat.utils";
import { getMessage } from "../../../locales";

export const createMessage = async (userId: string,
    conversationId: string,
    data: CreateMessageRequest): Promise<MessageResponse> => {
    try {

        const [newMessage] = await prisma.$transaction([
            prisma.conversationMessage.create({
                data: {
                    content: data.content,
                    conversationId: conversationId,
                    senderId: userId,
                }, select: messageSelect
            }),
            prisma.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } })
        ])

        return mapMessageToResponse(newMessage)
    } catch (error: any) {
        if (error.code === 'P2003') {
            const err: any = new Error(getMessage('error.badRequest'));
            err.statusCode = 400;
            throw err;
        }
        throw error;
    }
}