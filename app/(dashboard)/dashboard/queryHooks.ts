import { useQuery } from '@tanstack/react-query';
import { getRecentBooks, IBooksParams } from './service';
export function useRecentBooks(params: IBooksParams) {
    return useQuery({
        queryKey: ['recentBooks', params],
        queryFn: () => getRecentBooks(params),
        staleTime: 5 * 60 * 1000,
    });
}