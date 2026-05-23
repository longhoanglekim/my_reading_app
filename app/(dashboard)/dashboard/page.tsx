"use client";

import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import BookRating from "@/app/components/common/BookRating";
import { useGetBookOverviewGroupByGenreQuery } from "../books/queryHook/queryHook";

export default function Dashboard() {
  const router = useRouter();
  const intl = useIntl();

  const {
    data: comicDataByGenre,
    isLoading,
    isError,
  } = useGetBookOverviewGroupByGenreQuery();

  if (isLoading) {
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

  return (
    <div className="max-w-7xl mx-auto px-0 py-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {intl.formatMessage({ id: "books.exploreByGenre" })}
        </h1>
      </div>

      <div className="space-y-12">
        {comicDataByGenre?.content.map((genreItem) => (
          <div key={genreItem.genre}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{genreItem.genre}</h2>
              <button
                onClick={() =>
                  router.push(
                    `/library?type=genre&genre=${encodeURIComponent(genreItem.genre)}`,
                  )
                }
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                {intl.formatMessage({ id: "common.seeAll" })} →
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
    </div>
  );
}
