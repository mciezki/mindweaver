export interface PublicationCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePublicationCategoryRequest
  extends Pick<PublicationCategory, 'name' | 'slug' | 'description'> {}

export interface PublicationCategoryResponse extends PublicationCategory {
  articlesNumber: number;
}
