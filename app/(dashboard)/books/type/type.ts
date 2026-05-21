export type BookOverview = {
    id: string;
    title: string
    author: string
    cover: string
}

export interface ComicSummary {
    id: number;
    title: string;
    author: string;
    coverImageUrl: string;
    originalLanguage: string;
    status: string;
    format: string;
    averageRating: number;
}

export interface ChapterSummary {
    id: number;
    chapterNumber: number;
    title: string;
    createdAt: string;
}
export interface ComicOverview {
    id: number;
    title: string;
    author: string;
    coverImageUrl: string;
    description: string;
    totalRatings : number;
    averageRating: number;
    chapters: ChapterSummary[];
}
export interface ComicOverviewResponse {
    bookOverviewData: ComicOverview;
    message: string;
}
    
export interface ComicOverviewGroupByGenre {
    genre: string;
    books: ComicSummary[];
}