"use client";

import { useRouter } from "next/navigation";
import { useUserLibraryByType } from "./queryHooks";
import { GetBookSummaryListParams } from "./service";
import { useIntl } from "react-intl";
import { useUserStore } from "@/app/store/userStore";

export default function Dashboard() {
  const params = { page: 0, size: 3 } as GetBookSummaryListParams;
  const router = useRouter();
  const intl = useIntl();
  const user = useUserStore().user;
  const {
    data: recentBooksData,
    isLoading: recentLoading,
    isError: recentError,
  } = useUserLibraryByType({
    ...params,
    listType: "READING",
  });

  const {
    data: favoriteBooksData,
    isLoading: favoriteLoading,
    isError: favoriteError,
  } = useUserLibraryByType({
    ...params,
    listType: "FAVORITE",
  });
  const {
    data: readLaterBooksData,
    isLoading: readLaterLoading,
  } = useUserLibraryByType({
    ...params,
    listType: "READ_LATER",
  });

  if (recentLoading || favoriteLoading || readLaterLoading) {
    return <div className="text-center py-10">{intl.formatMessage({ id: "common.loading" })}</div>;
  }

  if (recentError || favoriteError) {
    return <div className="text-center py-10">{intl.formatMessage({ id: "common.error" })}</div>;
  }
  const titleMap: Record<string, string> = {
    recent: intl.formatMessage({ id: "dashboard.recentBooks" }),
    favorite: intl.formatMessage({ id: "dashboard.favoriteBooks" }),
    recorecommended: intl.formatMessage({ id: "dashboard.recommendedBooks" }),
    readLater: intl.formatMessage({ id: "dashboard.readLaterBooks" }),
  };

  // Sách đọc gần đây (thêm id)
  const recentBooks = recentBooksData;
  console.log("Recent Books:", recentBooks);

  // Yêu thích (có thể dùng dữ liệu khác, hiện tại dùng chung)
  const favoriteBooks = favoriteBooksData;

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-0 py-8">
        {/* Recent books */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{titleMap.recent}</h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              onClick={() => router.push("/books?type=recent")}
            >
              {intl.formatMessage({ id: "common.seeAll" })}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentBooks?.content.map((book) => (
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Favorite books */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{titleMap.favorite}</h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              onClick={() => router.push("/books?type=favorite")}
            >
              {intl.formatMessage({ id: "common.seeAll" })}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteBooks?.content.map((book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/books/${book.id}`)} // ← Click để đi đến trang chi tiết sách
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Read Later books */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{titleMap.readLater}</h2>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              onClick={() => router.push("/books?type=readLater")}
            >
              {intl.formatMessage({ id: "common.seeAll" })}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {readLaterBooksData?.content.map((book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/books/${book.id}`)} // ← Click để đi đến trang chi tiết sách
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
