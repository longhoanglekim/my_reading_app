/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  FormEvent,
} from "react";
import { useIntl } from "react-intl";
import { useQueries } from "@tanstack/react-query";
import { getPageDetail } from "./service/service";
import { Book, Bubble, BubbleChunk, SelectionTranslation, ChapterComment, ChapterPage, PageDetailResponse } from "./type";

import {
  useChapterComments,
  useChapterOverview,
  usePostChapterComment,
  useChapterPages,
  useComicDetail,
  useSyncReadingHistoryMutation,
} from "./queryHook/queryHook";

export default function ComicChapterPage() {
  const params = useParams();
  const router = useRouter();
  const intl = useIntl();

  const routeBookId = Array.isArray(params.id) ? params.id[0] : params.id;
  const routeChapterParam = Array.isArray(params.chapter)
    ? params.chapter[0]
    : params.chapter;

  const bookId = routeBookId ?? "";
  const chapterNumber = routeChapterParam
    ? parseInt(routeChapterParam, 10)
    : NaN;

  // ==================== API CALLS ====================

  const {
    data: comicDetailData,
    isLoading: comicDetailLoading,
    isError: comicDetailError,
  } = useComicDetail(bookId ? parseInt(bookId) : undefined);

  const { data: chapterOverviewData, isLoading: chapterOverviewLoading } =
    useChapterOverview(bookId, chapterNumber);

  const chapterId = chapterOverviewData?.id;

  const { data: chapterPagesResponse, isLoading: pagesLoading } =
    useChapterPages(chapterId ? parseInt(chapterId) : undefined);

  const [currentPage, setCurrentPage] = useState(1);

  // ------------ LẤY DANH SÁCH PAGES ====================
  const pages = useMemo(() => {
    // Xử lý cả 2 trường hợp: API trả array trực tiếp hoặc {data: [...]}
    if (!chapterPagesResponse) return [];

    if (Array.isArray(chapterPagesResponse)) {
      return [...chapterPagesResponse].sort(
        (a, b) => a.pageNumber - b.pageNumber,
      );
    }

    const responseAsObj = chapterPagesResponse as { data?: ChapterPage[] };
    if (responseAsObj.data && Array.isArray(responseAsObj.data)) {
      return [...responseAsObj.data].sort(
        (a, b) => a.pageNumber - b.pageNumber,
      );
    }

    return [];
  }, [chapterPagesResponse]);

  const totalPages = pages.length;

  // Lấy chi tiết tất cả các trang
  const pageQueries = useQueries({
    queries: pages.map((page) => ({
      queryKey: ["pageDetail", page.id],
      queryFn: () => getPageDetail(page.id),
      enabled: !!page.id,
    })),
  });

  // ==================== STATE & DATA ====================
  const [readerMode, setReaderMode] = useState<"webtoon" | "manga-pagination" | "manga-flip">("manga-pagination");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load readerMode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reader_mode");
    if (saved === "webtoon" || saved === "manga-pagination" || saved === "manga-flip") {
      setReaderMode(saved as any);
    }
  }, []);

  const handleSetReaderMode = (mode: "webtoon" | "manga-pagination" | "manga-flip") => {
    setReaderMode(mode);
    localStorage.setItem("reader_mode", mode);
  };

  const [selectedBubble, setSelectedBubble] = useState<Bubble | null>(null);
  const [hoveredWord, setHoveredWord] = useState<{
    bubbleId: number;
    chunkIndex: number;
  } | null>(null);
  const [activeWord, setActiveWord] = useState<{
    bubbleId: number;
    chunkIndex: number;
  } | null>(null);
  const [textSelection, setTextSelection] =
    useState<SelectionTranslation | null>(null);
  const [commentText, setCommentText] = useState("");

  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipContainerRef = useRef<HTMLDivElement>(null);

  const chapterTitle = chapterOverviewData?.title ?? `Chương ${chapterNumber}`;

  const allBubbles = useMemo(() => {
    const list: Bubble[] = [];
    pageQueries.forEach((q) => {
      if (q.data?.bubbles) {
        list.push(...q.data.bubbles);
      }
    });
    return list;
  }, [pageQueries]);

  const isJapanese = useMemo(() => {
    const lang = comicDetailData?.originalLanguage?.toLowerCase() || "";
    return lang === "japanese" || lang === "ja" || lang === "jp";
  }, [comicDetailData]);

  // Comments
  const { data: commentsData, isLoading: commentsLoading } =
    useChapterComments(chapterId);
  const postCommentMutation = usePostChapterComment(chapterId);
  const chapterComments = commentsData?.data?.content || [];
  const { mutate: syncHistory } = useSyncReadingHistoryMutation();

  // ==================== EFFECTS & HANDLERS (giữ nguyên) ====================
  useEffect(() => {
    if (bookId && chapterId && currentPage) {
      syncHistory({
        comicId: parseInt(bookId, 10),
        chapterId: parseInt(chapterId, 10),
        lastPageRead: currentPage,
        clientUpdatedAt: new Date().toISOString(),
      });
    }
  }, [bookId, chapterId, currentPage, syncHistory]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!(event.target as Element)?.closest("[data-chunk-word]")) {
        setActiveWord(null);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  useEffect(() => {
    const handleTextSelection = () => {
      if (selectionTimeoutRef.current)
        clearTimeout(selectionTimeoutRef.current);

      selectionTimeoutRef.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setTextSelection(null);
          return;
        }

        const selectedText = selection.toString().trim();
        if (!selectedText) return;

        let bestBubble: Bubble | null = null;
        let bestChunks: BubbleChunk[] = [];

        for (const bubble of allBubbles) {
          const matched = bubble.chunks.filter(
            (chunk: BubbleChunk) =>
              selectedText.includes(chunk.word) ||
              chunk.word.includes(selectedText),
          );
          if (matched.length > bestChunks.length) {
            bestBubble = bubble;
            bestChunks = matched;
          }
        }

        if (bestBubble) {
          const translation =
            bestChunks.length > 0
              ? bestChunks
                .map(
                  (c: BubbleChunk) =>
                    `${c.word} (${c.romaji}): ${c.meaning || c.type}`,
                )
                .join("\n")
              : bestBubble.original_text;

          setTextSelection({
            text: selectedText,
            translation,
            chunks: bestChunks.length > 0 ? bestChunks : bestBubble.chunks,
          });
        }
      }, 300);
    };

    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, [allBubbles]);

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    postCommentMutation.mutate(
      { content: trimmed },
      {
        onSuccess: () => setCommentText(""),
      },
    );
  };

  const scrollToPage = (pageNum: number) => {
    setCurrentPage(pageNum);
    const el = document.querySelector(`[data-page-index="${pageNum - 1}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const nextP = currentPage - 1;
      if (readerMode === "webtoon" || readerMode === "manga-flip") {
        scrollToPage(nextP);
      } else {
        setCurrentPage(nextP);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextP = currentPage + 1;
      if (readerMode === "webtoon" || readerMode === "manga-flip") {
        scrollToPage(nextP);
      } else {
        setCurrentPage(nextP);
      }
    }
  };

  // Scroll to active page when readerMode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-page-index="${currentPage - 1}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [readerMode]);

  // Webtoon scroll listener (IntersectionObserver)
  const queriesLoaded = pageQueries.every((q) => q.isSuccess);
  useEffect(() => {
    if (readerMode !== "webtoon" || pages.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length === 0) return;

        let bestEntry = visibleEntries[0];
        for (const entry of visibleEntries) {
          if (entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }

        const indexAttr = bestEntry.target.getAttribute("data-page-index");
        if (indexAttr) {
          const pageNum = parseInt(indexAttr, 10) + 1;
          setCurrentPage(pageNum);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    const elements = document.querySelectorAll("[data-page-index]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [readerMode, pages, queriesLoaded]);

  // Manga Flip scroll snap observer
  const handleFlipScroll = () => {
    const container = flipContainerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    const pageNum = index + 1;
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  // Horizontal scroll alignment when currentPage changes externally
  useEffect(() => {
    if (readerMode !== "manga-flip") return;
    const container = flipContainerRef.current;
    if (!container) return;
    const expectedScrollLeft = (currentPage - 1) * container.clientWidth;
    if (Math.abs(container.scrollLeft - expectedScrollLeft) > 5) {
      container.scrollTo({ left: expectedScrollLeft, behavior: "smooth" });
    }
  }, [currentPage, readerMode]);

  const isChapterLoading = chapterOverviewLoading || pagesLoading;

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* HEADER */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="relative flex items-center justify-between">
          <button
            onClick={() => router.push(`/books/${bookId}`)}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100 z-10 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            {intl.formatMessage({ id: "dashboard.book.info" })}
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 text-center hidden md:block">
            <h1 className="text-2xl font-bold">
              {comicDetailData?.title || "Tên book test"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {chapterTitle} • {intl.formatMessage({ id: "common.pageCapital" })} {currentPage} / {totalPages || "?"}
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {intl.formatMessage({ id: "topbar.settings" })}
            </button>
          </div>
        </div>

        {/* Mobile Info view */}
        <div className="text-center mt-4 md:hidden">
          <h1 className="text-xl font-bold">
            {comicDetailData?.title || "Tên book test"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {chapterTitle} • {intl.formatMessage({ id: "common.pageCapital" })} {currentPage} / {totalPages || "?"}
          </p>
        </div>
      </div>

      {/* IMAGE + BUBBLES */}
      <div className="flex-1 flex justify-center px-4 pb-24">
        <div className="relative w-full max-w-[820px] mx-auto flex justify-center">
          {isChapterLoading ? (
            <div className="flex items-center justify-center h-[600px] w-full bg-gray-100 dark:bg-gray-900 rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">{intl.formatMessage({ id: "common.loading" })}</p>
              </div>
            </div>
          ) : readerMode === "webtoon" ? (
            <div className="flex flex-col gap-4 w-full">
              {pages.map((page, idx) => {
                const q = pageQueries[idx];
                return (
                  <div key={page.id} data-page-index={idx} className="w-full">
                    <ReaderPage
                      page={page}
                      pageDetail={q?.data}
                      isLoading={q?.isLoading}
                      isJapanese={isJapanese}
                      activeWord={activeWord}
                      setActiveWord={setActiveWord}
                      hoveredWord={hoveredWord}
                      setHoveredWord={setHoveredWord}
                      selectedBubble={selectedBubble}
                      setSelectedBubble={setSelectedBubble}
                      intl={intl}
                    />
                  </div>
                );
              })}
            </div>
          ) : readerMode === "manga-flip" ? (
            <div
              ref={flipContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full max-w-[820px] mx-auto scrollbar-none"
              onScroll={handleFlipScroll}
            >
              {pages.map((page, idx) => {
                const q = pageQueries[idx];
                return (
                  <div
                    key={page.id}
                    data-page-index={idx}
                    className="w-full flex-shrink-0 snap-start flex justify-center"
                  >
                    <ReaderPage
                      page={page}
                      pageDetail={q?.data}
                      isLoading={q?.isLoading}
                      isJapanese={isJapanese}
                      activeWord={activeWord}
                      setActiveWord={setActiveWord}
                      hoveredWord={hoveredWord}
                      setHoveredWord={setHoveredWord}
                      selectedBubble={selectedBubble}
                      setSelectedBubble={setSelectedBubble}
                      intl={intl}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            pages.length > 0 && (
              <div data-page-index={currentPage - 1} className="w-full">
                <ReaderPage
                  page={pages[currentPage - 1]}
                  pageDetail={pageQueries[currentPage - 1]?.data}
                  isLoading={pageQueries[currentPage - 1]?.isLoading}
                  isJapanese={isJapanese}
                  activeWord={activeWord}
                  setActiveWord={setActiveWord}
                  hoveredWord={hoveredWord}
                  setHoveredWord={setHoveredWord}
                  selectedBubble={selectedBubble}
                  setSelectedBubble={setSelectedBubble}
                  intl={intl}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* COMMENTS */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-3xl border shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold">
                {intl.formatMessage({ id: "chapterPage.commentsTitle" })}
              </h2>
              <p className="text-sm text-gray-500">
                {intl.formatMessage({ id: "common.chapterCapital" })}{" "}
                {chapterNumber}
              </p>
            </div>
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              placeholder={intl.formatMessage({
                id: "chapterPage.commentPlaceholder",
              })}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-400/30"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim() || postCommentMutation.isPending}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {postCommentMutation.isPending
                  ? intl.formatMessage({ id: "chapterPage.sendingComment" })
                  : intl.formatMessage({ id: "chapterPage.submitComment" })}
              </button>
            </div>
          </form>

          {textSelection && (
            <div className="mt-5 rounded-3xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-950/20">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                {intl.formatMessage({ id: "chapterPage.selectedTextTitle" })}
              </p>
              <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                {textSelection.text}
              </p>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-gray-700 dark:text-gray-300">
                {textSelection.translation}
              </pre>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {commentsLoading ? (
              <div className="text-center py-8">{intl.formatMessage({ id: "chapterPage.commentsLoading" })}</div>
            ) : chapterComments.length > 0 ? (
              chapterComments.map((comment: ChapterComment) => (
                <div
                  key={comment.id}
                  className="rounded-3xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 ring-2 ring-white dark:ring-gray-900 shadow-sm overflow-hidden">
                    {comment.avatarUrl ? (
                      <img src={comment.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {comment.fullName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                    <div>
                      <p className="font-semibold">{comment.fullName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">{intl.formatMessage({ id: "chapterPage.noComments" })}</p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:border-gray-800 shadow-lg dark:bg-gray-900 z-45">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {intl.formatMessage({ id: "common.prev" })}
          </button>

          <span className="font-medium text-lg">
            {currentPage} / {totalPages || "?"}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {intl.formatMessage({ id: "common.next" })}
          </button>
        </div>
      </footer>

      {/* POPUP CHI TIẾT BUBBLE */}
      {selectedBubble && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border dark:border-gray-800">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
              <h3 className="font-bold text-lg text-black dark:text-white">{intl.formatMessage({ id: "popups.dialogueInfo.title" })}</h3>
              <button
                onClick={() => setSelectedBubble(null)}
                className="text-3xl text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-auto max-h-[65vh]">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{intl.formatMessage({ id: "popups.dialogueInfo.originalText" })}</p>
                <p className="font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-lg break-all text-black dark:text-white">
                  {selectedBubble.original_text}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{intl.formatMessage({ id: "popups.dialogueInfo.translatedText" })}</p>
                <p className="text-lg leading-relaxed bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl text-black dark:text-white border border-blue-100 dark:border-blue-900/50">
                  {selectedBubble.full_translation || intl.formatMessage({ id: "common.updating" })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{intl.formatMessage({ id: "popups.dialogueInfo.vocabAnalysis" })}</p>
                <div className="space-y-5">
                  {selectedBubble.chunks.map((chunk: BubbleChunk, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-bold text-black dark:text-white text-xl">{chunk.word}</span>
                        <span className="font-mono text-gray-500 dark:text-gray-400">
                          {chunk.romaji}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{chunk.meaning}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {intl.formatMessage({ id: "popups.dialogueInfo.type" })}: {chunk.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-800 text-center">
              <button
                onClick={() => setSelectedBubble(null)}
                className="px-10 py-3 bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl hover:bg-black transition-colors"
              >
                {intl.formatMessage({ id: "common.close" })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS POPUP/PANEL */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[9990] flex justify-end bg-black/30" onClick={() => setSettingsOpen(false)}>
          <div
            className="w-80 h-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-2xl border-l border-gray-200/50 dark:border-gray-800/50 p-6 flex flex-col justify-between transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {intl.formatMessage({ id: "readerSettings.title" })}
                </h3>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                    {intl.formatMessage({ id: "readerSettings.layoutMode" })}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { mode: "webtoon", labelId: "readerSettings.webtoon" },
                      { mode: "manga-pagination", labelId: "readerSettings.mangaPagination" },
                      { mode: "manga-flip", labelId: "readerSettings.mangaFlip" },
                    ].map((opt) => (
                      <button
                        key={opt.mode}
                        onClick={() => handleSetReaderMode(opt.mode as any)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border text-sm font-medium ${
                          readerMode === opt.mode
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md"
                            : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        {intl.formatMessage({ id: opt.labelId })}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
              {intl.formatMessage({ id: "common.footer" })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== READER PAGE COMPONENT ====================
interface ReaderPageProps {
  page: ChapterPage;
  pageDetail: PageDetailResponse | undefined;
  isLoading: boolean;
  isJapanese: boolean;
  activeWord: { bubbleId: number; chunkIndex: number } | null;
  setActiveWord: (val: { bubbleId: number; chunkIndex: number } | null) => void;
  hoveredWord: { bubbleId: number; chunkIndex: number } | null;
  setHoveredWord: (val: { bubbleId: number; chunkIndex: number } | null) => void;
  selectedBubble: Bubble | null;
  setSelectedBubble: (val: Bubble | null) => void;
  intl: any;
}

function ReaderPage({
  page,
  pageDetail,
  isLoading,
  isJapanese,
  activeWord,
  setActiveWord,
  hoveredWord,
  setHoveredWord,
  selectedBubble,
  setSelectedBubble,
  intl,
}: ReaderPageProps) {
  const [imageScale, setImageScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const updateImageScale = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;
    const displayedWidth = img.getBoundingClientRect().width;
    const naturalWidth = img.naturalWidth || 800;
    setImageScale(displayedWidth / naturalWidth);
  }, []);

  useEffect(() => {
    updateImageScale();
    window.addEventListener("resize", updateImageScale);
    return () => window.removeEventListener("resize", updateImageScale);
  }, [pageDetail, updateImageScale]);

  const currentImage = pageDetail?.images?.inpaintedUrl || pageDetail?.images?.originalUrl || page.imageUrl;
  const currentBubbles = pageDetail?.bubbles || [];

  const sortedBubbles = useMemo(() => {
    return [...currentBubbles].sort((a, b) => {
      const [ax, ay] = a.box;
      const [bx, by] = b.box;
      if (Math.abs(ax - bx) > 50) return bx - ax;
      return ay - by;
    });
  }, [currentBubbles]);

  const getBubbleStyle = (bubble: Bubble) => {
    const [x, y, w, h] = bubble.box;
    return {
      left: `${Math.round(x * imageScale)}px`,
      top: `${Math.round(y * imageScale)}px`,
      width: `${Math.round(w * imageScale)}px`,
      height: `${Math.round(h * imageScale)}px`,
    };
  };

  const handleChunkHover = (bubbleId: number, chunkIndex: number) => {
    setHoveredWord({ bubbleId, chunkIndex });
  };

  const handleChunkLeave = () => setHoveredWord(null);

  const handleBubbleClick = (bubble: Bubble) => {
    setActiveWord(null);
    setSelectedBubble(bubble);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-full bg-gray-100 dark:bg-gray-900 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">{intl.formatMessage({ id: "common.loading" })}</p>
        </div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="text-center py-20 text-gray-500 w-full bg-gray-100 dark:bg-gray-900 rounded-xl">
        {intl.formatMessage({ id: "chapterPage.noImageFound" })}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[820px] mx-auto select-text">
      <img
        ref={imageRef}
        src={currentImage}
        alt={`Trang ${page.pageNumber}`}
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
          <div
            className={
              isJapanese
                ? "max-w-full"
                : "w-full flex flex-wrap gap-1 justify-center"
            }
            style={
              isJapanese
                ? {
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    textAlign: "center",
                    maxHeight: "100%",
                    wordBreak: "break-word",
                  }
                : {
                    textAlign: "center",
                    wordBreak: "break-word",
                  }
            }
          >
            {bubble.chunks.map((chunk: BubbleChunk, idx: number) => {
              const isActive =
                (hoveredWord?.bubbleId === bubble.id &&
                  hoveredWord?.chunkIndex === idx) ||
                (activeWord?.bubbleId === bubble.id &&
                  activeWord?.chunkIndex === idx);

              return (
                <span
                  key={idx}
                  data-chunk-word
                  className={`text-black dark:text-black relative hover:bg-yellow-200 hover:text-black rounded cursor-pointer transition-colors text-sm select-none ${
                    isJapanese ? "inline-block leading-tight" : "inline"
                  }`}
                  onMouseEnter={() => handleChunkHover(bubble.id, idx)}
                  onMouseLeave={handleChunkLeave}
                >
                  {chunk.word}

                  {isActive && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white text-black p-3 rounded-xl shadow-2xl z-[9999] pointer-events-none border"
                      style={{ writingMode: "horizontal-tb" }}
                    >
                      <div className="text-black dark:text-black flex items-baseline gap-2 mb-1">
                        <span className="text-black dark:text-black font-bold text-lg">
                          {chunk.word}
                        </span>
                        <span className="text-black dark:text-black text-xs">
                          {chunk.romaji}
                        </span>
                      </div>
                      <p className="text-black dark:text-black text-sm mb-2">
                        {chunk.meaning || chunk.type}
                      </p>
                      <p className="text-black dark:text-black text-[11px]">
                        {intl.formatMessage({ id: "popups.dialogueInfo.type" })}: {chunk.type}
                      </p>
                    </div>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
