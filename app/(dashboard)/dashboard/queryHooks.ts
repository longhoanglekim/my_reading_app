import { useQuery } from '@tanstack/react-query';
import { getRecentBooks, GetBookSummaryListParams, getFavoriteBooks } from './service';
export function useRecentBooks(params: GetBookSummaryListParams) {
    return useQuery({
        queryKey: ['recentBooks', params],
        queryFn: () => getRecentBooks(params),
        staleTime: 5 * 60 * 1000,
    });
}
export function useFavoriteBooks(params: GetBookSummaryListParams) {
    return useQuery({
        queryKey: ['favoriteBooks', params],
        queryFn: () => getFavoriteBooks(params),
        staleTime: 5 * 60 * 1000,
    });
}

