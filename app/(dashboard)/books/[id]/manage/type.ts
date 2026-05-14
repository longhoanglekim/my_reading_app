export type ApiResponse<T> = {
    data: T;
};
export type ComicOverview = {
    "id": number,
    "title": string,
    "description": string,
    "author": string,
    "coverImageUrl": string,
    "originalLanguage": string,
    "format": string,
    "status": string,
    "averageRating": number,
    "totalRatings": number,
    "createdAt": string,
    "updatedAt": string,
    "categories": string[]
};
export interface PaginationResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
export interface ChapterOverview {
    id: number;
    title: string;
    chapterNumber: number;
    createdAt: string;
}