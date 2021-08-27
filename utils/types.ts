export interface PaginatedResult<T> {
  pages: Array<T>;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
    startCursor: string;
  };
}

export interface DeleteResponse {
  ok: number;
  deleteId: string;
}

export type Paths = Array<{ params: { id: string } }>;

export interface Response<T> {
  success: boolean;
  data: T;
  errors: Record<string, string> | {};
}
