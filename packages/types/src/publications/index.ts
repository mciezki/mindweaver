import { ListWithPagination } from "../common/pagination";
import { User } from "../user";

export interface PublicationCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePublicationCategoryRequest
  extends Pick<PublicationCategory, 'name' | 'slug' | 'description'> { }

export interface PublicationCategoryResponse extends PublicationCategory {
  articlesNumber: number;
}

export interface PublicationArticleComment {
  id: string
  articleId: string
  content: string
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PublicationArticleRate {
  id: string
  articleId: string
  userId: string
  rate: "LIKE" | "DISLIKE"
  createdAt: Date
}

export interface PublicationArticle {
  id: string
  user: Pick<
    User,
    'id' | 'profileName' | 'name' | 'surname' | 'type' | 'profileImage'
  >;
  categoryId: string
  title: string
  contentHtml: string
  coverImage: string | null
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  slug: string | null

  commentsNumber: number
  rates: { likes: number, dislikes: number }
}

export interface CreatePublicationArticle
  extends Pick<PublicationArticle, 'title' | 'coverImage' | 'contentHtml' | 'slug' | 'categoryId'> { }

export interface PublicationArticlesList extends ListWithPagination {
  articles: PublicationArticle[];
}

export interface PublicationArticlesResponse {
  articles: PublicationArticle[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}


export interface ArticleCommentCommentsList extends ListWithPagination {
  comments: PublicationArticleComment[];
}

export interface ArticleCommentsResponse {
  comments: PublicationArticleComment[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}