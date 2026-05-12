import { useQuery } from '@tanstack/react-query';
import { getRecentBooks, GetBookSummaryListParams, getFavoriteBooks, getUserLibraryByType, GetUserLibraryByTypeParams } from './service';
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

export function useUserLibraryByType(params: GetUserLibraryByTypeParams) {
    return useQuery({
        queryKey: ['userLibraryByType', params],
        queryFn: () => getUserLibraryByType(params),
        staleTime: 5 * 60 * 1000,
    });
}
