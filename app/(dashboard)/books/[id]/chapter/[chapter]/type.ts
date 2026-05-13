
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
    chapter_number: number
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

export type SelectionTranslation = {
    text: string
    translation: string
    chunks: BubbleChunk[]
}
