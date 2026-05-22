import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getChapterComments, getChapterOverview, getChapterPages, getComicDetail, getPageDetail, postChapterComment, syncReadingHistory, getComicOverview } from '../service/service'
import { ChapterComment } from '../type'
export const useChapterOverview = (comicId: string, chapterNumber: number) => {
    return useQuery({
        queryKey: ['chapterOverview', comicId, chapterNumber],
        queryFn: () => getChapterOverview(comicId, chapterNumber),
        enabled: !!comicId && !!chapterNumber,
    })
}
export const useChapterComments = (chapterId: string | undefined, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['chapterComments', chapterId, page, size],
    queryFn: () => getChapterComments(chapterId!, page, size),
    enabled: !!chapterId,
  })
}
export const usePageDetail = (pageId: number) => {
  return useQuery({
    queryKey: ['pageDetail', pageId],
    queryFn: () => getPageDetail(pageId!),
    enabled: !!pageId,
  });
};

export const usePostChapterComment = (chapterId: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: number }) =>
      postChapterComment(chapterId!, content, parentId),
    onSuccess: () => {
      // Invalidate and refetch comments
      if (chapterId) {
        queryClient.invalidateQueries({ queryKey: ['chapterComments', chapterId] })
      }
    },
  })
}

export const useChapterPages = (
  chapterId: number | undefined
) => {
  return useQuery({
    queryKey: ['chapterPages', chapterId],
    queryFn: () => getChapterPages(chapterId!),
    enabled: !!chapterId,
  });
};


export const useComicDetail = (comicId?: number) => {
  return useQuery({
    queryKey: ["comicDetail", comicId],
    queryFn: () => getComicDetail(comicId!),
    enabled: !!comicId,
  });
};

export const useSyncReadingHistoryMutation = () => {
  return useMutation({
    mutationFn: ({
      comicId,
      chapterId,
      lastPageRead,
      clientUpdatedAt,
    }: {
      comicId: number;
      chapterId: number;
      lastPageRead: number;
      clientUpdatedAt: string;
    }) => syncReadingHistory(comicId, chapterId, lastPageRead, clientUpdatedAt),
  });
};

export const useComicOverviewQuery = (comicId?: number) => {
  return useQuery({
    queryKey: ["comic-overview", comicId],
    queryFn: () => getComicOverview(comicId!),
    enabled: !!comicId,
  });
};