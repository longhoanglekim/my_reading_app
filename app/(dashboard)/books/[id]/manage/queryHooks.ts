import { useNotification } from "@/app/components/providers/NotificationProvider";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getComicChapterInfo, getComicOverviewInfo } from "./service";



export const useComicChaptersQuery = (comicId: number) => {
  const { showNotification } = useNotification();

  const enabled = typeof comicId === "number" && !Number.isNaN(comicId) && comicId > 0;

  return useQuery({
    queryKey: ["comic-chapters", comicId],

    queryFn: async () => {
      if (!enabled) {
        throw new Error("Invalid comicId for chapters query");
      }

      try {
        const response = await getComicChapterInfo(comicId);

        console.log("Comic chapters data from query:", response);

        return response.data;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Lấy chapter list thất bại. Vui lòng thử lại.";

        showNotification({
          type: "error",
          title: "Lấy chapter list thất bại",
          message,
        });

        throw error;
      }
    },

    enabled,
  });
};


export const useComicOverviewQuery = (comicId: number) => {
  const { showNotification } = useNotification();

  const enabled = typeof comicId === "number" && !Number.isNaN(comicId) && comicId > 0;

  return useQuery({
    queryKey: ["comic-overview-info", comicId],

    queryFn: async () => {
      if (!enabled) {
        throw new Error("Invalid comicId for overview query");
      }

      try {
        const response = await getComicOverviewInfo(comicId);

        console.log("Comic overview data from query:", response);

        return response.data;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Lấy overview thất bại. Vui lòng thử lại.";

        showNotification({
          type: "error",
          title: "Lấy overview thất bại",
          message,
        });

        throw error;
      }
    },

    enabled,
  });
};

import { deleteComic, deleteChapterPages, deleteSinglePage } from './service';

export const useDeleteComic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comicId: number) => deleteComic(comicId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comics'] });
        },
    });
};

export const useDeleteChapterPages = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (chapterId: number) => deleteChapterPages(chapterId),
        onSuccess: (_, chapterId) => {
            queryClient.invalidateQueries({ queryKey: ['chapterPages', chapterId] });
        },
    });
};

export const useDeleteSinglePage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (pageId: number) => deleteSinglePage(pageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapterPages'] });
        },
    });
};