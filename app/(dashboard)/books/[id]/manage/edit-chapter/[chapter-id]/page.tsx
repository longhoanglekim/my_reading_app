"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { ChapterPage } from "../../../chapter/[chapter]/type";
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

  // Mock fetch
  useEffect(() => {
    setChapterData({
      chapterNumber: 5,
      title: "Bí Mật Của Sa Mạc",
    });

    setPages([
      {
        page_id: "p1",
        chapter_id: chapterId,
        page_number: 1,
        image_url: "https://picsum.photos/id/1015/800/1200",
      },
      {
        page_id: "p2",
        chapter_id: chapterId,
        page_number: 2,
        image_url: "https://picsum.photos/id/1016/800/1200",
      },
      {
        page_id: "p3",
        chapter_id: chapterId,
        page_number: 3,
        image_url: "https://picsum.photos/id/133/800/1200",
      },
    ]);
  }, [chapterId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setNewFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeExistingPage = (pageId: string) => {
    if (confirm("Xóa trang này?")) {
      setPages((prev) => prev.filter((p) => p.page_id !== pageId));
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteChapter = () => {
    if (confirm("⚠️ Xóa toàn bộ chapter này?")) {
      setIsDeleting(true);

      setTimeout(() => {
        alert("Chapter đã bị xóa");
        router.push(`/dashboard/manga/${mangaId}/edit`);
      }, 600);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // TODO: call update API

      setTimeout(() => {
        alert("Cập nhật chapter thành công");
      }, 500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Chỉnh sửa Chapter {chapterData.chapterNumber}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-8">
        {/* Chapter Info */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Thông tin Chapter</h2>

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
              className="border rounded-2xl px-5 py-4"
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
              className="border rounded-2xl px-5 py-4"
            />
          </div>
        </div>

        {/* Existing Pages */}
        <div className="mb-12">
          <h3 className="font-semibold mb-4">Trang hiện có ({pages.length})</h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pages.map((page) => (
              <div key={page.page_id} className="relative group">
                <img
                  src={page.image_url}
                  alt={`Page ${page.page_number}`}
                  className="rounded-2xl aspect-[3/4] object-cover"
                />

                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                  Trang {page.page_number}
                </div>

                <button
                  onClick={() => removeExistingPage(page.page_id)}
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
          <h3 className="font-semibold mb-4">Thêm trang mới</h3>

          <label className="border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <span className="font-medium text-blue-600">
              Upload ảnh chapter
            </span>

            <p className="text-sm text-gray-500 mt-2">
              Chọn nhiều ảnh cùng lúc
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
            {isDeleting ? "Đang xóa..." : "Xóa Chapter"}
          </button>

          <button
            onClick={() => router.push(`/dashboard/manga/${mangaId}/edit`)}
            className="flex-1 py-4 border rounded-2xl"
          >
            Hủy
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl"
          >
            {isSaving ? "Đang lưu..." : "Cập nhật Chapter"}
          </button>
        </div>
      </div>
    </div>
  );
}
