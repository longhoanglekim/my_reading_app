// hooks/queries/useComicQueries.ts

import { useQuery } from "@tanstack/react-query";

import {
    getBookSummaryList,
    GetBookSummaryListParams,
    getComicOverview,
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