import HttpRequest from "@/app/config/auth";
import {
  CreateChapterRequest,
  CreateChapterResponse,
  UploadPageResponse,
} from "./type";
import qs from "qs";
/**
 * Create a new chapter
 * POST /comics/{comicId}/chapters
 */
export const createChapter = async (
  comicId: string | number,
  data: CreateChapterRequest
): Promise<CreateChapterResponse> => {
  try {
    const res = await HttpRequest.post<
      CreateChapterResponse | { data: CreateChapterResponse }
    >(`/comics/${comicId}/chapters`, data);

    const payload =
      (res.data as { data?: CreateChapterResponse }).data ??
      (res.data as CreateChapterResponse);

    if (!payload || typeof payload.id !== "number") {
      throw new Error("Create chapter response missing id");
    }

    return payload;
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
};

/**
 * Upload pages for a chapter
 * POST /chapters/{chapterId}/pages
 * Send FormData with image files
 * @param chapterId - Chapter ID
 * @param files - Array of image files
 * @param startPageNumber - Starting page number (default: 1)
 */
export const uploadChapterPages = async (
  chapterId: number,
  files: File[],
  startPageNumber: number = 1,
  targetLangs: string[] = ["vi", "en"]
): Promise<UploadPageResponse[]> => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const params = new URLSearchParams();

    params.append("startPageNumber", String(startPageNumber));

    targetLangs.forEach((lang) => {
      params.append("targetLangs", lang);
    });
    console.log("📤 Uploading pages with params:", {
      startPageNumber,
      targetLangs: targetLangs.join(", "),
    });
    const res = await HttpRequest.post<UploadPageResponse[]>(
      `/chapters/${chapterId}/pages?${params.toString()}`,
      formData
    );

    return res.data;
  } catch (error) {
    console.error("Error uploading pages:", error);
    throw error;
  }
};
/**
 * Upload chapter with pages in one operation
 * Calls createChapter first, then uploadChapterPages
 */
export const uploadChapterWithPages = async (
  comicId: string | number,
  chapterData: CreateChapterRequest,
  files: File[],
  startPageNumber: number = 1,
  targetLangs: string[] = ["vi","en"]
): Promise<{ chapter: CreateChapterResponse; pages: UploadPageResponse[] }> => {
  try {
    // Step 1: Create chapter
    console.log("📖 Creating chapter...", chapterData);
    const chapter = await createChapter(comicId, chapterData);
    console.log("✅ Chapter created:", chapter);

    if (!chapter?.id) {
      throw new Error("Invalid chapter ID returned from createChapter");
    }

    // Step 2: Upload pages
    console.log("📤 Uploading pages...");
    const pages = await uploadChapterPages(
      chapter.id,
      files,
      startPageNumber,
      targetLangs,
    );
    console.log("✅ Pages uploaded:", pages);

    return { chapter, pages };
  } catch (error) {
    console.error("Error uploading chapter with pages:", error);
    throw error;
  }
};
