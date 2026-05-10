// hooks/queries/useComicQueries.ts

import { useQuery } from "@tanstack/react-query";

import {
    getBookSummaryList,
    GetBookSummaryListParams,
} from "../service/service";

export const useBookSummaryListQuery = (
    params?: GetBookSummaryListParams
) => {
    return useQuery({
        queryKey: ["book-summary-list", params],
        queryFn: () => getBookSummaryList(params),
    });
};