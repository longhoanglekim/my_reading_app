export interface BookChapter {
  chapterNumber: number;
  title: string;
}

export interface CreateChapterRequest {
  chapterNumber: number;
  title: string;
}

export interface CreateChapterResponse {
  id: number;
  chapterNumber: number;
  title: string;
  createdAt: string;
}

export interface UploadPageRequest {
  pageNumber: number;
  imageUrl?: string;
  file?: File;
}

export interface UploadPageResponse {
  id: number;
  pageNumber: number;
  imageUrl: string;
  chapterId: number;
  createdAt: string;
}

export interface UploadChapterResponse {
  success: boolean;
  message: string;
  chapter: CreateChapterResponse;
  pages: UploadPageResponse[];
}
