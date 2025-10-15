import { User } from "../user";

export interface CreateThreadRequest {
    content: string;
    mediaUrls?: string[]
}

export interface UpdateThreadRequest {
    content: string;
    existingMediaUrls: string[]
}

export interface ThreadResponse {
    id: string;
    user: Pick<User, 'id' | 'profileName' | 'name' | 'surname' | 'type' | 'profileImage'>
    content: string;
    createdAt: Date;
    updatedAt: Date;
    mediaUrls: string[]
}