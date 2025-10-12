import { ListWithPagination } from "../common/pagination";

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  birthday: Date;
  sex: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  active: boolean;

  profileName?: string | null;
  slug?: string | null;
  description?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
}

export interface PublicUser extends Omit<User, 'updatedAt' | 'type' | 'active'> { }

export interface PublicUserList extends ListWithPagination {
  users: PublicUser[]
}

export interface PublicUserListResponse {
  users: PublicUser[],
  meta: {
    totalCount: number,
    currentPage: number,
    totalPages: number,
    limit: number,
  }
}


export interface ProposedUserSlug {
  slug: string;
}