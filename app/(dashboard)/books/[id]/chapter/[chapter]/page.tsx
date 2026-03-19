/* eslint-disable @next/next/no-img-element */
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'

// ──────────────────────────────────────────────
// TYPES (giữ nguyên)
type Book = {
    id: string
    title: string
    author: string
    cover: string
    description: string
}

type BookChapter = {
    id: string
    book_id: string
    chapter_number: number
    title: string
    total_pages: number
}

type ChapterImage = {
    id: string
    chapter_id: string
    page_number: number
    image_url: string
}

// ──────────────────────────────────────────────
// MOCK DATA (đầy đủ như code gốc của bạn, không thiếu)
const MOCK_BOOKS: Book[] = [
    {
        id: "123",
        title: "Nhà Giả Kim (Manga)",
        author: "Paulo Coelho & Studio",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d467e?w=800",
        description: "Hành trình theo đuổi giấc mơ qua phiên bản manga.",
    },
    {
        id: "124",
        title: "Thanh Gươm Diệt Quỷ",
        author: "Koyoharu Gotouge",
        cover: "https://images.unsplash.com/photo-1612036782180-6f0b51ae1e9d?w=800",
        description: "Tanjiro và cuộc chiến chống quỷ dữ.",
    },
]

const MOCK_CHAPTERS: BookChapter[] = [
    { id: "ch-nha-001", book_id: "123", chapter_number: 1, title: "Giấc Mơ Lặp Lại", total_pages: 24 },
    { id: "ch-nha-002", book_id: "123", chapter_number: 2, title: "Gặp Người Vua Già", total_pages: 28 },
    { id: "ch-nha-003", book_id: "123", chapter_number: 3, title: "Người Buôn Thú", total_pages: 32 },
    { id: "ch-kny-001", book_id: "124", chapter_number: 1, title: "Lạnh Buốt", total_pages: 44 },
    { id: "ch-kny-002", book_id: "124", chapter_number: 2, title: "Người Đàn Ông Mang Gươm", total_pages: 38 },
]

const MOCK_CHAPTER_IMAGES: ChapterImage[] = [
    // Chương 1 - Nhà Giả Kim
    { id: "img-n1-1", chapter_id: "ch-nha-001", page_number: 1, image_url: "https://picsum.photos/800/1200?random=101" },
    { id: "img-n1-2", chapter_id: "ch-nha-001", page_number: 2, image_url: "https://picsum.photos/800/1200?random=102" },
    { id: "img-n1-3", chapter_id: "ch-nha-001", page_number: 3, image_url: "https://picsum.photos/800/1200?random=103" },
    { id: "img-n1-4", chapter_id: "ch-nha-001", page_number: 4, image_url: "https://picsum.photos/800/1200?random=104" },
    { id: "img-n1-5", chapter_id: "ch-nha-001", page_number: 5, image_url: "https://picsum.photos/800/1200?random=105" },
    { id: "img-n1-6", chapter_id: "ch-nha-001", page_number: 6, image_url: "https://picsum.photos/800/1200?random=106" },
    { id: "img-n1-7", chapter_id: "ch-nha-001", page_number: 7, image_url: "https://picsum.photos/800/1200?random=107" },
    { id: "img-n1-24", chapter_id: "ch-nha-001", page_number: 24, image_url: "https://picsum.photos/800/1200?random=124" },

    // Chương 2 - Nhà Giả Kim
    { id: "img-n2-1", chapter_id: "ch-nha-002", page_number: 1, image_url: "https://picsum.photos/800/1200?random=201" },
    { id: "img-n2-2", chapter_id: "ch-nha-002", page_number: 2, image_url: "https://picsum.photos/800/1200?random=202" },
    { id: "img-n2-3", chapter_id: "ch-nha-002", page_number: 3, image_url: "https://picsum.photos/800/1200?random=203" },
    { id: "img-n2-4", chapter_id: "ch-nha-002", page_number: 4, image_url: "https://picsum.photos/800/1200?random=204" },
    { id: "img-n2-28", chapter_id: "ch-nha-002", page_number: 28, image_url: "https://picsum.photos/800/1200?random=228" },

    // Chương 1 - Thanh Gươm Diệt Quỷ
    { id: "img-k1-1", chapter_id: "ch-kny-001", page_number: 1, image_url: "https://picsum.photos/800/1200?random=301" },
    { id: "img-k1-2", chapter_id: "ch-kny-001", page_number: 2, image_url: "https://picsum.photos/800/1200?random=302" },
    { id: "img-k1-3", chapter_id: "ch-kny-001", page_number: 3, image_url: "https://picsum.photos/800/1200?random=303" },
    { id: "img-k1-44", chapter_id: "ch-kny-001", page_number: 44, image_url: "https://picsum.photos/800/1200?random=344" },
]

