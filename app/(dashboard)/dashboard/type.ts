
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
export interface UserLibrarySummary {
    "id": number,
    "title": string,
    "author": string,
    "coverImageUrl": string,
    "originalLanguage": string,
    "status": string,
    "format": string,
    "averageRating": number,
    "listType": string,
}