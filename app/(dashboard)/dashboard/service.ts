// services/comic/comic.api.ts

import HttpRequest from "@/app/config/auth";
import { ComicSuggestion, ComicSummary, UserLibrarySummary } from "./type";
import { AdminDashboardSummary } from "../admin/user-management/type";
import {
    BookOpen,
    Users,
    Calendar,
    Settings
} from "lucide-react";

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
export interface GetUserLibraryByTypeParams {
    page?: number;
    size?: number;
    listType?: string;
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
   STATIC DATA
========================= */

export const stats = [
    {
        title: "Sách đã đọc",
        value: "1,234",
        change: "+12.5%",
        icon: BookOpen,
        color:
            "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300",
        hover:
            "hover:bg-amber-200 dark:hover:bg-amber-900/50",
    },
    {
        title: "Người dùng hoạt động",
        value: "567",
        change: "+8.3%",
        icon: Users,
        color:
            "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300",
        hover:
            "hover:bg-blue-200 dark:hover:bg-blue-900/50",
    },
    {
        title: "Sự kiện sắp tới",
        value: "12",
        change: "+4.2%",
        icon: Calendar,
        color:
            "bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300",
        hover:
            "hover:bg-green-200 dark:hover:bg-green-900/50",
    },
    {
        title: "Cài đặt đang chờ",
        value: "5",
        change: "0%",
        icon: Settings,
        color:
            "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300",
        hover:
            "hover:bg-purple-200 dark:hover:bg-purple-900/50",
    },
];

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
//  get user library by type (recent, favorite, etc.) with pagination
export const getUserLibraryByType = async (
    params?: GetBookSummaryListParams
): Promise<PaginationResponse<UserLibrarySummary>> => {
    try {
        const res = await HttpRequest.get<
            ApiResponse<PaginationResponse<UserLibrarySummary>>
        >("/user-libraries", {
            params,
        });
        
        return res.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


export const getRecentBooks = async (
    params?: GetBookSummaryListParams
): Promise<ComicSummary[]> => {
    try {
        const data = await getBookSummaryList(params);
        console.log("Recent Books:", data);
        return data.content;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const getFavoriteBooks = async (
    params?: GetBookSummaryListParams
): Promise<ComicSummary[]> => {
    try {
        const data = await getBookSummaryList(params);

        return data.content;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const getBooksByQuery = async (
    params?: GetBookSummaryListParams
): Promise<PaginationResponse<ComicSummary>> => {
    try {
        const res = await HttpRequest.get<ApiResponse<PaginationResponse<ComicSummary>>>(
            "/comics/search/detail",
            {
                params,
            }
        );
        console.log("Books by Query:", res.data.data);
        return res.data.data ;
    } catch (e) {
        console.log(e);
        return {
            content: [],
            pageNo: 0,
            pageSize: 0,
            totalElements: 0,
            totalPages: 0,
            last: true,
        };
    }
}

export const getSuggestions = async (
  keyword: string
): Promise<ComicSuggestion[]> => {
    try {
        const data = await HttpRequest.get<ApiResponse<ComicSuggestion[]>>(`/comics/search`, {
            params: { keyword , limit: 5 },

        });
        return data.data.data
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const getAdminDashboardSummary = async (): Promise<AdminDashboardSummary> => {
    try {
        const res = await HttpRequest.get("/admin/dashboard/summary");
        return res.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};