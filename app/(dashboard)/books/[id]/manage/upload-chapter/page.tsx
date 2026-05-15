"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useIntl } from "react-intl";
import { useUploadChapterWithPages } from "./queryhook";
import { CreateChapterRequest } from "./type";

export default function UploadChapterPage() {
  const params = useParams();
  const router = useRouter();
  const intl = useIntl();
  const searchParams = useSearchParams();
  const mangaId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const newChapterNumber = searchParams.get("newChapterNumber")
    ? parseInt(searchParams.get("newChapterNumber") as string)
    : 1;

  console.log(
    "📖 UploadChapterPage - comicId:",
    mangaId,
    "newChapterNumber:",
    newChapterNumber,
  );

  const [chapterData, setChapterData] = useState<CreateChapterRequest>({
    chapterNumber: newChapterNumber,
    title: "",
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);

  // Use the upload hook
  const uploadMutation = useUploadChapterWithPages();
  const isUploading = uploadMutation.isPending;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!chapterData.title || newFiles.length === 0) {
      alert("⚠️ Vui lòng nhập tiêu đề và chọn ít nhất một ảnh");
      return;
    }

    try {
      console.log("📤 Starting upload...", {
        comicId: mangaId,
        chapterData,
        filesCount: newFiles.length,
      });

      await uploadMutation.mutateAsync({
        comicId: mangaId,
        chapterData: {
          chapterNumber: chapterData.chapterNumber,
          title: chapterData.title,
        },
        files: newFiles,
      });

      alert("✅ Chapter đã được upload thành công!");
      router.push(`/books/${mangaId}/manage`);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("❌ Upload thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Upload Chapter Mới</h1>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-medium mb-2">Số Chapter</label>
            <input
              type="number"
              value={chapterData.chapterNumber}
              onChange={(e) =>
                setChapterData({
                  ...chapterData,
                  chapterNumber: parseInt(e.target.value),
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tiêu đề Chapter
            </label>
            <input
              type="text"
              value={chapterData.title}
              onChange={(e) =>
                setChapterData({ ...chapterData, title: e.target.value })
              }
              placeholder="Ví dụ: Cuộc gặp định mệnh"
              className="w-full border rounded-2xl px-5 py-4"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">
            Upload hình ảnh các trang
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-500 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="upload"
            />
            <label htmlFor="upload" className="cursor-pointer">
              <div className="text-5xl mb-4">📤</div>
              <p className="text-lg font-medium">
                Kéo thả hoặc click để upload
              </p>
              <p className="text-gray-500">
                PNG, JPG, WebP - Upload nhiều file
              </p>
            </label>
          </div>
        </div>

        {newFiles.length > 0 && (
          <div className="mb-8">
            <p className="font-medium mb-4">Hình đã chọn ({newFiles.length})</p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {newFiles.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="rounded-2xl aspect-[3/4] object-cover"
                    alt=""
                  />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/dashboard/books/${mangaId}/manage`)}
            className="flex-1 py-4 border rounded-2xl hover:bg-gray-100 disabled:opacity-50"
            disabled={isUploading}
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={
              isUploading || newFiles.length === 0 || !chapterData.title
            }
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? "Đang upload..." : "Đăng Chapter"}
          </button>
        </div>
      </div>
    </div>
  );
}
