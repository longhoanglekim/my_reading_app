"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useIntl } from "react-intl";
import BookRating from "@/app/components/common/BookRating";
import { useUserLibraryByType } from "../dashboard/queryHooks";

const PAGE_SIZE_DEFAULT = 8;

export default function BooksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const intl = useIntl();

  const [page, setPage] = useState(1);

  const type = searchParams.get("type") || "recent";
  let listType = "";
  if (type == "recent") {
    listType = "READING";
  } else if (type == "favorite") {
    listType = "FAVORITE";
  } else {
    listType = "READ_LATER";
  }
  const searchQuery = searchParams.get("query") || "";
  const {
    data: userLibraryData,
    isLoading: userLibraryLoading,
    isError: userLibraryError,
  } = useUserLibraryByType({
    page: page - 1,
    size: PAGE_SIZE_DEFAULT,
    listType,
  });
  const fetchData = userLibraryData;
  let totalPage = null;
  if (fetchData) {
    totalPage = fetchData.totalPages;
  }

  // 5. Logic phân trang dựa trên dữ liệu đã lọc

  const titleMap: Record<string, string> = {
    recent: intl.formatMessage({ id: "dashboard.recentBooks" }),
    favorite: intl.formatMessage({ id: "dashboard.favoriteBooks" }),
    recommended: "Sách đề xuất",
    query: searchQuery
      ? `Kết quả tìm kiếm cho "${searchQuery}"`
      : "Tìm kiếm sách",
  };

  // 6. Xử lý trạng thái Loading từ Server
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
  return (
    <div className="max-w-7xl mx-auto px-0 py-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {titleMap[type] || "Danh sách sách"}
        </h1>
      </div>

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
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
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
    </div>
  );
}
