import HttpRequest from "../../../../../../config/auth";
import { CommentsResponse, ChapterComment, ChapterOverview, PageDetailResponse, ChapterPage, ComicDetail, ComicDetailResponse } from '../type'
const appLocale = localStorage.getItem('app_locale') ;
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
  const res = await HttpRequest.get<{
    status: string;
    data: PageDetailResponse;
  }>(`/pages/${pageId}?lang=${appLocale}`);

  return res.data.data;
};

export const getChapterPages = async (
  chapterId: number
): Promise<ChapterPage[]> => {
  try {
    const res = await HttpRequest.get<ChapterPage[]>(
      `/chapters/${chapterId}/pages`
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};