// ──────────────────────────────────────────────
// COMPONENT (đã sửa height ảnh + không ép căn giữa ngang)
export default function ChapterPage() {
    const params = useParams()
    const router = useRouter()
    const bookId = params.id as string
    const chapterNumber = parseInt(params.chapter as string, 10)
    const intl = useIntl();
    const [currentPage, setCurrentPage] = useState(1)

    const book = MOCK_BOOKS.find((b) => b.id === bookId)
    if (!book) return <div className="p-10 text-center text-red-500">Không tìm thấy truyện</div>

    const chapter = MOCK_CHAPTERS.find(
        (ch) => ch.book_id === bookId && ch.chapter_number === chapterNumber
    )
    if (!chapter) return <div className="p-10 text-center text-red-500">Chương {chapterNumber} không tồn tại</div>

    const pages = MOCK_CHAPTER_IMAGES
        .filter((img) => img.chapter_id === chapter.id)
        .sort((a, b) => a.page_number - b.page_number)

    const totalPages = pages.length || chapter.total_pages
    const currentImage = pages.find((p) => p.page_number === currentPage)?.image_url

    const prevChapterNum = chapter.chapter_number - 1
    const nextChapterNum = chapter.chapter_number + 1

    const hasPrevChapter = MOCK_CHAPTERS.some(
        (ch) => ch.book_id === bookId && ch.chapter_number === prevChapterNum
    )
    const hasNextChapter = MOCK_CHAPTERS.some(
        (ch) => ch.book_id === bookId && ch.chapter_number === nextChapterNum
    )

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
        else if (hasPrevChapter) router.push(`/books/${bookId}/chapter/${prevChapterNum}`)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
        else if (hasNextChapter) router.push(`/books/${bookId}/chapter/${nextChapterNum}`)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setCurrentPage(1)
    }, [chapterNumber])

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col justify-center py-8 px-4">
                {/* Header */}
                <div className="w-full max-w-4xl flex items-center justify-between  mx-auto">
                    <button
                        onClick={() => router.push("/books/" + bookId)}
                        className="flex items-center gap-2 px-4 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                    >
                        {intl.formatMessage({ id: "dashboard.book.info" })}
                    </button>

                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            {book.title} -   {intl.formatMessage({ id: "common.chapterCapital" })} {chapter.chapter_number}
                        </h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                            {chapter.title} • {intl.formatMessage({ id: "common.pageCapital" })} {currentPage} / {totalPages}
                        </p>
                    </div>

                    <div className="w-32 hidden md:block" />
                </div>
                {currentImage ? (
                    <div className="w-2/3 max-w-[90vw] md:max-w-[80vw] lg:max-w-3xl mx-auto">
                        <div className=" rounded-xl overflow-hidden mx-auto ">
                            <img
                                src={currentImage}
                                alt={`Trang ${currentPage} - ${chapter.title}`}
                                className="w-full h-auto max-h-[80vh] sm:max-h-[90vh] md:max-h-[90vh] lg:max-h-[90vh] object-contain p-4 md:p-6 lg:p-8 block"
                                loading={currentPage <= 3 ? "eager" : "lazy"}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-40 text-gray-500 animate-pulse text-xl">
                        Đang tải trang {currentPage}...
                    </div>
                )}
            </div>
            <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t dark:border-gray-700 z-50 shadow-md">
                <div className="max-w-5xl mx-auto px-3 py-2 md:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">

                    {/* Nút Trước */}
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 && !hasPrevChapter}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1.5 font-medium text-sm sm:text-base shadow-sm"
                    >
                        {intl.formatMessage({ id: "common.prev" })}
                    </button>

                    {/* Trang hiện tại - nhỏ hơn, gọn hơn */}
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 order-2 sm:order-none">
                        {currentPage} / {totalPages}
                    </div>

                    {/* Nút Tiếp */}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages && !hasNextChapter}
                        className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1.5 font-medium text-sm sm:text-base shadow-sm"
                    >
                        {intl.formatMessage({ id: "common.next" })}
                    </button>
                </div>
            </footer>
        </div>
    )
}