/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useComicChaptersQuery, useComicOverviewQuery } from "./queryHooks";

interface BookChapter {
  id: string;
  book_id: string;
  chapterNumber: number;
  title: string;
  total_pages: number;
  hasNextChapter: boolean;
}

export default function EditMangaPage() {
  const params = useParams();
  const comicId = params.id as string;
  console.log("Comic ID from params:", comicId);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    cover: "",
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: comicData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useComicOverviewQuery(Number(comicId));

  const {
    data: chapterResponse,
    isLoading: isChaptersLoading,
    isError: isChaptersError,
  } = useComicChaptersQuery(Number(comicId));

  const isLoading = isOverviewLoading;
  const isError = isOverviewError;

  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const maxChapter =
    chapters.length > 0 ? Math.max(...chapters.map((c) => c.chapterNumber)) : 0;
  useEffect(() => {
    if (!comicData || isInitialized) return;

    setFormData({
      title: comicData.title || "",
      author: comicData.author || "",
      description: comicData.description || "",
      cover: comicData.coverImageUrl || "",
    });

    setIsInitialized(true);
  }, [comicData, isInitialized]);

  useEffect(() => {
    if (!chapterResponse?.content) return;

    setChapters(
      chapterResponse.content.map((chapter) => ({
        id: String(chapter.id),
        book_id: comicId,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        total_pages: 0,
        hasNextChapter: false,
      })),
    );
  }, [chapterResponse, comicId]);

  // ==================== HANDLERS ====================

  const handleSaveManga = async () => {
    try {
      setIsSaving(true);

      console.log("Saving manga:", formData);

      // TODO:
      // await updateComic()

      setTimeout(() => {
        alert("✅ Đã lưu thông tin manga thành công!");
        setIsSaving(false);
      }, 700);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    const targetChapter = chapters.find((c) => c.id === chapterId);

    if (!targetChapter) return;

    const confirmed = confirm(`Xóa Chapter ${targetChapter.chapterNumber}?`);

    if (!confirmed) return;

    setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId));
  };

  // ==================== LOADING ====================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        Đang tải dữ liệu...
      </div>
    );
  }

  // ==================== ERROR ====================

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        Không thể tải dữ liệu manga
      </div>
    );
  }

  // ==================== UI ====================

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chỉnh sửa Manga</h1>

        <button
          onClick={() => router.push(`/books/${comicId}`)}
          className="px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition"
        >
          ← Quay lại Trang Chi Tiết
        </button>
      </div>

      {/* ==================== MANGA INFO ==================== */}

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6">Thông tin Manga</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COVER */}
          <div className="lg:col-span-4">
            <label className="block text-sm font-medium mb-3">Ảnh bìa</label>

            {formData.cover ? (
              <img
                src={formData.cover}
                alt="cover"
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-md"
              />
            ) : (
              <div className="w-full aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                No Cover
              </div>
            )}

            <label className="mt-4 block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setFormData({
                      ...formData,
                      cover: URL.createObjectURL(file),
                    });
                  }}
                />

                <span className="text-blue-600 font-medium block mb-2">
                  Upload ảnh bìa
                </span>

                <p className="text-sm text-gray-500">JPG, PNG, WEBP</p>
              </div>
            </label>
          </div>

          {/* FORM */}
          <div className="lg:col-span-8 space-y-6">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề</label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-2xl px-5 py-4 bg-transparent"
              />
            </div>

            {/* AUTHOR */}
            <div>
              <label className="block text-sm font-medium mb-2">Tác giả</label>

              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-2xl px-5 py-4 bg-transparent"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>

              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-3xl px-5 py-4 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}

        <button
          onClick={handleSaveManga}
          disabled={isSaving}
          className="mt-8 px-10 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 disabled:opacity-70"
        >
          {isSaving ? "Đang lưu..." : "💾 Lưu thông tin Manga"}
        </button>
      </div>

      {/* ==================== CHAPTER LIST ==================== */}

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">
            Danh sách Chapter ({chapters.length})
          </h2>

          <button
            onClick={() =>
              router.push(
                `/books/${comicId}/manage/upload-chapter?newChapterNumber=${maxChapter + 1}`,
              )
            }
            className="px-6 py-3 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition"
          >
            + Upload Chapter Mới
          </button>
        </div>

        <div className="space-y-4">
          {chapters
            .sort((a, b) => b.chapterNumber - a.chapterNumber)
            .map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl group hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-6">
                  <div className="text-3xl font-bold text-gray-300 w-12">
                    #{chapter.chapterNumber}
                  </div>

                  <div>
                    <div className="font-medium text-lg">
                      {chapter.title || `Chapter ${chapter.chapterNumber}`}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {chapter.total_pages} trang
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(
                        `/books/${comicId}/manage/edit-chapter/${chapter.id}`,
                      )
                    }
                    className="px-6 py-3 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition"
                  >
                    Chỉnh sửa Pages
                  </button>

                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="px-6 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}

          {chapters.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              Chưa có chapter nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
