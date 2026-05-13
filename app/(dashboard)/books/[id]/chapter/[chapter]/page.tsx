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
import {
  Book,
  BookChapter,
  Bubble,
  BubbleChunk,
  ChapterPage,
  SelectionTranslation,
  ChapterComment,
} from "./type";
import {
  useChapterComments,
  useChapterOverview,
  usePostChapterComment,
} from "./queryHook/queryHook";

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
  },
];

const MOCK_CHAPTERS: BookChapter[] = [
  {
    id: "ch-nha-001",
    book_id: "123",
    chapterNumber: 1,
    title: "Giấc Mơ Lặp Lại",
    total_pages: 3,
    hasNextChapter: true,
  },
  {
    id: "ch-nha-002",
    book_id: "123",
    chapterNumber: 2,
    title: "Gặp Người Vua Già",
    total_pages: 2,
    hasNextChapter: false,
  },
];

const MOCK_CHAPTER_PAGES: ChapterPage[] = [
  {
    page_id: "page-001",
    chapter_id: "ch-nha-001",
    page_number: 1,
    image_url: "/cleaned_image.jpg",
    original_lang: "ja",
    bubbles: [
      {
        id: 1,
        box: [318, 69, 140, 218],
        original_text: "えーみにゃ：皆も聞いている通り",
        full_translation: "Well, Minya: As you all have heard,",
        chunks: [
          {
            chunk_id: "1-1",
            word: "えー",
            romaji: "e-",
            type: "interjection",
            meaning: "Well / Uh (filler)",
          },
          {
            chunk_id: "1-2",
            word: "みにゃ",
            romaji: "minya",
            type: "noun",
            meaning: "Minya (speaker name)",
          },
          {
            chunk_id: "1-3",
            word: "：",
            romaji: ":",
            type: "punctuation",
            meaning: "Colon (punctuation)",
          },
          {
            chunk_id: "1-4",
            word: "皆",
            romaji: "mina",
            type: "noun",
            meaning: "Everyone",
          },
          {
            chunk_id: "1-5",
            word: "も",
            romaji: "mo",
            type: "particle",
            meaning: "Also / too (particle)",
          },
          {
            chunk_id: "1-6",
            word: "聞いている",
            romaji: "kiiteiru",
            type: "verb",
            meaning:
              "As you have heard (te-iru form, present continuous/state)",
          },
          {
            chunk_id: "1-7",
            word: "通り",
            romaji: "toori",
            type: "noun",
            meaning: "As / according to",
          },
        ],
      },
      {
        id: 2,
        box: [818, 431, 136, 208],
        original_text: "この楓林女子高は学園併合に伴い",
        full_translation:
          "Due to the school merger, this Furin Girls' High School...",
        chunks: [
          {
            chunk_id: "2-1",
            word: "この",
            romaji: "kono",
            type: "determiner",
            meaning: "This",
          },
          {
            chunk_id: "2-2",
            word: "楓林",
            romaji: "fuurin",
            type: "noun",
            meaning: "Furin (name)",
          },
          {
            chunk_id: "2-3",
            word: "女子高",
            romaji: "joshikou",
            type: "noun",
            meaning: "Girls' high school",
          },
          {
            chunk_id: "2-4",
            word: "は",
            romaji: "wa",
            type: "particle",
            meaning: "Is (copula)",
          },
          {
            chunk_id: "2-5",
            word: "学園",
            romaji: "gakuen",
            type: "noun",
            meaning: "School",
          },
          {
            chunk_id: "2-6",
            word: "併合",
            romaji: "heigou",
            type: "noun",
            meaning: "Merger",
          },
          {
            chunk_id: "2-7",
            word: "に伴い",
            romaji: "nitomanoi",
            type: "particle",
            meaning: "Due to / along with",
          },
        ],
      },
      {
        id: 3,
        box: [159, 460, 168, 187],
        original_text: "本年度から楓林男子高と合併し共学となる",
        full_translation:
          "will merge with Furin Boys' High School starting this year and become co-ed.",
        chunks: [
          {
            chunk_id: "3-1",
            word: "本年度",
            romaji: "honnendo",
            type: "noun",
            meaning: "This fiscal year",
          },
          {
            chunk_id: "3-2",
            word: "から",
            romaji: "kara",
            type: "particle",
            meaning: "From",
          },
          {
            chunk_id: "3-3",
            word: "楓林",
            romaji: "fuurin",
            type: "noun",
            meaning: "Furin (name)",
          },
          {
            chunk_id: "3-4",
            word: "男子高",
            romaji: "danshikou",
            type: "noun",
            meaning: "Boys' high school",
          },
          {
            chunk_id: "3-5",
            word: "と",
            romaji: "to",
            type: "particle",
            meaning: "With",
          },
          {
            chunk_id: "3-6",
            word: "合併",
            romaji: "gappei",
            type: "noun",
            meaning: "Merge",
          },
          {
            chunk_id: "3-7",
            word: "し",
            romaji: "shi",
            type: "verb",
            meaning: "Do (connective form)",
          },
          {
            chunk_id: "3-8",
            word: "共学",
            romaji: "kyougaku",
            type: "noun",
            meaning: "Co-ed",
          },
          {
            chunk_id: "3-9",
            word: "となる",
            romaji: "tonaru",
            type: "verb",
            meaning: "Becomes (dictionary form)",
          },
        ],
      },
      {
        id: 4,
        box: [813, 792, 178, 220],
        original_text: "急に男子が入ってきて戸惑うだろうが仲良くしてくれ",
        full_translation:
          "I'm sure you're bewildered by the boys suddenly entering, but please get along with them.",
        chunks: [
          {
            chunk_id: "4-1",
            word: "急に",
            romaji: "kyuu ni",
            type: "adverb",
            meaning: "Suddenly",
          },
          {
            chunk_id: "4-2",
            word: "男子",
            romaji: "danshi",
            type: "noun",
            meaning: "Boys",
          },
          {
            chunk_id: "4-3",
            word: "が",
            romaji: "ga",
            type: "particle",
            meaning: "Subject marker",
          },
          {
            chunk_id: "4-4",
            word: "入ってきて",
            romaji: "haittekite",
            type: "verb",
            meaning: "Enter (te-form)",
          },
          {
            chunk_id: "4-5",
            word: "戸惑う",
            romaji: "tomadou",
            type: "verb",
            meaning: "Be bewildered (dictionary form)",
          },
          {
            chunk_id: "4-6",
            word: "だろう",
            romaji: "darou",
            type: "auxiliary",
            meaning: "Probably (conjecture)",
          },
          {
            chunk_id: "4-7",
            word: "が",
            romaji: "ga",
            type: "particle",
            meaning: "But",
          },
          {
            chunk_id: "4-8",
            word: "仲良く",
            romaji: "nakayoku",
            type: "adverb",
            meaning: "Get along well",
          },
          {
            chunk_id: "4-9",
            word: "して",
            romaji: "shite",
            type: "verb",
            meaning: "Do (te-form)",
          },
          {
            chunk_id: "4-10",
            word: "くれ",
            romaji: "kure",
            type: "verb",
            meaning: "Please (request)",
          },
        ],
      },
      {
        id: 5,
        box: [341, 1174, 196, 212],
        original_text: "じゃあ新学期だし自己紹介からするか！",
        full_translation:
          "Well then, it's the new semester, so shall we start with self-introductions!",
        chunks: [
          {
            chunk_id: "5-1",
            word: "じゃあ",
            romaji: "jaa",
            type: "conjunction",
            meaning: "Well then",
          },
          {
            chunk_id: "5-2",
            word: "新学期",
            romaji: "shingakki",
            type: "noun",
            meaning: "New semester",
          },
          {
            chunk_id: "5-3",
            word: "だし",
            romaji: "dashi",
            type: "particle",
            meaning: "Is (copula)",
          },
          {
            chunk_id: "5-4",
            word: "自己紹介",
            romaji: "jikoshoukai",
            type: "noun",
            meaning: "Self-introduction",
          },
          {
            chunk_id: "5-5",
            word: "から",
            romaji: "kara",
            type: "particle",
            meaning: "From",
          },
          {
            chunk_id: "5-6",
            word: "するか",
            romaji: "suru ka",
            type: "verb",
            meaning: "Do (volitional form)",
          },
          {
            chunk_id: "5-7",
            word: "！",
            romaji: "!",
            type: "punctuation",
            meaning: "Exclamation mark",
          },
        ],
      },
      {
        id: 6,
        box: [134, 805, 109, 189],
        original_text: "まずは左の男子から．．．",
        full_translation: "First, from the boys on the left...",
        chunks: [
          {
            chunk_id: "6-1",
            word: "まずは",
            romaji: "mazu wa",
            type: "adverb",
            meaning: "First",
          },
          {
            chunk_id: "6-2",
            word: "左の",
            romaji: "hidari no",
            type: "noun",
            meaning: "Left",
          },
          {
            chunk_id: "6-3",
            word: "男子",
            romaji: "danshi",
            type: "noun",
            meaning: "Boys",
          },
          {
            chunk_id: "6-4",
            word: "から",
            romaji: "kara",
            type: "particle",
            meaning: "From",
          },
          {
            chunk_id: "6-5",
            word: "．．．",
            romaji: "...",
            type: "punctuation",
            meaning: "Ellipsis",
          },
        ],
      },
      {
        id: 7,
        box: [63, 1235, 141, 276],
        original_text: "先生！！",
        full_translation: "Teacher!!",
        chunks: [
          {
            chunk_id: "7-1",
            word: "先生",
            romaji: "sensei",
            type: "noun",
            meaning: "Teacher",
          },
          {
            chunk_id: "7-2",
            word: "！！",
            romaji: "!!",
            type: "punctuation",
            meaning: "Exclamation marks",
          },
        ],
      },
    ],
  },
  {
    page_id: "page-002",
    chapter_id: "ch-nha-001",
    page_number: 2,
    image_url: "https://picsum.photos/id/1015/800/1200",
    original_lang: "ja",
    bubbles: [],
  },
  {
    page_id: "page-003",
    chapter_id: "ch-nha-001",
    page_number: 3,
    original_lang: "ja",
    image_url: "https://picsum.photos/id/1016/800/1200",
    bubbles: [],
  },
  {
    page_id: "page-004",
    chapter_id: "ch-nha-002",
    page_number: 1,
    original_lang: "ja",
    image_url: "https://picsum.photos/id/201/800/1200",
    bubbles: [],
  },
  {
    page_id: "page-005",
    chapter_id: "ch-nha-002",
    page_number: 2,
    image_url: "https://picsum.photos/id/202/800/1200",
    original_lang: "ja",
    bubbles: [],
  },
];

