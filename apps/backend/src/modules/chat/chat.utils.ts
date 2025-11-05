import { ConversationParticipantResponse, ConversationResponse, MessageResponse } from "@mindweave/types";
import { Prisma } from "@prisma/client";
import prisma from "../../database/prisma";

export const mapConversationToResponse = async (
    conversation: Prisma.ConversationGetPayload<{
        include: { participants: true };
    }>
): Promise<ConversationResponse> => {

    const participantUserIds = conversation.participants.map(p => p.userId);

    const users = await prisma.user.findMany({
        where: {
            id: { in: participantUserIds },
        },
        select: {
            id: true,
            profileName: true,
            name: true,
            surname: true,
            profileImage: true,
        },
    });

    const userMap = new Map(users.map(u => [u.id, u]));

    const participantsResponse: ConversationParticipantResponse[] = conversation.participants
        .map(participant => {
            const user = userMap.get(participant.userId);
            if (!user) {
                return null;
            }
            return {
                id: participant.id,
                lastReadAt: participant.lastReadAt,
                user: user,
            };
        })
        .filter(p => p !== null) as ConversationParticipantResponse[];

    return {
        id: conversation.id,
        name: conversation.name,
        isGroup: conversation.isGroup,
        lastMessageAt: conversation.lastMessageAt,
        participants: participantsResponse,
    };
};

export const messageSelect: Prisma.ConversationMessageSelect = {
    id: true,
    content: true,
    createdAt: true,
    conversationId: true,
    sender: {
        select: {
            id: true,
            profileName: true,
            name: true,
            surname: true,
            profileImage: true,
        },
    },
};

type MessagePayload = Prisma.ConversationMessageGetPayload<{
    select: typeof messageSelect;
}>;

export const mapMessageToResponse = (message: MessagePayload): MessageResponse => {
    return {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        conversationId: message.conversationId,
        sender: message.sender,
    };
};