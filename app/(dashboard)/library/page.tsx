"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import BookRating from "@/app/components/common/BookRating";
import { useBooksByQuery, useUserLibraryByType, useReadingHistoryList } from "../dashboard/queryHooks";
import { GetBookSummaryListParams } from "../dashboard/service";

const PAGE_SIZE_DEFAULT = 8;

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const intl = useIntl();

  const [page, setPage] = useState(1);

  const rawType = searchParams.get("type");
  const type = rawType || "";
  const isSearchMode = type === "query";
  const searchQuery = searchParams.get("query") || "";

  // Reset page when search or type changes
  useEffect(() => {
    setPage(1);
  }, [type, searchQuery]);

  // ==================== FETCH DATA FOR FILTERED LISTS ====================
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
  if (type === "query") {
    listType = "QUERY";
  } else if (type === "recent") {
    listType = "READING";
  } else if (type === "favorite") {
    listType = "FAVORITE";
  } else if (type === "readLater") {
    listType = "READ_LATER";
  }

  const isRecentMode = type === "recent";

  const {
    data: userLibraryData,
    isLoading: userLibraryLoading,
    isError: userLibraryError,
  } = useUserLibraryByType({
    page: page - 1,
    size: PAGE_SIZE_DEFAULT,
    listType,
  });

  const {
    data: readingHistoryListData,
    isLoading: readingHistoryListLoading,
    isError: readingHistoryListError,
  } = useReadingHistoryList({
    page: page - 1,
    size: PAGE_SIZE_DEFAULT,
  });

  const fetchData = isSearchMode
    ? searchData
    : isRecentMode
    ? readingHistoryListData
    : userLibraryData;

  const filteredLoading = isSearchMode
    ? searchLoading
    : isRecentMode
    ? readingHistoryListLoading
    : userLibraryLoading;

  const filteredError = isSearchMode
    ? searchError
    : isRecentMode
    ? readingHistoryListError
    : userLibraryError;

  let totalPage = null;
  if (fetchData) {
    totalPage = Math.ceil(fetchData.totalElements / PAGE_SIZE_DEFAULT);
  }

  // ==================== FETCH DATA FOR LIBRARY OVERVIEW ====================
  const overviewParams = { page: 0, size: 4 } as GetBookSummaryListParams; // show up to 4 books in overview rows
  
  const {
    data: recentBooksData,
    isLoading: recentLoading,
    isError: recentError,
  } = useReadingHistoryList(overviewParams);

  const {
    data: favoriteBooksData,
    isLoading: favoriteLoading,
    isError: favoriteError,
  } = useUserLibraryByType({
    ...overviewParams,
    listType: "FAVORITE",
  });

  const {
    data: readLaterBooksData,
    isLoading: readLaterLoading,
    isError: readLaterError,
  } = useUserLibraryByType({
    ...overviewParams,
    listType: "READ_LATER",
  });

  const overviewLoading = recentLoading || favoriteLoading || readLaterLoading;
  const overviewError = recentError || favoriteError || readLaterError;

  // Title mapping for filtered list
  const titleMap: Record<string, string> = {
    recent: intl.formatMessage({ id: "dashboard.recentBooks" }),
    favorite: intl.formatMessage({ id: "dashboard.favoriteBooks" }),
    recommended: intl.formatMessage({ id: "dashboard.recommendedBooks" }),
    readLater: intl.formatMessage({ id: "dashboard.readLaterBooks" }),
    query: searchQuery
      ? intl.formatMessage({ id: "books.searchResults" }, { query: searchQuery })
      : intl.formatMessage({ id: "books.searchBooks" }),
  };

  // ==================== RENDERING LOGIC ====================
  
  // 1. Loading state
  if (type ? filteredLoading : overviewLoading) {
    return (
      <div className="text-center py-10 font-medium text-gray-500">
        {intl.formatMessage({ id: "common.loading" })}
      </div>
    );
  }

  // 2. Error state
  if (type ? filteredError : overviewError) {
    return (
      <div className="text-center py-10 font-medium text-red-500">
        {intl.formatMessage({ id: "common.error" })}
      </div>
    );
  }

  // 3. Grid View (Filtered Lists / Search)
  if (type !== "") {
    return (
      <div className="max-w-7xl mx-auto px-0 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {titleMap[type] || intl.formatMessage({ id: "books.bookList" })}
          </h1>
        </div>

        {fetchData?.content.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center text-gray-500">
            {type === "query" && !searchQuery.trim()
              ? intl.formatMessage({ id: "books.emptySearchKeyword" })
              : intl.formatMessage({ id: "books.emptyCategory" })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fetchData?.content.map((bookItem) => {
                const book = bookItem as any;
                const bookId = book.id || book.comicId;
                return (
                  <div
                    key={bookId}
                    onClick={() => router.push("/books/" + bookId)}
                    className="group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square relative">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex flex-row justify-between items-start gap-2">
                        <div>
                          <h3 className="font-semibold line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {book.author}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <BookRating rating={book.averageRating} />
                        </div>
                      </div>
                    </div>
                    {book.chapterNumber && (
                      <div className="px-4 pb-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/books/${bookId}/chapter/${book.chapterNumber}`);
                          }}
                          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold text-center transition duration-200"
                        >
                          {intl.formatMessage(
                            { id: "common.continueReading", defaultMessage: "Đọc tiếp Chương {chapter}" },
                            { chapter: book.chapterNumber }
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
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
      </div>
    );
  }

  // 4. Default Library Overview View
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-0 py-8">
        
        {/* Recent Books */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{intl.formatMessage({ id: "dashboard.recentBooks" })}</h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              onClick={() => router.push("/library?type=recent")}
            >
              {intl.formatMessage({ id: "common.seeAll" })}
            </button>
          </div>

          {recentBooksData?.content.length === 0 ? (
            <div className="py-6 text-gray-500 text-center bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              {intl.formatMessage({ id: "books.emptyCategory" })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentBooksData?.content.map((bookItem) => {
                const book = bookItem as any;
                const bookId = book.id || book.comicId;
                return (
                  <div
                    key={bookId}
                    onClick={() => router.push(`/books/${bookId}`)}
                    className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[1] relative">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                      </div>
                    </div>
                    {book.chapterNumber && (
                      <div className="px-4 pb-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/books/${bookId}/chapter/${book.chapterNumber}`);
                          }}
                          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold text-center transition duration-200"
                        >
                          {intl.formatMessage(
                            { id: "common.continueReading", defaultMessage: "Đọc tiếp Chương {chapter}" },
                            { chapter: book.chapterNumber }
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Favorite Books */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{intl.formatMessage({ id: "dashboard.favoriteBooks" })}</h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              onClick={() => router.push("/library?type=favorite")}
            >
              {intl.formatMessage({ id: "common.seeAll" })}
            </button>
          </div>

          {favoriteBooksData?.content.length === 0 ? (
            <div className="py-6 text-gray-500 text-center bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              {intl.formatMessage({ id: "books.emptyCategory" })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteBooksData?.content.map((book) => (
                <div
                  key={book.id}
                  onClick={() => router.push(`/books/${book.id}`)}
                  className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  <div className="aspect-[1] relative">
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Read Later Books */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{intl.formatMessage({ id: "dashboard.readLaterBooks" })}</h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              onClick={() => router.push("/library?type=readLater")}
            >
              {intl.formatMessage({ id: "common.seeAll" })}
            </button>
          </div>

          {readLaterBooksData?.content.length === 0 ? (
            <div className="py-6 text-gray-500 text-center bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              {intl.formatMessage({ id: "books.emptyCategory" })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {readLaterBooksData?.content.map((book) => (
                <div
                  key={book.id}
                  onClick={() => router.push(`/books/${book.id}`)}
                  className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  <div className="aspect-[1] relative">
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
