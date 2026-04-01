'use client'

import { useState } from 'react'
import { useIntl } from "react-intl"

interface Chapter {
    id: number
    title: string
    files: File[]
}

interface MangaData {
    title: string
    author: string
    description: string
    genre: string[]
    cover: File | null
}

export default function UploadMangaChapters() {
    const intl = useIntl()

    const [manga, setManga] = useState<MangaData>({
        title: '',
        author: '',
        description: '',
        genre: [],
        cover: null,
    })

    const [chapters, setChapters] = useState<Chapter[]>([
        { id: Date.now(), title: '', files: [] }
    ])

    // ── Cập nhật manga info ──
    const updateManga = (field: keyof MangaData, value: string | string[] | File | null) => {
        setManga(prev => ({ ...prev, [field]: value }))
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            updateManga('cover', e.target.files[0])
        }
    }

    const toggleGenre = (genreName: string) => {
        setManga(prev => {
            const currentGenres = prev.genre || []
            if (currentGenres.includes(genreName)) {
                return { ...prev, genre: currentGenres.filter(g => g !== genreName) }
            } else {
                return { ...prev, genre: [...currentGenres, genreName] }
            }
        })
    }

    // ── Functions cho chapters ──
    const addNewChapter = () => {
        setChapters(prev => [...prev, { id: Date.now(), title: '', files: [] }])
    }

    const updateChapterTitle = (chapterId: number, title: string) => {
        setChapters(prev =>
            prev.map(ch => (ch.id === chapterId ? { ...ch, title } : ch))
        )
    }

    const addFilesToChapter = (chapterId: number, newFiles: File[]) => {
        setChapters(prev =>
            prev.map(ch =>
                ch.id === chapterId ? { ...ch, files: [...ch.files, ...newFiles] } : ch
            )
        )
    }

    const removeFileFromChapter = (chapterId: number, fileIndex: number) => {
        setChapters(prev =>
            prev.map(ch =>
                ch.id === chapterId
                    ? { ...ch, files: ch.files.filter((_, i) => i !== fileIndex) }
                    : ch
            )
        )
    }

    const removeChapter = (chapterId: number) => {
        if (chapters.length === 1) {
            alert(intl.formatMessage({ id: 'uploadPage.validation.minChapters' }))
            return
        }
        setChapters(prev => prev.filter(ch => ch.id !== chapterId))
    }

    const handlePublish = () => {
        if (!manga.title.trim()) {
            alert(intl.formatMessage({ id: 'uploadPage.validation.titleRequired' }))
            return
        }
        if (!manga.author.trim()) {
            alert(intl.formatMessage({ id: 'uploadPage.validation.authorRequired' }))
            return
        }
        if (!manga.description.trim()) {
            alert(intl.formatMessage({ id: 'uploadPage.validation.descriptionRequired' }))
            return
        }
        if (!manga.cover) {
            alert(intl.formatMessage({ id: 'uploadPage.validation.coverRequired' }))
            return
        }
        if (manga.genre.length === 0) {
            alert(intl.formatMessage({ id: 'uploadPage.validation.genreRequired' }))
            return
        }

        const invalidChapter = chapters.some(ch => !ch.title.trim() || ch.files.length === 0)
        if (invalidChapter) {
            alert(intl.formatMessage({ id: 'uploadPage.validation.chapterInvalid' }))
            return
        }

        console.log('Dữ liệu gửi đi:', { manga, chapters })
        // TODO: Tạo FormData và gọi API thực tế
    }

    const genrePrefix = 'uploadPage.genres.';
    const commonGenres = Object.keys(intl.messages)
        .filter(key => key.startsWith(genrePrefix))
        .sort((a, b) => {
            const aIndex = parseInt(a.split('.').pop() || '0');
            const bIndex = parseInt(b.split('.').pop() || '0');
            return aIndex - bIndex;
        })
        .map(key => intl.messages[key]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    {intl.formatMessage({ id: "uploadPage.title" })}
                </h1>

                {/* Thông tin truyện */}
                <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-6 mb-10 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6">
                        {intl.formatMessage({ id: "uploadPage.bookInfo.title" })}
                    </h2>

                    {/* Tiêu đề truyện */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            {intl.formatMessage({ id: "uploadPage.bookInfo.name" })} *
                        </label>
                        <input
                            value={manga.title}
                            onChange={e => updateManga('title', e.target.value)}
                            placeholder={intl.formatMessage({ id: "uploadPage.bookInfo.namePlaceholder" })}
                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Tác giả */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            {intl.formatMessage({ id: "uploadPage.bookInfo.author" })} *
                        </label>
                        <input
                            value={manga.author}
                            onChange={e => updateManga('author', e.target.value)}
                            placeholder={intl.formatMessage({ id: "uploadPage.bookInfo.authorPlaceholder" })}
                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            {intl.formatMessage({ id: "uploadPage.bookInfo.description" })}
                        </label>
                        <textarea
                            value={manga.description}
                            onChange={e => updateManga('description', e.target.value)}
                            placeholder={intl.formatMessage({ id: "uploadPage.bookInfo.descriptionPlaceholder" })}
                            rows={5}
                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Thể loại */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">
                            {intl.formatMessage({ id: "uploadPage.bookInfo.genre" })} *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {commonGenres.map(genre => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={() => toggleGenre(genre)}
                                    className={`px-4 py-2 rounded-full text-sm transition ${manga.genre.includes(genre)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ảnh bìa */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {intl.formatMessage({ id: "uploadPage.bookInfo.coverImage" })} *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {manga.cover && (
                                <div className="w-48 h-72 rounded-lg overflow-hidden border dark:border-gray-700 shadow">
                                    <img
                                        src={URL.createObjectURL(manga.cover)}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <label className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition min-w-[320px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                    <span className="text-blue-600 font-medium block mb-2">
                                        {intl.formatMessage({ id: "uploadPage.bookInfo.chooseCover" })}
                                    </span>
                                    <p className="text-sm text-gray-500">
                                        {intl.formatMessage({ id: "uploadPage.bookInfo.recommendedSize" })}
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Danh sách chương */}
                <h2 className="text-2xl font-semibold mb-6">
                    {intl.formatMessage({ id: "uploadPage.chapter.title" })}
                </h2>

                {chapters.map((chapter, chapterIndex) => (
                    <div
                        key={chapter.id}
                        className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-6 mb-8 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">
                                {intl.formatMessage({ id: "uploadPage.chapter.chapterNumber" })} {chapterIndex + 1}
                            </h3>
                            {chapters.length > 1 && (
                                <button
                                    onClick={() => removeChapter(chapter.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    {intl.formatMessage({ id: "uploadPage.chapter.removeChapter" })}
                                </button>
                            )}
                        </div>

                        <input
                            value={chapter.title}
                            onChange={e => updateChapterTitle(chapter.id, e.target.value)}
                            placeholder={intl.formatMessage({ id: "uploadPage.chapter.chapterTitlePlaceholder" })}
                            className="w-full p-3 mb-6 rounded-lg border dark:border-gray-700 bg-transparent outline-none focus:border-blue-500"
                        />

                        {/* Upload pages */}
                        <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-8 text-center mb-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files) {
                                            addFilesToChapter(chapter.id, Array.from(e.target.files))
                                        }
                                    }}
                                    className="hidden"
                                />
                                <span className="text-blue-600 font-medium">
                                    {intl.formatMessage({ id: "uploadPage.chapter.uploadPages" })}
                                </span>
                                <p className="mt-2 text-sm text-gray-500">
                                    {intl.formatMessage({ id: "uploadPage.chapter.uploadPagesDesc" })}
                                </p>
                            </label>
                        </div>

                        {/* Preview pages */}
                        {chapter.files.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-3">
                                    {intl.formatMessage({ id: "uploadPage.chapter.selectedPages" })} ({chapter.files.length})
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {chapter.files.map((file, idx) => (
                                        <div key={idx} className="relative group rounded-lg overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`page ${idx + 1}`}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button
                                                    onClick={() => removeFileFromChapter(chapter.id, idx)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded text-sm"
                                                >
                                                    {intl.formatMessage({ id: "uploadPage.delete" })}
                                                </button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                {intl.formatMessage({ id: "uploadPage.pageNumber" }, { number: idx + 1 })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Nút hành động */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between mt-10">
                    <button
                        onClick={addNewChapter}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                    >
                        {intl.formatMessage({ id: "uploadPage.chapter.addNewChapter" })}
                    </button>

                    <button
                        onClick={handlePublish}
                        className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                        {intl.formatMessage({ id: "uploadPage.action.publish" })}
                    </button>
                </div>
            </div>
        </div>
    )
}