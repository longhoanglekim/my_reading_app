import { useQuery } from '@tanstack/react-query';
import { getRecentBooks, GetBookSummaryListParams, getFavoriteBooks, getUserLibraryByType, GetUserLibraryByTypeParams, getBooksByQuery, getSuggestions } from './service';
import { getAdminDashboardSummary } from './service';
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
        enabled: !!params.listType && params.listType.trim() !== '' && ['READING', 'FAVORITE', 'READ_LATER'].includes(params.listType),
    });
}

export function useBooksByQuery(params: GetBookSummaryListParams) {
    return useQuery({
        queryKey: ['booksByQuery', params],
        queryFn: () => getBooksByQuery(params),
        staleTime: 5 * 60 * 1000,
        enabled: !!params.keyword && params.keyword.trim() !== '',
    });
}

export const useComicSuggestions = (keyword: string) => {
  return useQuery({
    queryKey: ["comicSuggestions", keyword],
    queryFn: () => getSuggestions(keyword),
    enabled: keyword.trim().length > 0,
  });
};

export const useAdminDashboardSummary = () => {
    return useQuery({
        queryKey: ['adminDashboardSummary'],
        queryFn: getAdminDashboardSummary,
    });
};
