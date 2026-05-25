"use client";

import { useState } from "react";
import { useIntl } from "react-intl";
import { useGenresQuery, useCreateComicMutation } from "./queryHooks";
import { useRouter } from "next/navigation";

interface CreateComicData {
  title: string;
  author: string;
  description: string;
  originalLanguage: string;
  format: string;
  status: string;
  genreIds: number[];
  cover: File | null;
}

const LANGUAGE_OPTIONS = [
  // { value: "vi", label: "Vietnamese" },
  // { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
  { value: "ko", label: "Korean" },
];

const FORMAT_OPTIONS = [
  { value: "webtoon", label: "Webtoon" },
  { value: "manga", label: "Manga" },
];

const STATUS_OPTIONS = [
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Ongoing" }
]

export default function UploadMangaChapters() {
  const intl = useIntl();
  const router = useRouter();

  const { data: genreData } = useGenresQuery();

  const createComicMutation = useCreateComicMutation();

  const [manga, setManga] = useState<CreateComicData>({
    title: "",
    author: "",
    description: "",
    originalLanguage: "ja",
    format: "manga",
    status: "",
    genreIds: [],
    cover: null,
  });
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
  // Submit
  // ─────────────────────────────
  const handlePublish = async () => {
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

    const formData = new FormData();

    formData.append("title", manga.title);
    formData.append("author", manga.author);
    formData.append("description", manga.description);
    formData.append("originalLanguage", manga.originalLanguage);
    formData.append("format", manga.format);
    formData.append("status", manga.status);

    manga.genreIds.forEach((genreId) => {
      formData.append("genres", genreId.toString());
    });

    if (manga.cover) {
      formData.append("coverImage", manga.cover);
    }

    try {
      const response = await createComicMutation.mutateAsync(formData);

      const comicId = response?.data?.id;

      if (comicId) {
        router.push(`/books/${comicId}/manage`);
      }
    } catch (error) {
      console.error("Failed to create comic", error);
    }
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
              placeholder={intl.formatMessage({
                id: "uploadPage.bookInfo.namePlaceholder",
              })}
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
              placeholder={intl.formatMessage({
                id: "uploadPage.bookInfo.authorPlaceholder",
              })}
              className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
            />
          </div>

          {/* Language - Format - Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Original Language */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {intl.formatMessage({
                  id: "uploadPage.bookInfo.originalLanguage",
                })}
              </label>

              <select
                value={manga.originalLanguage}
                onChange={(e) =>
                  updateManga("originalLanguage", e.target.value)
                }
                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
              >
                {LANGUAGE_OPTIONS.map((language) => (
                  <option
                    key={language.value}
                    value={language.value}
                    className="bg-white dark:bg-gray-900"
                  >
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {intl.formatMessage({
                  id: "uploadPage.bookInfo.format",
                })}
              </label>

              <select
                value={manga.format}
                onChange={(e) => updateManga("format", e.target.value)}
                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
              >
                {FORMAT_OPTIONS.map((format) => (
                  <option
                    key={format.value}
                    value={format.value}
                    className="bg-white dark:bg-gray-900"
                  >
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {intl.formatMessage({
                  id: "uploadPage.bookInfo.status",
                })}
              </label>
              <select
                value={manga.format}
                onChange={(e) => updateManga("format", e.target.value)}
                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                    className="bg-white dark:bg-gray-900"
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
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
              placeholder={intl.formatMessage({
                id: "uploadPage.bookInfo.descriptionPlaceholder",
              })}
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
                  className={`px-4 py-2 rounded-full text-sm transition ${manga.genreIds.includes(genre.id)
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
                <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition min-w-[320px]">
                  <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={handleCoverChange}
                    className="hidden"
                  />

                  <span className="text-blue-600 font-medium block mb-2">
                    {intl.formatMessage({
                      id: "uploadPage.bookInfo.chooseCover",
                    })}
                  </span>

                  <p className="text-sm text-gray-500">
                    {intl.formatMessage({
                      id: "uploadPage.bookInfo.recommendedSize",
                    })}
                  </p>
                </div>
              </label>

              {manga.cover && (
                <div className="w-48 h-72 rounded-lg overflow-hidden border dark:border-gray-700 shadow">
                  <img
                    src={URL.createObjectURL(manga.cover)}
                    alt={intl.formatMessage({
                      id: "uploadPage.bookInfo.coverImage",
                    })}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-10">
          <div />

          <button
            onClick={handlePublish}
            disabled={createComicMutation.isPending}
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
          >
            {createComicMutation.isPending
              ? "Publishing..."
              : intl.formatMessage({
                id: "uploadPage.action.publish",
              })}
          </button>
        </div>
      </div>
    </div>
  );
}
