export type Genre = {
  id: number;
  name: string;
};

export interface CreateComicBody {
  title: string;
  author: string;
  description?: string;
  originalLanguage?: string;
  format?: string;
  status?: string;
  genres?: number[];
}

export type CreateComicFormData = FormData;

export interface CreateComicData {
  id: number;
  title: string;
  description: string;
  author: string;
  coverImageUrl: string;
  originalLanguage: string;
  format: string;
  status: string;
}

export interface CreateComicResponse {
  data: CreateComicData;
}

export interface PaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
