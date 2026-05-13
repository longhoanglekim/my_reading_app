
export type Book = {
    id: string
    title: string
    author: string
    cover: string
    description: string
}

export type BookChapter = {
    id: string
    book_id: string
    chapterNumber: number
    title: string
    total_pages: number
    hasNextChapter: boolean
}

export type BubbleChunk = {
    chunk_id: string
    meaning: string
    romaji: string
    type: string
    word: string
}

export type Bubble = {
    id: number
    box: [number, number, number, number]
    chunks: BubbleChunk[]
    full_translation: string
    original_text: string
}

export type ChapterPage = {
    page_id: string
    chapter_id: string
    page_number: number
    image_url: string
    original_lang: 'ja' | 'ko' | 'zh' | 'en' | 'vi' // Follows ISO 639-1 2-character language codes
    bubbles: Bubble[]
}
export type ChapterOverview = {
    id: string
    chapterNumber: number
    title: string;
}
export type SelectionTranslation = {
    text: string
    translation: string
    chunks: BubbleChunk[]
}

export type ChapterComment = {
    id: number
    userId: number
    fullName: string
    avatarUrl: string
    content: string
    parentId: number | null
    createdAt: string
    replies: string[]
}

export type CommentsResponse = {
    data: {
        content: ChapterComment[]
        pageNo: number
        pageSize: number
        totalElements: number
        totalPages: number
        last: boolean
    }
}
