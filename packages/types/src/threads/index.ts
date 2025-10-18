import { ListWithPagination } from '../common/pagination';
import { User } from '../user';

export interface ThreadLike {
  id: string
  threadId: string
  user: User
}

export interface CreateThreadRequest {
  content: string;
  mediaUrls?: string[];
}

export interface UpdateThreadRequest {
  content: string;
  existingMediaUrls: string[];
}

export interface ThreadResponse {
  id: string;
  user: Pick<
    User,
    'id' | 'profileName' | 'name' | 'surname' | 'type' | 'profileImage'
  >;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  mediaUrls: string[];

  likes: ThreadLike[]
}

export interface PublicThreadsList extends ListWithPagination {
  threads: ThreadResponse[];
}

export interface PublicThreadsResponse {
  threads: ThreadResponse[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface ToggleLikeResponse {
  liked: boolean;
}