"use client";

import { use, useState } from "react";
import { useIntl } from "react-intl";
import { useGenresQuery } from "./queryHooks";
import { useRouter } from "next/navigation";
interface Genre {
  id: number;
  name: string;
}

interface Chapter {
  chapterNumber: number;
  title: string;
  files: File[];
}

interface CreateComicData {
  title: string;
  author: string;
  description: string;
  genreIds: number[];
  cover: File | null;
}

export default function UploadMangaChapters() {
  const intl = useIntl();
  const router = useRouter();
  const {
    data: genreData,
    isLoading: isGenresLoading,
    isError: isGenresError,
  } = useGenresQuery();
  // Mock genre data từ API getGenreData

  const [manga, setManga] = useState<CreateComicData>({
    title: "",
    author: "",
    description: "",
    genreIds: [],
    cover: null,
  });

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      chapterNumber: 1,
      title: "",
      files: [],
    },
  ]);

  // ─────────────────────────────
  // Manga Info
  // ─────────────────────────────
  const updateManga = (
    field: keyof CreateComicData,
    value: string | number | File | null,
  ) => {
    setManga((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      updateManga("cover", e.target.files[0]);
    }
  };

  const toggleGenre = (genreId: number) => {
    setManga((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  // ─────────────────────────────
  // Chapter Functions
  // ─────────────────────────────
  const addNewChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        chapterNumber: prev.length + 1,
        title: "",
        files: [],
      },
    ]);
  };

  const updateChapterTitle = (chapterNumber: number, title: string) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.chapterNumber === chapterNumber
          ? {
              ...chapter,
              title,
            }
          : chapter,
      ),
    );
  };

  const addFilesToChapter = (chapterNumber: number, newFiles: File[]) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.chapterNumber === chapterNumber
          ? {
              ...chapter,
              files: [...chapter.files, ...newFiles],
            }
          : chapter,
      ),
    );
  };

  const removeFileFromChapter = (chapterNumber: number, fileIndex: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.chapterNumber === chapterNumber
          ? {
              ...chapter,
              files: chapter.files.filter((_, i) => i !== fileIndex),
            }
          : chapter,
      ),
    );
  };

  const removeChapter = (chapterNumber: number) => {
    if (chapters.length === 1) {
      alert(
        intl.formatMessage({
          id: "uploadPage.validation.minChapters",
        }),
      );
      return;
    }

    const updated = chapters
      .filter((chapter) => chapter.chapterNumber !== chapterNumber)
      .map((chapter, index) => ({
        ...chapter,
        chapterNumber: index + 1,
      }));

    setChapters(updated);
  };

  // ─────────────────────────────
  // Submit
  // ─────────────────────────────
  const handlePublish = () => {
    if (!manga.title.trim()) {
      alert(
        intl.formatMessage({
          id: "uploadPage.validation.titleRequired",
        }),
      );
      return;
    }

    if (!manga.author.trim()) {
      alert(
        intl.formatMessage({
          id: "uploadPage.validation.authorRequired",
        }),
      );
      return;
    }

    if (!manga.description.trim()) {
      alert(
        intl.formatMessage({
          id: "uploadPage.validation.descriptionRequired",
        }),
      );
      return;
    }

    if (!manga.cover) {
      alert(
        intl.formatMessage({
          id: "uploadPage.validation.coverRequired",
        }),
      );
      return;
    }

    if (manga.genreIds.length === 0) {
      alert(
        intl.formatMessage({
          id: "uploadPage.validation.genreRequired",
        }),
      );
      return;
    }

    // DTO gửi BE
    const comicData = {
      title: manga.title,
      author: manga.author,
      description: manga.description,
      genreIds: manga.genreIds,
    };

    const chapterData = chapters.map((chapter) => ({
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
    }));

    console.log("comicData:", comicData);
    console.log("chapterData:", chapterData);

    // Mock FormData
    const formData = new FormData();

    formData.append("comicData", JSON.stringify(comicData));

    formData.append("chapterData", JSON.stringify(chapterData));

    if (manga.cover) {
      formData.append("cover", manga.cover);
    }

    chapters.forEach((chapter) => {
      chapter.files.forEach((file) => {
        formData.append(`chapter_${chapter.chapterNumber}`, file);
      });
    });

    console.log("Ready to call API");
    // call hook để publish comic
    // nếu thành công , lấy id của bộ truyện redirect về màn quản lý truyện này
    router.push("/books/1/manage");
    // nếu không báo lỗi và không redirect
    return;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {intl.formatMessage({
            id: "uploadPage.title",
          })}
        </h1>

        {/* Manga Info */}
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-6 mb-10 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">
            {intl.formatMessage({
              id: "uploadPage.bookInfo.title",
            })}
          </h2>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {intl.formatMessage({
                id: "uploadPage.bookInfo.name",
              })}{" "}
              *
            </label>

            <input
              value={manga.title}
              onChange={(e) => updateManga("title", e.target.value)}
              className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
            />
          </div>

          {/* Author */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {intl.formatMessage({
                id: "uploadPage.bookInfo.author",
              })}{" "}
              *
            </label>

            <input
              value={manga.author}
              onChange={(e) => updateManga("author", e.target.value)}
              className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {intl.formatMessage({
                id: "uploadPage.bookInfo.description",
              })}
            </label>

            <textarea
              rows={5}
              value={manga.description}
              onChange={(e) => updateManga("description", e.target.value)}
              className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
            />
          </div>

          {/* Genre */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              {intl.formatMessage({
                id: "uploadPage.bookInfo.genre",
              })}{" "}
              *
            </label>

            <div className="flex flex-wrap gap-2">
              {genreData?.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    manga.genreIds.includes(genre.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cover */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {intl.formatMessage({
                id: "uploadPage.bookInfo.coverImage",
              })}{" "}
              *
            </label>

            <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition min-w-[320px] ">
                  <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={handleCoverChange}
                    className="hidden"
                  />

                  <span className="text-blue-600 font-medium block mb-2">
                    Choose Cover
                  </span>

                  <p className="text-sm text-gray-500">JPG, PNG, WEBP</p>
                </div>
              </label>
              {manga.cover && (
                <div className="w-48 h-72 rounded-lg overflow-hidden border dark:border-gray-700 shadow">
                  <img
                    src={URL.createObjectURL(manga.cover)}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-10">
          <div></div>

          <button
            onClick={handlePublish}
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            {intl.formatMessage({ id: "uploadPage.action.publish" })}
          </button>
        </div>
      </div>
    </div>
  );
}
