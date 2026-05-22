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
import { Book, Bubble, BubbleChunk, SelectionTranslation, ChapterComment, ChapterPage } from "./type";

import {
  useChapterComments,
  useChapterOverview,
  usePostChapterComment,
  useChapterPages,
  usePageDetail,
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

  // Lấy pageId của trang hiện tại
  const currentPageId = useMemo(() => {
    if (!pages.length) return undefined;
    const page = pages.find((p) => p.pageNumber === currentPage);
    return page?.id;
  }, [pages, currentPage]);

  // Lấy chi tiết page hiện tại
  const { data: pageDetail, isLoading: pageDetailLoading } = usePageDetail(
    currentPageId!,
  );

  // ==================== STATE & DATA ====================
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
  const [imageScale, setImageScale] = useState(1);
  const [commentText, setCommentText] = useState("");

  const imageRef = useRef<HTMLImageElement>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const chapterTitle = chapterOverviewData?.title ?? `Chương ${chapterNumber}`;

  const currentImage =
    pageDetail?.images?.inpaintedUrl || pageDetail?.images?.originalUrl;

  const currentBubbles: Bubble[] = pageDetail?.bubbles || [];

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
  }, [currentImage, updateImageScale]);

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

        for (const bubble of currentBubbles) {
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
  }, [currentBubbles]);

  const handleChunkHover = (bubbleId: number, chunkIndex: number) => {
    setHoveredWord({ bubbleId, chunkIndex });
  };

  const handleChunkLeave = () => setHoveredWord(null);

  const handleBubbleClick = (bubble: Bubble) => {
    setActiveWord(null);
    setSelectedBubble(bubble);
  };

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

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const isLoading =
    chapterOverviewLoading ||
    pagesLoading ||
    (pageDetailLoading && !!currentPageId);

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* HEADER */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="relative flex items-center">
          <button
            onClick={() => router.push(`/books/${bookId}`)}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100 z-10"
          >
            {intl.formatMessage({ id: "dashboard.book.info" })}
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-2xl font-bold">
              {comicDetailData?.title || "Tên book test"}
            </h1>
            <p className="text-gray-600">
              {chapterTitle} • {intl.formatMessage({ id: "common.pageCapital" })} {currentPage} / {totalPages || "?"}
            </p>
          </div>
        </div>
      </div>

      {/* IMAGE + BUBBLES */}
      <div className="flex-1 flex justify-center px-4 pb-24">
        <div className="relative w-full max-w-[820px] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px] bg-gray-100 dark:bg-gray-900 rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">{intl.formatMessage({ id: "common.loading" })}</p>
              </div>
            </div>
          ) : currentImage ? (
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
                          className={`relative hover:bg-yellow-200 hover:text-black rounded cursor-pointer transition-colors text-sm select-none ${isJapanese ? "inline-block leading-tight" : "inline"
                            }`}
                          onMouseEnter={() => handleChunkHover(bubble.id, idx)}
                          onMouseLeave={handleChunkLeave}
                        >
                          {chunk.word}

                          {isActive && (
                            <div
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white text-black p-3 rounded-xl shadow-2xl z-50 pointer-events-none border"
                              style={{ writingMode: "horizontal-tb" }}
                            >
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-lg">
                                  {chunk.word}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {chunk.romaji}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">
                                {chunk.meaning || chunk.type}
                              </p>
                              <p className="text-[11px] text-gray-400">
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
          ) : (
            <div className="text-center py-20 text-gray-500">
              {intl.formatMessage({ id: "chapterPage.noImageFound" })}
            </div>
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
                    <img
                      src={comment.avatarUrl || "/default-avatar.png"}
                      alt={comment.fullName}
                      className="w-8 h-8 rounded-full"
                    />
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg font-medium"
          >
            {intl.formatMessage({ id: "common.prev" })}
          </button>

          <span className="font-medium text-lg">
            {currentPage} / {totalPages || "?"}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium"
          >
            {intl.formatMessage({ id: "common.next" })}
          </button>
        </div>
      </footer>

      {/* POPUP CHI TIẾT BUBBLE */}
      {selectedBubble && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">{intl.formatMessage({ id: "popups.dialogueInfo.title" })}</h3>
              <button
                onClick={() => setSelectedBubble(null)}
                className="text-3xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-auto max-h-[65vh]">
              <div>
                <p className="text-sm text-gray-500 mb-1">{intl.formatMessage({ id: "popups.dialogueInfo.originalText" })}</p>
                <p className="font-mono bg-gray-100 p-4 rounded-xl text-lg break-all">
                  {selectedBubble.original_text}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{intl.formatMessage({ id: "popups.dialogueInfo.translatedText" })}</p>
                <p className="text-lg leading-relaxed bg-blue-50 p-4 rounded-xl">
                  {selectedBubble.full_translation || intl.formatMessage({ id: "common.updating" })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">{intl.formatMessage({ id: "popups.dialogueInfo.vocabAnalysis" })}</p>
                <div className="space-y-5">
                  {selectedBubble.chunks.map((chunk: BubbleChunk, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-bold text-xl">{chunk.word}</span>
                        <span className="font-mono text-gray-500">
                          {chunk.romaji}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{chunk.meaning}</p>
                      <p className="text-xs text-gray-400">
                        {intl.formatMessage({ id: "popups.dialogueInfo.type" })}: {chunk.type}
                      </p>
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
                {intl.formatMessage({ id: "common.close" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
