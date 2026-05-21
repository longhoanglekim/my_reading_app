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

export const deleteComic = async (comicId: number): Promise<void> => {
    try {
        await HttpRequest.delete(`/comics/${comicId}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteChapterPages = async (chapterId: number): Promise<void> => {
    try {
        await HttpRequest.delete(`/chapters/${chapterId}/pages`);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteSinglePage = async (pageId: number): Promise<void> => {
    try {
        await HttpRequest.delete(`/chapters/pages/${pageId}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
