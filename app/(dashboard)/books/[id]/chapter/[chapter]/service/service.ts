import HttpRequest from "../../../../../../config/auth";
import { CommentsResponse, ChapterComment, ChapterOverview, PageDetailResponse, ChapterPage, ComicDetail, ComicDetailResponse } from '../type'
export const getChapterOverview = async (comicId : string, chapterNumber: number) : Promise<ChapterOverview> => {
    try {
        const res = await HttpRequest.get(`/comics/${comicId}/chapter/${chapterNumber}`);
        return res.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const getChapterComments = async (
  chapterId: string,
  page: number = 0,
  size: number = 10
): Promise<CommentsResponse> => {
  try {
    const res = await HttpRequest.get<CommentsResponse>(
      `/chapters/${chapterId}/comments`,
      {
        params: {
          page: page,
          size: size,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const postChapterComment = async (
  chapterId: string,
  content: string,
  parentId?: number
): Promise<ChapterComment> => {
  try {
    const res = await HttpRequest.post<ChapterComment>(
      `/chapters/${chapterId}/comments`,
      {
        content,
        parentId,
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export const getComicDetail = async (
  comicId: number
): Promise<ComicDetail> => {
  const res = await HttpRequest.get<ComicDetailResponse>(
    `/comics/${comicId}`
  );

  return res.data.data;
};
export const getPageDetail = async (
  pageId: number
): Promise<PageDetailResponse> => {
  const appLocale = typeof window !== 'undefined' ? localStorage.getItem('app_locale') : 'vi';
  const res = await HttpRequest.get<{
    status: string;
    data: PageDetailResponse;
  }>(`/pages/${pageId}?lang=${appLocale || 'vi'}`);

  return res.data.data;
};

export const getChapterPages = async (
  chapterId: number
): Promise<ChapterPage[]> => {
  try {
    const res = await HttpRequest.get<any>(
      `/chapters/${chapterId}/pages`
    );

    if (res.data && Array.isArray(res.data)) {
      return res.data;
    }
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const syncReadingHistory = async (
  comicId: number,
  chapterId: number,
  lastPageRead: number,
  clientUpdatedAt: string
) => {
  try {
    const res = await HttpRequest.put("/reading-histories", {
      comicId,
      chapterId,
      lastPageRead,
      clientUpdatedAt,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};