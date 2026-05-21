import { useNotification } from "@/app/components/providers/NotificationProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComicChapterInfo, getComicOverviewInfo, deleteComic, deleteChapterPages, deleteSinglePage } from "./service";



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

export const useDeleteComicMutation = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comicId: number) => {
      const response = await deleteComic(comicId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comics"] });
      showNotification({
        type: "success",
        title: "Xóa truyện thành công",
        message: "Truyện đã được xóa khỏi hệ thống.",
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Xóa truyện thất bại.";
      showNotification({
        type: "error",
        title: "Xóa truyện thất bại",
        message,
      });
    },
  });
};

export const useDeleteChapterPagesMutation = (comicId: number) => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterId: number) => {
      const response = await deleteChapterPages(chapterId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comic-chapters", comicId] });
      showNotification({
        type: "success",
        title: "Xóa toàn bộ trang thành công",
        message: "Toàn bộ các trang của chương đã được dọn dẹp.",
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Xóa các trang thất bại.";
      showNotification({
        type: "error",
        title: "Xóa các trang thất bại",
        message,
      });
    },
  });
};

export const useDeleteSinglePageMutation = (comicId: number) => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageId: number) => {
      const response = await deleteSinglePage(pageId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comic-chapters", comicId] });
      showNotification({
        type: "success",
        title: "Xóa trang thành công",
        message: "Trang truyện đã được xóa.",
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Xóa trang thất bại.";
      showNotification({
        type: "error",
        title: "Xóa trang thất bại",
        message,
      });
    },
  });
};