// services/comic/comic.api.ts

import HttpRequest from "@/app/config/auth";
import { ApiResponse, ComicOverview, ChapterOverview } from "./type";
import { PaginationResponse } from "@/app/(dashboard)/dashboard/service";




export const getComicOverviewInfo = async (
    comicId: number
) :
Promise<ApiResponse<ComicOverview>> => {
    try {
        const res = await HttpRequest.get<
            ApiResponse<ComicOverview>
        >(`/comics/${comicId}`, {
         
        });

        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const getComicChapterInfo = async (
    comicId: number
) :
Promise<ApiResponse<PaginationResponse<ChapterOverview>>> => {
    try {
        const res = await HttpRequest.get<
            ApiResponse<PaginationResponse<ChapterOverview>>
        >(`/comics/${comicId}/chapters`, {
         
        });

        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteComic = async (comicId: number): Promise<ApiResponse<void>> => {
    try {
        const res = await HttpRequest.delete<ApiResponse<void>>(`/comics/${comicId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteChapterPages = async (chapterId: number): Promise<ApiResponse<void>> => {
    try {
        const res = await HttpRequest.delete<ApiResponse<void>>(`/chapters/${chapterId}/pages`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteSinglePage = async (pageId: number): Promise<ApiResponse<void>> => {
    try {
        const res = await HttpRequest.delete<ApiResponse<void>>(`/chapters/pages/${pageId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateComic = async (comicId: number, data: FormData): Promise<ApiResponse<ComicOverview>> => {
    try {
        const res = await HttpRequest.put<ApiResponse<ComicOverview>>(`/comics/${comicId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteChapter = async (chapterId: number): Promise<ApiResponse<void>> => {
    try {
        const res = await HttpRequest.delete<ApiResponse<void>>(`/chapters/${chapterId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
