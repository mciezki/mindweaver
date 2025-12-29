import { ListWithPagination } from '../common/pagination';
import { User } from '../user';

export interface CreateConversationRequest {
  participantId: string;
}

export interface ConversationParticipantResponse {
  id: string;
  lastReadAt: Date | null;
  user: Pick<User, 'id' | 'profileName' | 'name' | 'surname' | 'profileImage'>;
}

export interface ConversationResponse {
  id: string;
  name: string | null;
  isGroup: boolean;
  lastMessageAt: Date;
  participants: ConversationParticipantResponse[];

  lastMessage?: MessageResponse | null
  unreadCount?: number
}

export interface CreateMessageRequest {
  content: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  createdAt: Date;
  conversationId: string;
  sender: Pick<
    User,
    'id' | 'profileName' | 'name' | 'surname' | 'profileImage'
  > | null;
}

export interface PaginatedMessages extends ListWithPagination {
  messages: MessageResponse[];
}

// Typ dla finalnej odpowiedzi API (z kontrolera)
export interface MessagesResponse {
  messages: MessageResponse[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface InboxResponse {
  conversations: ConversationResponse[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
