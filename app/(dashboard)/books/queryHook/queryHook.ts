// hooks/queries/useComicQueries.ts

import { useMutation, useQuery } from "@tanstack/react-query";

import {
    getBookSummaryList,
    GetBookSummaryListParams,
    getComicOverview,
    makeComicRating,
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
            } catch (error) {
                 showNotification({
                type: 'error',
                title: 'Đăng ký thất bại',
                message: error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.',
            })
            }
        },

    });
};



export const useComicOverviewQuery = (comicId: number) => {
    const { showNotification } = useNotification()
    return useQuery({
        queryKey: ["comic-overview", comicId],
        queryFn: async () => {
            try {
                const response = await getComicOverview(comicId);
                // Giả sử API trả về trực tiếp ComicOverview
                return response.data || response;
            } catch (error) {
                showNotification({
                type: 'error',
                title: 'Đăng ký thất bại',
                message: error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.',
            })
            }
        },
    });
}

export const useMakeComicRatingMutation = (comicId: number) => {
    const { showNotification } = useNotification()
    return useMutation({
        mutationKey: ["make-comic-rating", comicId],
        mutationFn: async (rating: number) => {
            try {
                const response = await makeComicRating(comicId, rating);
                showNotification({
                    type: 'success',
                    title: 'Đánh giá thành công',
                    message: 'Cảm ơn bạn đã đánh giá!',
                });
                return response;
            } catch (error) {
                showNotification({
                    type: 'error',
                    title: 'Đánh giá thất bại',
                    message: error.message || 'Đánh giá thất bại. Vui lòng thử lại.',
                });
                throw error;
            }   
        },
    });
}