/* =========================
   COMPONENT
========================= */

export default function ComicChapterPage() {
  const params = useParams();
  const router = useRouter();
  const intl = useIntl();
  const bookId = params.id as string;
  const chapterNumber = parseInt(params.chapter as string, 10);
  const {
    data: chapterOverviewData,
    isLoading: chapterOverviewLoading,
    isError: chapterOverviewError,
  } = useChapterOverview(bookId, chapterNumber);
  const [currentPage, setCurrentPage] = useState(1);
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

  const book = useMemo(() => MOCK_BOOKS.find((b) => b.id === bookId), [bookId]);

  const chapter = useMemo(
    () =>
      MOCK_CHAPTERS.find(
        (ch) => ch.book_id === bookId && ch.chapterNumber === chapterNumber,
      ),
    [bookId, chapterNumber],
  );
  console.log("Chapter overview data:", chapterOverviewData);
  const chapterKey = chapterOverviewData?.id;
  const chapterTitle = chapter?.title ?? `Chương ${chapterNumber}`;

  // Use API hooks
  const { data: commentsData, isLoading: commentsLoading } =
    useChapterComments(chapterKey);
  const postCommentMutation = usePostChapterComment(chapterKey);

  const chapterComments = commentsData?.data.content || [];

  const pages = useMemo(
    () =>
      MOCK_CHAPTER_PAGES.filter((page) => page.chapter_id === chapter?.id).sort(
        (a, b) => a.page_number - b.page_number,
      ),
    [chapter?.id],
  );

  const totalPages = pages.length;
  const currentPageData = useMemo(
    () => pages.find((p) => p.page_number === currentPage),
    [pages, currentPage],
  );
  const isJapanese = currentPageData?.original_lang === "ja";

  const currentImage = currentPageData?.image_url;
  const currentBubbles = useMemo(
    () => currentPageData?.bubbles || [],
    [currentPageData],
  );

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    postCommentMutation.mutate(
      { content: trimmed },
      {
        onSuccess: () => {
          setCommentText("");
        },
      },
    );
  };
  const sortedBubbles = useMemo(() => {
    if (!isJapanese) return currentBubbles;

    return [...currentBubbles].sort((a, b) => {
      const [ax, ay] = a.box;
      const [bx, by] = b.box;

      // phải → trái
      if (Math.abs(ax - bx) > 50) {
        return bx - ax;
      }

      // trên → dưới
      return ay - by;
    });
  }, [currentBubbles, isJapanese]);
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
      const target = event.target as Node | null;
      const element = target
        ? target.nodeType === Node.ELEMENT_NODE
          ? (target as Element)
          : target.nodeType === Node.TEXT_NODE
            ? target.parentElement
            : null
        : null;

      if (!element?.closest("[data-chunk-word]")) {
        setActiveWord(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  // Xử lý bôi đen text
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
            (chunk) =>
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
                  .map((c) => `${c.word} (${c.romaji}): ${c.meaning}`)
                  .join("\n")
              : bestBubble.full_translation;

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

  const getBubbleStyle = (bubble: Bubble) => {
    const [x, y, w, h] = bubble.box;

    return {
      left: `${Math.round(x * imageScale)}px`,
      top: `${Math.round(y * imageScale)}px`,
      width: `${Math.round(w * imageScale)}px`,
      height: `${Math.round(h * imageScale)}px`,
    };
  };

  // Hover vào chữ → hiện tooltip
  const handleChunkHover = (bubbleId: number, chunkIndex: number) => {
    setHoveredWord({ bubbleId, chunkIndex });
  };

  const handleChunkLeave = () => {
    setHoveredWord(null);
  };

  // Click cả bubble → mở popup chi tiết
  const handleBubbleClick = (bubble: Bubble) => {
    setActiveWord(null);
    setSelectedBubble(bubble);
  };

  const prevChapterNum = chapter?.chapterNumber ? chapter.chapterNumber - 1 : 0;
  const nextChapterNum = chapter?.chapterNumber ? chapter.chapterNumber + 1 : 0;

  const hasPrevChapter = MOCK_CHAPTERS.some(
    (ch) => ch.book_id === bookId && ch.chapterNumber === prevChapterNum,
  );
  const hasNextChapter = chapter?.hasNextChapter || false;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    else if (hasPrevChapter)
      router.push(`/books/${bookId}/chapter/${prevChapterNum}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    else if (hasNextChapter)
      router.push(`/books/${bookId}/chapter/${nextChapterNum}`);
  };

  return (
    <div
      key={chapterNumber}
      className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
    >
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
            <h1 className="text-2xl font-bold">{book?.title}</h1>
            <p className="text-gray-600">
              {chapter?.title} •{" "}
              {intl.formatMessage({ id: "common.pageCapital" })} {currentPage} /{" "}
              {totalPages}
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
                            textWrap: "balance",
                          }
                        : {
                            textAlign: "center",
                            wordBreak: "break-word",
                          }
                    }
                  >
                    {bubble.chunks.map((chunk, idx) => {
                      const isActive =
                        (hoveredWord?.bubbleId === bubble.id &&
                          hoveredWord?.chunkIndex === idx) ||
                        (activeWord?.bubbleId === bubble.id &&
                          activeWord?.chunkIndex === idx);

                      const isNumber = /^\d+$/.test(chunk.word);
                      const isPunctuationCombo = /^[!?！？]{2,}$/.test(
                        chunk.word,
                      );

                      const isTateChuYoko =
                        isJapanese && (isNumber || isPunctuationCombo);
                      const isSinglePunctuation =
                        isJapanese && /^[!?！？]$/.test(chunk.word);

                      return (
                        <span
                          key={idx}
                          data-chunk-word
                          className={`relative hover:bg-yellow-200 hover:text-black rounded cursor-pointer transition-colors text-sm select-none ${
                            isJapanese
                              ? `inline-block leading-tight ${isTateChuYoko || isSinglePunctuation ? "font-bold" : ""}`
                              : "inline"
                          }`}
                          style={
                            isJapanese
                              ? {
                                  ...(isTateChuYoko && {
                                    textCombineUpright: "all",
                                    textOrientation: "upright",
                                    letterSpacing: "-1px",
                                    transform: "translateX(10%)",
                                    fontWeight: "900",
                                  }),
                                  ...(isSinglePunctuation && {
                                    transform: "translateX(-15%)",
                                    display: "inline-block",
                                  }),
                                }
                              : {}
                          }
                          onMouseEnter={() => handleChunkHover(bubble.id, idx)}
                          onMouseLeave={handleChunkLeave}
                        >
                          {chunk.word}

                          {/* Tooltip Hover */}
                          {isActive && (
                            <div
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white text-black p-3 rounded-xl shadow-2xl z-50 pointer-events-none border"
                              style={{ writingMode: "horizontal-tb" }}
                            >
                              {/* WORD */}
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-lg">
                                  {chunk.word}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {chunk.romaji}
                                </span>
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
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              Đang tải trang...
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="submit"
                disabled={!commentText.trim() || postCommentMutation.isPending}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {postCommentMutation.isPending ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {intl.formatMessage({ id: "chapterPage.sendingComment" })}
                  </>
                ) : (
                  intl.formatMessage({ id: "chapterPage.submitComment" })
                )}
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
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {intl.formatMessage({ id: "chapterPage.commentsLoading" })}
                </p>
              </div>
            ) : chapterComments.length > 0 ? (
              chapterComments.map((comment) => (
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
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {comment.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {intl.formatMessage({
                          id: "chapterPage.commentReplies",
                          values: { count: comment.replies.length },
                        })}
                      </p>
                      {/* You can expand replies here if needed */}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: "chapterPage.noComments" })}
              </p>
            )}
          </div>
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
            {intl.formatMessage({ id: "common.prev" })}
          </button>

          <span className="font-medium text-lg">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages && !hasNextChapter}
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium"
          >
            {intl.formatMessage({ id: "common.next" })}
          </button>
        </div>
      </footer>

      {/* POPUP CHI TIẾT */}
      {selectedBubble && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">
                {intl.formatMessage({ id: "popups.dialogueInfo.title" })}
              </h3>
              <button
                onClick={() => setSelectedBubble(null)}
                className="text-3xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-auto max-h-[65vh]">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {intl.formatMessage({
                    id: "popups.dialogueInfo.originalText",
                  })}
                </p>
                <p className="font-mono bg-gray-100 p-4 rounded-xl text-lg break-all">
                  {selectedBubble.original_text}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {intl.formatMessage({
                    id: "popups.dialogueInfo.translatedText",
                  })}
                </p>
                <p className="text-lg leading-relaxed bg-blue-50 p-4 rounded-xl">
                  {selectedBubble.full_translation}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">
                  {intl.formatMessage({
                    id: "popups.dialogueInfo.vocabAnalysis",
                  })}
                </p>
                <div className="space-y-5">
                  {selectedBubble.chunks.map((chunk, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-bold text-xl">{chunk.word}</span>
                        <span className="font-mono text-gray-500">
                          {chunk.romaji}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{chunk.meaning}</p>
                      <p className="text-xs text-gray-400">
                        {intl.formatMessage({ id: "popups.dialogueInfo.type" })}
                        : {chunk.type}
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
