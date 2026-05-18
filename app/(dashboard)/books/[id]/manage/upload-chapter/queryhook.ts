import { useMutation } from "@tanstack/react-query";
import {
  createChapter,
  uploadChapterPages,
  uploadChapterWithPages,
} from "./service";
import { CreateChapterRequest, CreateChapterResponse, UploadPageResponse } from "./type";

/**
 * Hook to create a new chapter
 */
export const useCreateChapter = () => {
  return useMutation({
    mutationFn: ({
      comicId,
      data,
    }: {
      comicId: string | number;
      data: CreateChapterRequest;
    }) => createChapter(comicId, data),
    onError: (error) => {
      console.error("Failed to create chapter:", error);
    },
  });
};

/**
 * Hook to upload pages for a chapter
 */
export const useUploadChapterPages = () => {
  return useMutation({
    mutationFn: ({
      chapterId,
      files,
      startPageNumber = 1,
      targetLangs = ["vi","en"],
    }: {
      chapterId: number;
      files: File[];
      startPageNumber?: number;
      targetLangs?: string[];
    }) => uploadChapterPages(chapterId, files, startPageNumber, targetLangs),
    onError: (error) => {
      console.error("Failed to upload pages:", error);
    },
  });
};

/**
 * Hook to upload chapter with pages (combined operation)
 */
export const useUploadChapterWithPages = () => {
  return useMutation({
    mutationFn: ({
      comicId,
      chapterData,
      files,
      startPageNumber = 1,
      targetLangs = ["vi","en"],
    }: {
      comicId: string | number;
      chapterData: CreateChapterRequest;
      files: File[];
      startPageNumber?: number;
      targetLangs?: string[];
    }) =>
      uploadChapterWithPages(comicId, chapterData, files, startPageNumber, targetLangs),
    onError: (error) => {
      console.error("Failed to upload chapter with pages:", error);
    },
  });
};
