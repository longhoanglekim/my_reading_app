'use client'

import { useParams, useRouter } from "next/navigation"

type Chapter = {
    id: string
    chapter_number: number
    title: string
}

type BookDetail = {
    id: string
    title: string
    author: string
    cover: string
    description: string
    chapters: Chapter[]
}

const MOCK_BOOKS: BookDetail[] = [
    {
        id: "123",
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d467e?w=800",
        description: "Một câu chuyện về hành trình theo đuổi ước mơ của chàng trai Santiago.",
        chapters: [
            { id: "ch-001", chapter_number: 1, title: "Giấc mơ" },
            { id: "ch-002", chapter_number: 2, title: "Hành trình bắt đầu" },
            { id: "ch-003", chapter_number: 3, title: "Người vua già" },
        ],
    },
    {
        id: "124",
        title: "Atomic Habits",
        author: "James Clear",
        cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
        description: "Cuốn sách nói về sức mạnh của thói quen nhỏ.",
        chapters: [
            { id: "ch-101", chapter_number: 1, title: "The surprising power of habits" },
            { id: "ch-102", chapter_number: 2, title: "Identity-based habits" },
            { id: "ch-103", chapter_number: 3, title: "Make it obvious" },
        ],
    },
]

export default function BookDetailPage() {
    const params = useParams()
    const bookId = params.id as string
    const router = useRouter()

    const book = MOCK_BOOKS.find((b) => b.id === bookId)

    if (!book) {
        return (
            <div className="max-w-6xl mx-auto p-10 text-center">
                <p className="text-lg text-gray-500">Không tìm thấy sách</p>
                <button
                    onClick={() => router.push("/books")}
                    className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    Quay lại danh sách
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            {/* BOOK HEADER */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <img
                    src={book.cover}
                    alt={book.title}
                    className="w-60 h-80 object-cover rounded-lg shadow-xl"
                />
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{book.title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                        {book.author}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {book.chapters.length} chương
                    </p>

                    <button
                        onClick={() => router.push(`/books/${bookId}/chapter/1`)}
                        disabled={book.chapters.length === 0}
                        className="w-fit px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Đọc từ đầu
                    </button>
                </div>
            </div>

            {/* OVERVIEW */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Giới thiệu</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {book.description}
                </p>
            </div>

            {/* CHAPTER LIST */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Danh sách chương</h2>
                <div className="border rounded-xl overflow-hidden divide-y dark:divide-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    {book.chapters
                        .sort((a, b) => a.chapter_number - b.chapter_number)
                        .map((chapter) => (
                            <div
                                key={chapter.id}
                                onClick={() => router.push(`/books/${bookId}/chapter/${chapter.chapter_number}`)}
                                className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition flex justify-between items-center"
                            >
                                <span className="font-medium">
                                    Chương {chapter.chapter_number}
                                    {chapter.title ? `: ${chapter.title}` : ""}
                                </span>
                                <span className="text-gray-400">→</span>
                            </div>
                        ))}

                    {book.chapters.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Chưa có chương nào
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}