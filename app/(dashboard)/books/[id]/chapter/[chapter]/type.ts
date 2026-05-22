
export type Book = {
  id: string
  title: string
  author: string
  cover: string
  description: string
}

export type BookChapter = {
  id: string
  book_id: string
  chapterNumber: number
  title: string
  total_pages: number
  hasNextChapter: boolean
}



export interface ChapterPage {
  id: number;
  pageNumber: number;
  imageUrl: string;
  cleanedImageUrl: string;
  originalMetadataUrl: string;
}

export type ChapterOverview = {
  id: string
  chapterNumber: number
  title: string;
}
export type SelectionTranslation = {
  text: string
  translation: string
  chunks: BubbleChunk[]
}

export type ChapterComment = {
  id: number
  userId: number
  fullName: string
  avatarUrl: string
  content: string
  parentId: number | null
  createdAt: string
  replies: string[]
}

export type CommentsResponse = {
  data: {
    content: ChapterComment[]
    pageNo: number
    pageSize: number
    totalElements: number
    totalPages: number
    last: boolean
  }
}
export interface PageImages {
  originalUrl: string;
  inpaintedUrl: string;
}

export interface BubbleChunk {
  chunk_id: string;
  word: string;
  romaji: string;
  type: string;
  meaning: string;
}

export interface Bubble {
  id: number;
  box: number[];
  original_text: string;
  chunks: BubbleChunk[];
  full_translation?: string;
}

export interface PageDetailResponse {
  pageId: number;
  chapterId: number;
  pageNumber: number;
  images: PageImages;
  bubbles: Bubble[];
}

export interface ComicDetail {
  id: number;
  title: string;
  description: string;
  author: string;
  coverImageUrl: string;
  originalLanguage: string;
  format: string;
  status: string;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  categories: string[];
}

export interface ComicDetailResponse {
  data: ComicDetail;
}