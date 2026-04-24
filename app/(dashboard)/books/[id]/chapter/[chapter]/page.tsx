/* eslint-disable @next/next/no-img-element */
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'

/* =========================
   TYPES
========================= */

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
    hasNextChapter: boolean
}

type BubbleChunk = {
    meaning: string
    romaji: string
    type: string
    word: string
}

type Bubble = {
    id: number
    box: [number, number, number, number]
    chunks: BubbleChunk[]
    full_translation: string
    original_text: string
}

type ChapterPage = {
    page_id: string
    chapter_id: string
    page_number: number
    image_url: string
    original_lang: 'jp' | 'en' | 'vi'
    bubbles: Bubble[]
}

type SelectionTranslation = {
    text: string
    translation: string
    chunks: BubbleChunk[]
}

/* =========================
   MOCK DATA
========================= */

const MOCK_BOOKS: Book[] = [
    {
        id: "123",
        title: "Nhà Giả Kim (Manga)",
        author: "Paulo Coelho & Studio",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d467e?w=800",
        description: "Hành trình theo đuổi giấc mơ qua phiên bản manga.",
    }
]

const MOCK_CHAPTERS: BookChapter[] = [
    {
        id: "ch-nha-001",
        book_id: "123",
        chapter_number: 1,
        title: "Giấc Mơ Lặp Lại",
        total_pages: 3,
        hasNextChapter: true
    },
    {
        id: "ch-nha-002",
        book_id: "123",
        chapter_number: 2,
        title: "Gặp Người Vua Già",
        total_pages: 2,
        hasNextChapter: false
    }
]

const MOCK_CHAPTER_PAGES: ChapterPage[] = [
    {
        page_id: "page-001",
        chapter_id: "ch-nha-001",
        page_number: 1,
        image_url: "/cleaned_image.jpg",
        original_lang: "jp",
        bubbles: [
            {
                id: 1,
                box: [318, 69, 140, 218],
                chunks: [
                    { meaning: "À thì/Này", romaji: "e-", type: "interjection", word: "えー" },
                    { meaning: "Mọi người", romaji: "minna", type: "noun", word: "みにゃ" },
                    { meaning: "：", romaji: ":", type: "punctuation", word: "：" },
                    { meaning: "Mọi người", romaji: "mina", type: "noun", word: "皆" },
                    { meaning: "cũng", romaji: "mo", type: "particle", word: "も" },
                    { meaning: "đang nghe", romaji: "kiiteiru", type: "verb", word: "聞いている" },
                    { meaning: "như đã...", romaji: "toori", type: "noun", word: "通り" }
                ],
                full_translation: "À này mọi người, như các em đã nghe đấy...",
                original_text: "えーみにゃ：皆も聞いている通り"
            },
            {
                id: 2,
                box: [818, 431, 136, 208],
                chunks: [
                    { meaning: "Trường nữ sinh Fuurin này", romaji: "kono fuurin joshikou wa", type: "noun phrase", word: "この楓林女子高は" },
                    { meaning: "do việc sáp nhập trường học", romaji: "gakuen heigou ni tomonai", type: "phrase", word: "学園併合に伴い" }
                ],
                full_translation: "Do việc sáp nhập trường học, ngôi trường nữ sinh Fuurin này...",
                original_text: "この楓林女子高は学園併合に伴い"
            },
            {
                id: 3,
                box: [159, 460, 168, 187],
                chunks: [
                    { meaning: "Từ năm học này", romaji: "hon-nendo kara", type: "noun phrase", word: "本年度から" },
                    { meaning: "sáp nhập với trường trung học nam Furin", romaji: "fuurin danshikou to gappei shi", type: "verb phrase", word: "楓林男子高と合併し" },
                    { meaning: "trở thành trường đồng giáo", romaji: "kyougaku to naru", type: "verb phrase", word: "共学となる" }
                ],
                full_translation: "Từ năm học này, trường chúng ta sẽ sáp nhập với trường nam sinh Furin và chính thức trở thành trường đồng giáo.",
                original_text: "本年度から楓林男子高と合併し共学となる"
            },
            {
                id: 4,
                box: [813, 792, 178, 220],
                chunks: [
                    { meaning: "đột ngột", romaji: "kyuu ni", type: "adverb", word: "急に" },
                    { meaning: "con trai", romaji: "danshi", type: "noun", word: "男子" },
                    { meaning: "đã vào", romaji: "ga haitte kite", type: "verb phrase", word: "が入ってきて" },
                    { meaning: "chắc là sẽ bối rối", romaji: "tomadou darou ga", type: "verb phrase", word: "戸惑うだろうが" },
                    { meaning: "hãy hòa thuận với nhau nhé", romaji: "nakayoku shite kure", type: "verb phrase", word: "仲良くしてくれ" }
                ],
                full_translation: "Đột nhiên có nam sinh nhập học, chắc các em cũng thấy bối rối, nhưng hãy hòa thuận với nhau nhé!",
                original_text: "急に男子が入ってきて戸惑うだろうが仲良くしてくれ"
            },
            {
                id: 5,
                box: [341, 1174, 196, 212],
                chunks: [
                    { meaning: "Vậy thì", romaji: "jaa", type: "conjunction", word: "じゃあ" },
                    { meaning: "vì là học kỳ mới", romaji: "shingakki dashi", type: "phrase", word: "新学期だし" },
                    { meaning: "từ việc giới thiệu bản thân", romaji: "jikoshoukai kara", type: "phrase", word: "自己紹介から" },
                    { meaning: "làm nhé", romaji: "suru ka", type: "verb", word: "するか！" }
                ],
                full_translation: "Được rồi, nhân dịp đầu học kỳ mới, chúng ta bắt đầu bằng màn giới thiệu bản thân nhé!",
                original_text: "じゃあ新学期だし自己紹介からするか！"
            },
            {
                id: 6,
                box: [134, 805, 109, 189],
                chunks: [
                    { meaning: "Trước hết", romaji: "mazu wa", type: "adverb/particle", word: "まずは" },
                    { meaning: "từ phía bên trái", romaji: "hidari no danshi kara", type: "noun phrase", word: "左の男子から" },
                    { meaning: "...", romaji: "...", type: "punctuation", word: "．．．" }
                ],
                full_translation: "Đầu tiên, bắt đầu từ bạn nam bên trái nhé...",
                original_text: "まずは左の男子から．．．"
            },
            {
                id: 7,
                box: [63, 1235, 141, 276],
                chunks: [
                    { meaning: "Thầy/Cô giáo", romaji: "sensei", type: "noun", word: "先生" },
                    { meaning: "!!", romaji: "!!", type: "punctuation", word: "！！" }
                ],
                full_translation: "Thưa thầy!!",
                original_text: "先生！！"
            }
        ]
    },
    {
        page_id: "page-002",
        chapter_id: "ch-nha-001",
        page_number: 2,
        image_url: "https://picsum.photos/id/1015/800/1200",
        original_lang: "jp",
        bubbles: []
    },
    {
        page_id: "page-003",
        chapter_id: "ch-nha-001",
        page_number: 3,
        original_lang: "jp",
        image_url: "https://picsum.photos/id/1016/800/1200",
        bubbles: []
    },
    {
        page_id: "page-004",
        chapter_id: "ch-nha-002",
        page_number: 1,
        original_lang: "jp",
        image_url: "https://picsum.photos/id/201/800/1200",
        bubbles: []
    },
    {
        page_id: "page-005",
        chapter_id: "ch-nha-002",
        page_number: 2,
        image_url: "https://picsum.photos/id/202/800/1200",
        original_lang: "jp",
        bubbles: []
    }
]

