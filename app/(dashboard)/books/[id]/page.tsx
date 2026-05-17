"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import {
  useComicOverviewQuery,
  useMakeComicRatingMutation,
} from "../queryHook/queryHook";

export default function BookDetailPage() {
  const params = useParams();
  const routeBookId = Array.isArray(params.id) ? params.id[0] : params.id;
  const bookId = routeBookId ? Number(routeBookId) : undefined;
  const hasValidBookId =
    typeof bookId === "number" && !Number.isNaN(bookId) && bookId > 0;

  const router = useRouter();
  const intl = useIntl();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { data, isLoading, isError } = useComicOverviewQuery(
    hasValidBookId ? bookId : undefined,
  );
  const { mutate: makeRating } = useMakeComicRatingMutation(
    hasValidBookId ? bookId : undefined,
  );

  if (!hasValidBookId || isLoading) {
    return (
      <div className="text-center py-10 font-medium text-gray-500">
        {intl.formatMessage({ id: "common.loading" })}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 font-medium text-red-500">
        {intl.formatMessage({ id: "common.error" })}
      </div>
    );
  }

  const bookData = data?.bookOverviewData;
  if (!bookData) {
    return (
      <div className="text-center py-10 font-medium text-gray-500">
        {intl.formatMessage({ id: "common.bookNotFound" })}
      </div>
    );
  } else {
    console.log("Book data:", bookData);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* BOOK HEADER */}
      <div className="flex justify-between mb-8">
        <div className="flex flex-col md:flex-row gap-20 mb-12">
          <Image
            src={bookData.coverImageUrl}
            alt={bookData.title}
            width={240}
            height={320}
            unoptimized
            className="w-60 h-80 object-cover rounded-lg shadow-xl"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {bookData.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              {bookData.author}
            </p>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">★</span>

                <span className="font-semibold text-lg">
                  {bookData.averageRating.toFixed(1)}
                </span>

                <span className="text-gray-500 dark:text-gray-400">
                  ({bookData.totalRatings}{" "}
                  {intl.formatMessage({ id: "dashboard.book.rating" })})
                </span>
              </div>

              <button
                className="px-4 py-2 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition text-sm font-medium"
                onClick={() => setIsReviewModalOpen(true)}
              >
                ⭐{" "}
                {intl.formatMessage({
                  id: "dashboard.book.writeReview",
                })}
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {bookData?.chapters?.length ?? 0}{" "}
              {intl.formatMessage({ id: "common.chapter" })}
            </p>

            <button
              onClick={() => router.push(`/books/${bookId}/chapter/1`)}
              disabled={bookData?.chapters?.length === 0}
              className="w-fit px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {intl.formatMessage({ id: "common.readFromStart" })}
            </button>
          </div>
        </div>
        <div>
          <button
            onClick={() => router.push(`/books/${bookId}/manage`)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            {intl.formatMessage({ id: "chapterPage.editComic" })}
          </button>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          {intl.formatMessage({ id: "dashboard.book.introduction" })}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {bookData.description}
        </p>
      </div>

      {/* CHAPTER LIST */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          {intl.formatMessage({ id: "dashboard.book.chapterList" })}
        </h2>
        <div className="border rounded-xl overflow-hidden divide-y dark:divide-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          {bookData?.chapters
            ?.sort((a, b) => a.chapterNumber - b.chapterNumber)
            .map((chapter) => (
              <div
                key={chapter.id}
                onClick={() =>
                  router.push(
                    `/books/${bookId}/chapter/${chapter.chapterNumber}`,
                  )
                }
                className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition flex justify-between items-center"
              >
                <span className="font-medium">
                  {intl.formatMessage({ id: "common.chapterCapital" })}{" "}
                  {chapter.chapterNumber}
                  {chapter.title ? `: ${chapter.title}` : ""}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            ))}

          {bookData?.chapters?.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {intl.formatMessage({ id: "common.noChapters" })}
            </div>
          )}
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {intl.formatMessage({
                    id: "dashboard.book.reviewModalTitle",
                  })}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({
                    id: "dashboard.book.reviewModalSubtitle",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {intl.formatMessage({
                    id: "dashboard.book.reviewRating",
                  })}
                </label>
                <select
                  value={ratingValue}
                  onChange={(event) =>
                    setRatingValue(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  {[5, 4, 3, 2, 1].map((score) => (
                    <option key={score} value={score}>
                      {score} ⭐
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {intl.formatMessage({
                  id: "common.cancel",
                })}
              </button>
              <button
                type="button"
                disabled={isSubmittingReview}
                onClick={() => {
                  makeRating(ratingValue);
                  setIsSubmittingReview(true);
                  console.log("Review submitted:", {
                    bookId,
                    rating: ratingValue,
                  });
                  setTimeout(() => {
                    setIsSubmittingReview(false);
                    setIsReviewModalOpen(false);
                    setRatingValue(5);
                  }, 300);
                }}
                className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmittingReview
                  ? intl.formatMessage({
                      id: "common.submitting",
                    })
                  : intl.formatMessage({
                      id: "dashboard.book.submitReview",
                    })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
