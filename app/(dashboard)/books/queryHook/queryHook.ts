// hooks/queries/useComicQueries.ts

import { useMutation, useQuery } from "@tanstack/react-query";

import {
    getBookSummaryList,
    GetBookSummaryListParams,
    getComicOverview,
    getComicOverviewGroupByGenre,
    makeComicRating,
    upsertLibrary,
    removeFromLibrary,
    getReadingHistory,
} from "../service/service";
import { useNotification } from "@/app/components/providers/NotificationProvider";

export const useBookSummaryListQuery = (
    params?: GetBookSummaryListParams
) => {
     const { showNotification } = useNotification()
    return useQuery({
        queryKey: ["book-summary-list", params],
        queryFn: () => {
            try {
                return getBookSummaryList(params);
            } catch (error: unknown) {
                 const message =
                     error instanceof Error
                         ? error.message
                         : 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';

                 showNotification({
                     type: 'error',
                     title: 'Đăng ký thất bại',
                     message,
                 });
            }
        },

    });
};



export const useComicOverviewQuery = (comicId?: number) => {
    const { showNotification } = useNotification();
    const enabled = typeof comicId === "number" && !Number.isNaN(comicId) && comicId > 0;

    return useQuery({
        queryKey: ["comic-overview", comicId],
        queryFn: async () => {
            if (!enabled) {
                throw new Error("Invalid comicId for overview query");
            }

            try {
                const response = await getComicOverview(comicId);
                return response.data || response;
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Lấy comic overview thất bại. Vui lòng thử lại.';

                showNotification({
                    type: 'error',
                    title: 'Đăng ký thất bại',
                    message,
                });

                throw error;
            }
        },
        enabled,
    });
}

export const useMakeComicRatingMutation = (comicId?: number) => {
    const { showNotification } = useNotification();
    const enabled = typeof comicId === "number" && !Number.isNaN(comicId) && comicId > 0;

    return useMutation({
        mutationKey: ["make-comic-rating", comicId],
        mutationFn: async (rating: number) => {
            if (!enabled) {
                throw new Error("Invalid comicId for rating mutation");
            }

            try {
                const response = await makeComicRating(comicId, rating);
                showNotification({
                    type: 'success',
                    title: 'Đánh giá thành công',
                    message: 'Cảm ơn bạn đã đánh giá!',
                });
                return response;
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Đánh giá thất bại. Vui lòng thử lại.';

                showNotification({
                    type: 'error',
                    title: 'Đánh giá thất bại',
                    message,
                });
                throw error;
            }   
        },
    });
}

export const useGetBookOverviewGroupByGenreQuery = () => {
    const { showNotification } = useNotification();
    return useQuery({
        queryKey: ["comic-overview-by-genre"],
        queryFn: async () => {
            try {
                const response = await getComicOverviewGroupByGenre();
                console.log("Response from getComicOverviewGroupByGenre:", response.data.data);
                return response.data.data;
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Lấy comic overview theo thể loại thất bại. Vui lòng thử lại.';
                showNotification({
                    type: 'error',
                    title: 'Lấy comic overview theo thể loại thất bại',
                    message,
                });
                throw error;
            }
        },
    });
}

export const useUpsertLibraryMutation = (comicId?: number) => {
    const { showNotification } = useNotification();

    return useMutation({
        mutationKey: ["upsert-library", comicId],
        mutationFn: async ({ comicId, listType }: { comicId: number; listType: string }) => {
            try {
                const response = await upsertLibrary(comicId, listType);
                showNotification({
                    type: 'success',
                    title: 'Cập nhật tủ sách thành công',
                    message: 'Truyện đã được lưu vào tủ sách.',
                });
                return response;
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Cập nhật tủ sách thất bại. Vui lòng thử lại.';
                showNotification({
                    type: 'error',
                    title: 'Cập nhật tủ sách thất bại',
                    message,
                });
                throw error;
            }
        },
    });
};

export const useRemoveFromLibraryMutation = (comicId?: number) => {
    const { showNotification } = useNotification();

    return useMutation({
        mutationKey: ["remove-from-library", comicId],
        mutationFn: async (id: number) => {
            try {
                const response = await removeFromLibrary(id);
                showNotification({
                    type: 'success',
                    title: 'Xóa khỏi tủ sách thành công',
                    message: 'Truyện đã được xóa khỏi tủ sách.',
                });
                return response;
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Xóa khỏi tủ sách thất bại. Vui lòng thử lại.';
                showNotification({
                    type: 'error',
                    title: 'Xóa khỏi tủ sách thất bại',
                    message,
                });
                throw error;
            }
        },
    });
};

export const useReadingHistoryQuery = (comicId?: number) => {
    return useQuery({
        queryKey: ["reading-history", comicId],
        queryFn: () => {
            if (!comicId) return null;
            return getReadingHistory(comicId);
        },
        enabled: !!comicId,
        retry: false,
    });
};