// services/comic/comic.api.ts

import HttpRequest from "../../../config/auth";
import { ComicOverview, ComicOverviewResponse, ComicSummary } from "../type/type";

/* =========================
   TYPES
========================= */


export interface PaginationResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface ApiResponse<T> {
    data: T;
}

export interface GetBookSummaryListParams {
    page?: number;
    size?: number;
    keyword?: string;
    categoryId?: number;
    status?: string;
}

export interface CreateComicBody {
    title: string;
    author: string;
    description?: string;
    coverImageUrl?: string;
    originalLanguage?: string;
    format?: string;
    status?: string;
}

/* =========================
   APIs
========================= */

export const getBookSummaryList = async (
    params?: GetBookSummaryListParams
): Promise<PaginationResponse<ComicSummary>> => {
    try {
        const res = await HttpRequest.get<
            ApiResponse<PaginationResponse<ComicSummary>>
        >("/comics", {
            params,
        });

        return res.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getComicOverview = async (comicId: number) => {
    try {
        const res = await HttpRequest.get<
            ComicOverviewResponse
        >(`/comics/${comicId}/book-overview`);

        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createComic = async (
    body: CreateComicBody
) => {
    try {
        const res = await HttpRequest.post(
            "/api/comics",
            body
        );

        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};