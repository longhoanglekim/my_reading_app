"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useIntl } from "react-intl";
import BookRating from "@/app/components/common/BookRating";
import { useBooksByQuery, useUserLibraryByType } from "../dashboard/queryHooks";
import { useGetBookOverviewGroupByGenreQuery } from "./queryHook/queryHook";

const PAGE_SIZE_DEFAULT = 8;

export default function BooksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const intl = useIntl();

  const [page, setPage] = useState(1);

  const rawType = searchParams.get("type");
  const type = rawType || ""; // Cho phép type rỗng
  const isSearchMode = type === "query";
  const searchQuery = searchParams.get("query") || "";

  // ==================== FETCH DATA (giữ nguyên) ====================
  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
  } = useBooksByQuery({
    keyword: searchQuery,
    page: page - 1,
    size: PAGE_SIZE_DEFAULT,
  });

  let listType = "";
  if (type == "query") {
    listType = "QUERY";
  } else if (type == "recent") {
    listType = "READING";
  } else if (type == "favorite") {
    listType = "FAVORITE";
  } else if (type == "readLater") {
    listType = "READ_LATER";
  }

  const {
    data: userLibraryData,
    isLoading: userLibraryLoading,
    isError: userLibraryError,
  } = useUserLibraryByType({
    page: page - 1,
    size: PAGE_SIZE_DEFAULT,
    listType,
  });

  const fetchData = isSearchMode ? searchData : userLibraryData;
  const isLoading = isSearchMode ? searchLoading : userLibraryLoading;
  const isError = isSearchMode ? searchError : userLibraryError;

  let totalPage = null;
  if (fetchData) {
    totalPage = Math.ceil(fetchData.totalElements / PAGE_SIZE_DEFAULT);
  }

  const titleMap: Record<string, string> = {
    recent: intl.formatMessage({ id: "dashboard.recentBooks" }),
    favorite: intl.formatMessage({ id: "dashboard.favoriteBooks" }),
    recommended: "Sách đề xuất",
    readLater: intl.formatMessage({ id: "dashboard.readLaterBooks" }),
    query: searchQuery
      ? `Kết quả tìm kiếm cho "${searchQuery}"`
      : "Tìm kiếm sách",
  };

  // ==================== FAKE DATA CHO TRƯỜNG HỢP TYPE RỖNG ====================
  const {
    data: comicDataByGenre,
    isLoading: comicDataByGenreLoading,
    isError: comicDataByGenreError,
  } = useGetBookOverviewGroupByGenreQuery();

  // ==================== LOADING & ERROR (giữ nguyên) ====================
  if (userLibraryLoading) {
    return (
      <div className="text-center py-10 font-medium text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }
  if (userLibraryError) {
    return (
      <div className="text-center py-10 font-medium text-red-500">
        Có lỗi xảy ra khi tải dữ liệu.
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="max-w-7xl mx-auto px-0 py-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {type ? titleMap[type] || "Danh sách sách" : "Khám phá theo thể loại"}
        </h1>
      </div>

      {/* ==================== PHẦN TYPE RỖNG - THEO THỂ LOẠI ==================== */}
      {type === "" ? (
        <div className="space-y-12">
          {comicDataByGenre?.content.map((genreItem) => (
            <div key={genreItem.genre}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">{genreItem.genre}</h2>
                <button
                  onClick={() =>
                    router.push(
                      `/books?type=genre&genre=${encodeURIComponent(genreItem.genre)}`,
                    )
                  }
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Xem tất cả →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {genreItem.books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => router.push("/books/" + book.id)}
                    className="group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-row justify-between">
                      <div>
                        <h3 className="font-semibold line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {book.author}
                        </p>
                      </div>
                      <div>
                        <BookRating rating={book.averageRating} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ==================== PHẦN CODE CŨ (không thay đổi) ==================== */
        <>
          {/* UI hiển thị danh sách */}
          {fetchData?.content.length === 0 ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center text-center text-gray-500">
              {type === "query" && !searchQuery.trim()
                ? "Vui lòng nhập từ khóa tìm kiếm."
                : "Hiện chưa có sách nào trong danh mục này."}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fetchData?.content.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => router.push("/books/" + book.id)}
                    className="group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-row justify-between">
                      <div>
                        <h3 className="font-semibold line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {book.author}
                        </p>
                      </div>
                      <div>
                        <BookRating rating={book.averageRating} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Điều khiển phân trang */}
              {totalPage && totalPage > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition"
                  >
                    {intl.formatMessage({ id: "common.prev" })}
                  </button>

                  {Array.from({ length: totalPage }).map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setPage(index + 1)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        page === index + 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100 transition"
                  >
                    {intl.formatMessage({ id: "common.next" })}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
