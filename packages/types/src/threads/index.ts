import { ListWithPagination } from '../common/pagination';
import { User } from '../user';

export interface ThreadBase {
  id: string;
  user: Pick<
    User,
    'id' | 'profileName' | 'name' | 'surname' | 'type' | 'profileImage'
  >;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  mediaUrls: string[];
}

export interface ThreadCounts {
  likes: number;
  comments: number;
  shares: number;
}

export interface Like {
  id: string;
  user: Pick<User, 'id' | 'name' | 'surname' | 'profileName' | 'profileImage'>;
}

export interface ThreadCommentRequest {
  content: string;
  parentId?: string;
}

export interface CreateThreadRequest {
  content: string;
  mediaUrls?: string[];
}

export interface UpdateThreadRequest {
  content: string;
  existingMediaUrls: string[];
}

export interface CommentCounts {
  likes: number;
  replies: number;
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<
    User,
    'id' | 'name' | 'surname' | 'profileName' | 'profileImage'
  > | null;
  parentId: string | null;
  counts: CommentCounts;
}

export interface ThreadResponse extends ThreadBase {
  originalThreadId: string | null;
  originalThread: ThreadBase | null;
  counts: ThreadCounts;
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

export interface ThreadCommentsList extends ListWithPagination {
  comments: CommentResponse[];
}

export interface ThreadCommentsResponse {
  threads: CommentResponse[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface LikesList extends ListWithPagination {
  likes: Like[];
}

export interface LikesResponse {
  threads: Like[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
