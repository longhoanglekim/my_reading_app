// hooks/queries/useComicQueries.ts

import { useMutation, useQuery } from "@tanstack/react-query";

import { useNotification } from "@/app/components/providers/NotificationProvider";
import { createComic, getBookGenre } from "./service";
import { CreateComicBody } from "../dashboard/service";

export const useGenresQuery = (
) => {
     const { showNotification } = useNotification()
    return useQuery({
        queryKey: ["genres"],
        queryFn: () => {
            try {
                return getBookGenre();
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

export const useCreateComicMutation = () => {
    const { showNotification } = useNotification()
    return useMutation({
        mutationKey: ["create-comic"],
        mutationFn: async (body: CreateComicBody) => {
            try {
                const response = await createComic(body);
                showNotification({
                    type: 'success',
                    title: 'Đăng truyện thành công',
                    message: 'Truyện đã được tạo thành công.',
                });
                return response;
            } catch (error) {
                showNotification({
                    type: 'error',
                    title: 'Đăng truyện thất bại',
                    message: error.message || 'Đăng truyện thất bại. Vui lòng kiểm tra lại thông tin.',
                });
                throw error;
            }
        },
    });
};