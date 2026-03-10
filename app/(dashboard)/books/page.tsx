'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type BookOverview = {
    title: string
    author: string
    cover: string
}

const PAGE_SIZE = 8

const ALL_BOOKS: BookOverview[] = [
    { title: 'Nhà Giả Kim', author: 'Paulo Coelho', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d467e?w=800' },
    { title: 'Atomic Habits', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800' },
    { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800' },
    { title: 'Deep Work', author: 'Cal Newport', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800' },
    { title: 'Clean Code', author: 'Robert C. Martin', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800' },
    { title: 'Thinking Fast and Slow', author: 'Daniel Kahneman', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800' },
    { title: 'Zero to One', author: 'Peter Thiel', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800' },
    { title: 'Start With Why', author: 'Simon Sinek', cover: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800' },
    { title: 'Hooked', author: 'Nir Eyal', cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800' },
    { title: 'The Lean Startup', author: 'Eric Ries', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800' },
    { title: 'The Power of Habit', author: 'Charles Duhigg', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800' },
    { title: 'Educated', author: 'Tara Westover', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800' },
]

export default function BooksPage() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type') || 'recent'
    const searchQuery = searchParams.get('query') || ''

    const [books, setBooks] = useState<BookOverview[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)

    const titleMap: Record<string, string> = {
        recent: 'Sách đọc gần đây',
        favorite: 'Sách yêu thích',
        recommended: 'Sách đề xuất',
        query: searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Tìm kiếm sách',
    }

    const fetchBooks = () => {
        setIsLoading(true)
        let data: BookOverview[] = []

        if (type === 'recent') {
            data = ALL_BOOKS.slice(0, 10)
        } else if (type === 'favorite') {
            data = ALL_BOOKS.filter(b =>
                ['Đắc Nhân Tâm', 'Atomic Habits', 'Clean Code', 'Deep Work', 'Zero to One'].includes(b.title)
            )
        } else if (type === 'recommended') {
            data = ALL_BOOKS.filter(b =>
                ['The Lean Startup', 'Hooked', 'Start With Why', 'Thinking Fast and Slow'].includes(b.title)
            )
        } else if (type === 'query') {
            if (!searchQuery.trim()) {
                data = []
            } else {
                const lowerQuery = searchQuery.toLowerCase()
                data = ALL_BOOKS.filter(
                    book =>
                        book.title.toLowerCase().includes(lowerQuery) ||
                        book.author.toLowerCase().includes(lowerQuery)
                )
            }
        }

        setBooks(data)
        setPage(1)
        setTimeout(() => setIsLoading(false), 300)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBooks()
    }, [type, searchQuery])

    const totalPages = Math.ceil(books.length / PAGE_SIZE)
    const paginatedBooks = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <div className="max-w-7xl mx-auto px-0 py-8 w-full">
            {/* Header - luôn hiển thị */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">
                    {titleMap[type] || 'Danh sách sách'}
                </h1>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse">
                            <div className="aspect-[1] bg-gray-200 dark:bg-gray-700" />
                            <div className="p-4">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                    {type === 'query'
                        ? searchQuery.trim()
                            ? `Không tìm thấy sách nào khớp với "${searchQuery}"`
                            : 'Vui lòng nhập từ khóa tìm kiếm trong thanh tìm kiếm.'
                        : 'Hiện chưa có sách nào trong danh mục này.'}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedBooks.map((book) => (
                            <div
                                key={`${book.title}-${book.author}`}
                                className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="aspect-[1] relative">
                                    <img
                                        src={book.cover}
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

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10 gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }).map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setPage(pageNumber)}
                                        className={`px-4 py-2 rounded-lg border transition ${page === pageNumber
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            })}

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}