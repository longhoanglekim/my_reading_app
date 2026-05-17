"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Users, Calendar, Settings } from "lucide-react";
import { useUserLibraryByType } from "./queryHooks";
import { GetBookSummaryListParams } from "./service";
import { useIntl } from "react-intl";

export default function Dashboard() {
  const params = { page: 0, size: 3 } as GetBookSummaryListParams;
  const router = useRouter();
  const intl = useIntl();
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
    isError: readLaterError,
  } = useUserLibraryByType({
    ...params,
    listType: "READ_LATER",
  });

  if (recentLoading || favoriteLoading || readLaterLoading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  }

  if (recentError || favoriteError) {
    return <div className="text-center py-10">Có lỗi xảy ra</div>;
  }
  // Dữ liệu giả lập stats
  const stats = [
    {
      title: "Sách đã đọc",
      value: "1,234",
      change: "+12.5%",
      icon: BookOpen,
      color:
        "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300",
      hover: "hover:bg-amber-200 dark:hover:bg-amber-900/50",
    },
    {
      title: "Người dùng hoạt động",
      value: "567",
      change: "+8.3%",
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300",
      hover: "hover:bg-blue-200 dark:hover:bg-blue-900/50",
    },
    {
      title: "Sự kiện sắp tới",
      value: "12",
      change: "+4.2%",
      icon: Calendar,
      color:
        "bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300",
      hover: "hover:bg-green-200 dark:hover:bg-green-900/50",
    },
    {
      title: "Cài đặt đang chờ",
      value: "5",
      change: "0%",
      icon: Settings,
      color:
        "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300",
      hover: "hover:bg-purple-200 dark:hover:bg-purple-900/50",
    },
  ];
  const titleMap: Record<string, string> = {
    recent: intl.formatMessage({ id: "dashboard.recentBooks" }),
    favorite: intl.formatMessage({ id: "dashboard.favoriteBooks" }),
    recommended: "Sách đề xuất",
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
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`
                rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800
                ${stat.color} ${stat.hover}
                transition-all duration-200 cursor-pointer
              `}
              onClick={() => router.push("/dashboard/stats")} // Ví dụ chuyển trang
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 opacity-80" />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

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
