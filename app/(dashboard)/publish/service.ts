// services/comic/comic.api.ts

import HttpRequest from "../../../config/auth";
import { CreateComicBody, Genre } from "./type";

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

/* =========================
   APIs
========================= */

export const getBookGenre = async (): Promise<Genre[]> => {
  try {
    const res = await HttpRequest.get<Genre[]>("/comics/genres", {});

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createComic = async (body: CreateComicBody) => {
  try {
    const res = await HttpRequest.post("/api/comics", body);

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
