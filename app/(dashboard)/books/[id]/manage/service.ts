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
