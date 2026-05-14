export type Genre = {
  id: number;
  name: string;
};
export interface CreateComicBody {
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  originalLanguage?: string;
  format?: string;
  status?: string;
}
export interface PaginationResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