/* =========================
   COMPONENT
========================= */

export default function ChapterPage() {
    const params = useParams()
    const router = useRouter()

    const bookId = params.id as string
    const chapterNumber = parseInt(params.chapter as string, 10)

    const [currentPage, setCurrentPage] = useState(1)
    const [selectedBubble, setSelectedBubble] = useState<Bubble | null>(null)
    const [hoveredWord, setHoveredWord] = useState<{ bubbleId: number, chunkIndex: number } | null>(null)
    const [activeWord, setActiveWord] = useState<{ bubbleId: number, chunkIndex: number } | null>(null)
    const [textSelection, setTextSelection] = useState<SelectionTranslation | null>(null)
    const [imageScale, setImageScale] = useState(1)

    const imageRef = useRef<HTMLImageElement>(null)
    const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const book = useMemo(
        () => MOCK_BOOKS.find((b) => b.id === bookId),
        [bookId]
    )

    const chapter = useMemo(
        () => MOCK_CHAPTERS.find(
            (ch) => ch.book_id === bookId && ch.chapter_number === chapterNumber
        ),
        [bookId, chapterNumber]
    )

    const pages = useMemo(
        () => MOCK_CHAPTER_PAGES
            .filter((page) => page.chapter_id === chapter?.id)
            .sort((a, b) => a.page_number - b.page_number),
        [chapter?.id]
    )

    const totalPages = pages.length
    const currentPageData = useMemo(
        () => pages.find((p) => p.page_number === currentPage),
        [pages, currentPage]
    )
    const isJapanese = currentPageData?.original_lang === 'jp'


    const currentImage = currentPageData?.image_url
    const currentBubbles = useMemo(() => currentPageData?.bubbles || [], [currentPageData])
    const sortedBubbles = useMemo(() => {
        if (!isJapanese) return currentBubbles

        return [...currentBubbles].sort((a, b) => {
            const [ax, ay] = a.box
            const [bx, by] = b.box

            // phải → trái
            if (Math.abs(ax - bx) > 50) {
                return bx - ax
            }

            // trên → dưới
            return ay - by
        })
    }, [currentBubbles, isJapanese])
    const updateImageScale = useCallback(() => {
        const img = imageRef.current
        if (!img) return

        const displayedWidth = img.getBoundingClientRect().width
        const naturalWidth = img.naturalWidth || 800
        setImageScale(displayedWidth / naturalWidth)
    }, [])

    useEffect(() => {
        updateImageScale()
        window.addEventListener('resize', updateImageScale)
        return () => window.removeEventListener('resize', updateImageScale)
    }, [currentImage, updateImageScale])

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node | null
            const element = target
                ? target.nodeType === Node.ELEMENT_NODE
                    ? (target as Element)
                    : target.nodeType === Node.TEXT_NODE
                        ? target.parentElement
                        : null
                : null

            if (!element?.closest('[data-chunk-word]')) {
                setActiveWord(null)
            }
        }

        document.addEventListener('click', handleDocumentClick)
        return () => document.removeEventListener('click', handleDocumentClick)
    }, [])

    // Xử lý bôi đen text
    useEffect(() => {
        const handleTextSelection = () => {
            if (selectionTimeoutRef.current) clearTimeout(selectionTimeoutRef.current)

            selectionTimeoutRef.current = setTimeout(() => {
                const selection = window.getSelection()
                if (!selection || selection.isCollapsed) {
                    setTextSelection(null)
                    return
                }

                const selectedText = selection.toString().trim()
                if (!selectedText) return

                let bestBubble: Bubble | null = null
                let bestChunks: BubbleChunk[] = []

                for (const bubble of currentBubbles) {
                    const matched = bubble.chunks.filter(chunk =>
                        selectedText.includes(chunk.word) || chunk.word.includes(selectedText)
                    )
                    if (matched.length > bestChunks.length) {
                        bestBubble = bubble
                        bestChunks = matched
                    }
                }

                if (bestBubble) {
                    const translation = bestChunks.length > 0
                        ? bestChunks.map(c => `${c.word} (${c.romaji}): ${c.meaning}`).join("\n")
                        : bestBubble.full_translation

                    setTextSelection({
                        text: selectedText,
                        translation,
                        chunks: bestChunks.length > 0 ? bestChunks : bestBubble.chunks
                    })
                }
            }, 300)
        }

        document.addEventListener('mouseup', handleTextSelection)
        return () => document.removeEventListener('mouseup', handleTextSelection)
    }, [currentBubbles])

    const getBubbleStyle = (bubble: Bubble) => {
        const [x, y, w, h] = bubble.box

        return {
            left: `${Math.round(x * imageScale)}px`,
            top: `${Math.round(y * imageScale)}px`,
            width: `${Math.round(w * imageScale)}px`,
            height: `${Math.round(h * imageScale)}px`,
        }
    }

    // Hover vào chữ → hiện tooltip
    const handleChunkHover = (bubbleId: number, chunkIndex: number) => {
        setHoveredWord({ bubbleId, chunkIndex })
    }

    const handleChunkLeave = () => {
        setHoveredWord(null)
    }

    // Click vào chữ → hiện panel dịch phía dưới
    const handleWordClick = (
        bubbleId: number,
        chunkIndex: number,
        chunk: BubbleChunk,
        e: React.MouseEvent
    ) => {
        e.stopPropagation()
        window.getSelection()?.removeAllRanges()
        setHoveredWord({ bubbleId, chunkIndex })
        setActiveWord({ bubbleId, chunkIndex })

        setTextSelection({
            text: chunk.word,
            translation: `${chunk.word} (${chunk.romaji}): ${chunk.meaning}`,
            chunks: [chunk]
        })
    }

    // Click cả bubble → mở popup chi tiết
    const handleBubbleClick = (bubble: Bubble) => {
        setActiveWord(null)
        setSelectedBubble(bubble)
    }

    const prevChapterNum = chapter?.chapter_number ? chapter.chapter_number - 1 : 0
    const nextChapterNum = chapter?.chapter_number ? chapter.chapter_number + 1 : 0

    const hasPrevChapter = MOCK_CHAPTERS.some(ch => ch.book_id === bookId && ch.chapter_number === prevChapterNum)
    const hasNextChapter = chapter?.hasNextChapter || false

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1)
        else if (hasPrevChapter) router.push(`/books/${bookId}/chapter/${prevChapterNum}`)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
        else if (hasNextChapter) router.push(`/books/${bookId}/chapter/${nextChapterNum}`)
    }

    return (
        <div key={chapterNumber} className="min-h-screen flex flex-col bg-gray-50">
            {/* HEADER */}
            <div className="w-full max-w-5xl mx-auto px-4 py-6">
                <div className="relative flex items-center">
                    <button
                        onClick={() => router.push(`/books/${bookId}`)}
                        className="px-5 py-2 border rounded-lg hover:bg-gray-100 z-10"
                    >
                        ← Thông tin truyện
                    </button>

                    <div className="absolute left-1/2 -translate-x-1/2 text-center">
                        <h1 className="text-2xl font-bold">{book?.title}</h1>
                        <p className="text-gray-600">
                            {chapter?.title} • Trang {currentPage}/{totalPages}
                        </p>
                    </div>
                </div>
            </div>

            {/* IMAGE + BUBBLES */}
            <div className="flex-1 flex justify-center px-4 pb-24">
                <div className="relative w-full max-w-200 mx-auto">
                    {currentImage ? (
                        <div className="relative">
                            <img
                                ref={imageRef}
                                src={currentImage}
                                alt={`Trang ${currentPage}`}
                                className="w-full h-auto rounded-xl shadow-2xl block"
                                onLoad={updateImageScale}
                            />

                            {sortedBubbles.map((bubble) => (
                                <div
                                    key={bubble.id}
                                    className="absolute flex items-center justify-center text-center p-3 transition-all duration-200 cursor-pointer rounded gap-1 border border-transparent hover:border-yellow-300 hover:bg-white/70"
                                    style={getBubbleStyle(bubble)}
                                    onClick={() => handleBubbleClick(bubble)}
                                >
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {bubble.chunks.map((chunk, idx) => {
                                            const isActive =
                                                (hoveredWord?.bubbleId === bubble.id && hoveredWord?.chunkIndex === idx) ||
                                                (activeWord?.bubbleId === bubble.id && activeWord?.chunkIndex === idx)

                                            return (
                                                <span
                                                    key={idx}
                                                    data-chunk-word
                                                    className="relative hover:bg-yellow-200 hover:text-black px-2 py-1 rounded cursor-pointer transition-colors text-sm select-none"
                                                    onMouseEnter={() => handleChunkHover(bubble.id, idx)}
                                                    onMouseLeave={handleChunkLeave}
                                                    onClick={(e) => handleWordClick(bubble.id, idx, chunk, e)}
                                                >
                                                    {chunk.word}

                                                    {/* Tooltip Hover */}
                                                    {isActive && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white text-black p-3 rounded-xl shadow-2xl z-50 pointer-events-none border">

                                                            {/* WORD */}
                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                <span className="font-bold text-lg">{chunk.word}</span>
                                                                <span className="text-xs text-gray-500">{chunk.romaji}</span>
                                                            </div>

                                                            {/* MEANING */}
                                                            <p className="text-sm text-gray-700 mb-2">
                                                                {chunk.meaning}
                                                            </p>

                                                            {/* TYPE */}
                                                            <p className="text-[11px] text-gray-400">
                                                                Loại: {chunk.type}
                                                            </p>

                                                        </div>
                                                    )}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">Đang tải trang...</div>
                    )}
                </div>
            </div>



            {/* FOOTER */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 && !hasPrevChapter}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg font-medium"
                    >
                        ← Trang trước
                    </button>

                    <span className="font-medium text-lg">{currentPage} / {totalPages}</span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages && !hasNextChapter}
                        className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium"
                    >
                        Trang sau →
                    </button>
                </div>
            </footer>

            {/* POPUP CHI TIẾT */}
            {selectedBubble && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Chi tiết hội thoại</h3>
                            <button
                                onClick={() => setSelectedBubble(null)}
                                className="text-3xl text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6 overflow-auto max-h-[65vh]">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">原文 (Original)</p>
                                <p className="font-mono bg-gray-100 p-4 rounded-xl text-lg break-all">
                                    {selectedBubble.original_text}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Dịch tiếng Việt</p>
                                <p className="text-lg leading-relaxed bg-blue-50 p-4 rounded-xl">
                                    {selectedBubble.full_translation}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-3">Phân tích từ vựng</p>
                                <div className="space-y-5">
                                    {selectedBubble.chunks.map((chunk, idx) => (
                                        <div key={idx} className="border-l-4 border-blue-500 pl-4">
                                            <div className="flex items-baseline gap-3">
                                                <span className="font-bold text-xl">{chunk.word}</span>
                                                <span className="font-mono text-gray-500">{chunk.romaji}</span>
                                            </div>
                                            <p className="text-gray-700 mt-1">{chunk.meaning}</p>
                                            <p className="text-xs text-gray-400">Loại: {chunk.type}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t text-center">
                            <button
                                onClick={() => setSelectedBubble(null)}
                                className="px-10 py-3 bg-gray-800 text-white rounded-xl hover:bg-black"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}