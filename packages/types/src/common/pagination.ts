export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ListWithPagination {
  totalCount: number;
  totalPages: number;
}
