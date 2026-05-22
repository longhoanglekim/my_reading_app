import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      comicId,
      data,
    }: {
      comicId: string | number;
      data: CreateChapterRequest;
    }) => createChapter(comicId, data),
    onSuccess: (_, variables) => {
      const numericComicId = Number(variables.comicId);
      queryClient.invalidateQueries({ queryKey: ["comic-chapters", numericComicId] });
      queryClient.invalidateQueries({ queryKey: ["comic-overview-info", numericComicId] });
      queryClient.invalidateQueries({ queryKey: ["comic-overview", numericComicId] });
    },
    onError: (error) => {
      console.error("Failed to create chapter:", error);
    },
  });
};

/**
 * Hook to upload pages for a chapter
 */
export const useUploadChapterPages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      chapterId,
      files,
      startPageNumber = 1,
      targetLangs = ["vi", "en"],
    }: {
      chapterId: number;
      files: File[];
      startPageNumber?: number;
      targetLangs?: string[];
      comicId?: number | string;
    }) => uploadChapterPages(chapterId, files, startPageNumber, targetLangs),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chapter-pages", Number(variables.chapterId)] });
      if (variables.comicId) {
        queryClient.invalidateQueries({ queryKey: ["comic-chapters", Number(variables.comicId)] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comic-chapters"] });
      }
    },
    onError: (error) => {
      console.error("Failed to upload pages:", error);
    },
  });
};

/**
 * Hook to upload chapter with pages (combined operation)
 */
export const useUploadChapterWithPages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      comicId,
      chapterData,
      files,
      startPageNumber = 1,
      targetLangs = ["vi", "en"],
    }: {
      comicId: string | number;
      chapterData: CreateChapterRequest;
      files: File[];
      startPageNumber?: number;
      targetLangs?: string[];
    }) =>
      uploadChapterWithPages(comicId, chapterData, files, startPageNumber, targetLangs),
    onSuccess: (_, variables) => {
      const numericComicId = Number(variables.comicId);
      queryClient.invalidateQueries({ queryKey: ["comic-chapters", numericComicId] });
      queryClient.invalidateQueries({ queryKey: ["comic-overview-info", numericComicId] });
      queryClient.invalidateQueries({ queryKey: ["comic-overview", numericComicId] });
    },
    onError: (error) => {
      console.error("Failed to upload chapter with pages:", error);
    },
  });
};
