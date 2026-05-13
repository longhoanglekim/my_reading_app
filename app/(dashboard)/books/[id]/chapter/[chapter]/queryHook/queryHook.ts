import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getChapterComments, getChapterOverview, postChapterComment } from '../service/service'
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