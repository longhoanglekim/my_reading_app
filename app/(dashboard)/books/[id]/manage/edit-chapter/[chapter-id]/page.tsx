"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChapterPage } from "@/app/(reader)/books/[id]/chapter/[chapter]/type";
import { getChapterPages } from "@/app/(reader)/books/[id]/chapter/[chapter]/service/service";
import { deleteChapter, deleteSinglePage } from "../../service";
import { uploadChapterPages } from "../../upload-chapter/service";
import { useComicChaptersQuery } from "../../queryHooks";

interface ChapterData {
  chapterNumber: number;
  title: string;
}

export default function EditChapterPage() {
  const params = useParams();
  console.log("📖 EditChapterPage - params:", params);
  const router = useRouter();
  const intl = useIntl();

  const mangaId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const chapterId = Array.isArray(params["chapter-id"])
    ? params["chapter-id"][0]
    : params["chapter-id"] || "";
  console.log(
    "📖 EditChapterPage - mangaId:",
    mangaId,
    "chapterId:",
    chapterId,
  );
  const [chapterData, setChapterData] = useState<ChapterData>({
    chapterNumber: 0,
    title: "",
  });

  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  const { data: chaptersData } = useComicChaptersQuery(Number(mangaId));
  const currentChapter = chaptersData?.content?.find((c) => String(c.id) === String(chapterId));

  const { data: fetchedPages } = useQuery({
    queryKey: ["chapter-pages", Number(chapterId)],
    queryFn: () => getChapterPages(Number(chapterId)),
    enabled: !!chapterId,
  });

  useEffect(() => {
    if (currentChapter) {
      setChapterData({
        chapterNumber: currentChapter.chapterNumber,
        title: currentChapter.title || "",
      });
    }
  }, [currentChapter]);

  useEffect(() => {
    if (fetchedPages) {
      setPages(fetchedPages);
    }
  }, [fetchedPages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeExistingPage = async (pageId: number) => {
    if (confirm(intl.formatMessage({ id: "editChapter.deletePageConfirm" }))) {
      try {
        await deleteSinglePage(pageId);
        queryClient.invalidateQueries({ queryKey: ["chapter-pages", Number(chapterId)] });
        queryClient.invalidateQueries({ queryKey: ["comic-chapters", Number(mangaId)] });
      } catch (error) {
        console.error("Failed to delete page:", error);
      }
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteChapter = async () => {
    if (confirm(intl.formatMessage({ id: "editChapter.deleteChapterConfirm" }))) {
      setIsDeleting(true);

      try {
        await deleteChapter(Number(chapterId));
        queryClient.invalidateQueries({ queryKey: ["comic-chapters", Number(mangaId)] });
        alert(intl.formatMessage({ id: "editChapter.deleteSuccess" }));
        router.push(`/books/${mangaId}/manage`);
      } catch (error) {
        console.error("Failed to delete chapter:", error);
        alert("Xóa chương thất bại!");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSave = async () => {
    if (newFiles.length === 0) {
      router.push(`/books/${mangaId}/manage`);
      return;
    }

    setIsSaving(true);

    try {
      const maxPageNum = pages.length > 0 ? Math.max(...pages.map((p) => p.pageNumber)) : 0;
      await uploadChapterPages(Number(chapterId), newFiles, maxPageNum + 1);

      queryClient.invalidateQueries({ queryKey: ["chapter-pages", Number(chapterId)] });
      queryClient.invalidateQueries({ queryKey: ["comic-chapters", Number(mangaId)] });

      alert(intl.formatMessage({ id: "editChapter.saveSuccess" }));
      router.push(`/books/${mangaId}/manage`);
    } catch (error) {
      console.error("Failed to upload new pages:", error);
      alert("Đăng tải trang mới thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">
        {intl.formatMessage(
          { id: "editChapter.title" },
          { number: chapterData.chapterNumber }
        )}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-8">
        {/* Chapter Info */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {intl.formatMessage({ id: "editChapter.infoTitle" })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              value={chapterData.chapterNumber}
              onChange={(e) =>
                setChapterData((prev) => ({
                  ...prev,
                  chapterNumber: Number(e.target.value),
                }))
              }
              className="border rounded-2xl px-5 py-4 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              disabled
            />

            <input
              type="text"
              value={chapterData.title}
              onChange={(e) =>
                setChapterData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="border rounded-2xl px-5 py-4 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        {/* Existing Pages */}
        <div className="mb-12">
          <h3 className="font-semibold mb-4">
            {intl.formatMessage(
              { id: "editChapter.existingPagesCount" },
              { count: pages.length }
            )}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pages.map((page) => (
              <div key={page.id} className="relative group">
                <img
                  src={page.imageUrl}
                  alt={`Page ${page.pageNumber}`}
                  className="rounded-2xl aspect-[3/4] object-cover"
                />

                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                  {intl.formatMessage(
                    { id: "editChapter.pageLabel" },
                    { number: page.pageNumber }
                  )}
                </div>

                <button
                  onClick={() => removeExistingPage(page.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload new pages */}
        <div className="mb-10">
          <h3 className="font-semibold mb-4">
            {intl.formatMessage({ id: "editChapter.addNewPages" })}
          </h3>

          <label className="border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <span className="font-medium text-blue-600">
              {intl.formatMessage({ id: "editChapter.uploadImage" })}
            </span>

            <p className="text-sm text-gray-500 mt-2">
              {intl.formatMessage({ id: "editChapter.selectMultipleImages" })}
            </p>
          </label>

          {newFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {newFiles.map((file, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="rounded-2xl aspect-[3/4] object-cover"
                  />

                  <button
                    onClick={() => removeNewFile(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-12">
          <button
            onClick={handleDeleteChapter}
            disabled={isDeleting}
            className="px-8 py-4 border border-red-500 text-red-600 rounded-2xl"
          >
            {isDeleting
              ? intl.formatMessage({ id: "editChapter.deleting" })
              : intl.formatMessage({ id: "editChapter.deleteButton" })}
          </button>

          <button
            onClick={() => router.push(`/books/${mangaId}/manage`)}
            className="flex-1 py-4 border rounded-2xl"
          >
            {intl.formatMessage({ id: "common.cancel" })}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl"
          >
            {isSaving
              ? intl.formatMessage({ id: "editChapter.saving" })
              : intl.formatMessage({ id: "editChapter.updateButton" })}
          </button>
        </div>
      </div>
    </div>
  );
}
