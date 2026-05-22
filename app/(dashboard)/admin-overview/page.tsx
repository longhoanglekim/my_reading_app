"use client";

import { useAdminDashboardSummary, useTriggerReindex } from "../admin/user-management/queryHook";
import { useUserStore } from "@/app/store/userStore";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Users,
  BookOpen,
  Layers,
  FileText,
  Star,
  History,
  RefreshCw,
  UserCheck,
  UserX,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { useNotification } from "@/app/components/providers/NotificationProvider";
import { AxiosError } from "axios";

export default function AdminOverview() {
  const intl = useIntl();
  const router = useRouter();
  const { showNotification } = useNotification();
  const user = useUserStore().user;
  const isAdmin = user?.role === "ADMIN";

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      showNotification({
        type: "error",
        title: "Từ chối truy cập",
        message: "Bạn không có quyền truy cập trang quản trị.",
      });
      router.push("/dashboard");
    }
  }, [user, isAdmin, router, showNotification]);

  // Fetch summary stats
  const { data: summary, isLoading, isError, refetch } = useAdminDashboardSummary();

  // Reindex mutation
  const { mutate: triggerReindex, isPending: isReindexing } = useTriggerReindex();

  const handleReindex = () => {
    triggerReindex(undefined, {
      onSuccess: () => {
        showNotification({
          type: "success",
          title: "Reindex thành công",
          message: "Đã lập chỉ mục lại toàn bộ truyện vào Elasticsearch.",
        });
        refetch();
      },
      onError: (error: AxiosError) => {
        showNotification({
          type: "error",
          title: "Reindex thất bại",
          message: error.response?.data?.message || error.message || "Có lỗi xảy ra khi reindex.",
        });
      }
    });
  };

  if (!user) {
    return <div className="text-center py-10 font-medium text-gray-500">Đang tải thông tin người dùng...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2">Không có quyền truy cập</h1>
        <p className="text-gray-600 dark:text-gray-400">Trang này chỉ dành cho Quản trị viên.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">Đang tải dữ liệu thống kê...</span>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="text-center py-10 text-red-500 font-medium flex flex-col items-center gap-4">
        <span>Đã xảy ra lỗi khi lấy số liệu thống kê từ hệ thống.</span>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Tổng số truyện",
      value: summary.totalComics,
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Tổng số chương",
      value: summary.totalChapters,
      icon: Layers,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Tổng số trang truyện",
      value: summary.totalPages,
      icon: FileText,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Tổng lượt lịch sử đọc",
      value: summary.totalReadingHistories,
      icon: History,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-600 dark:text-teal-400"
    },
    {
      title: "Tổng số người dùng",
      value: summary.totalUsers,
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      title: "Người dùng hoạt động",
      value: summary.activeUsers,
      icon: UserCheck,
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Người dùng bị khóa",
      value: summary.lockedUsers,
      icon: UserX,
      color: "from-red-500 to-rose-600",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Tổng lượt đánh giá",
      value: summary.totalRatings,
      icon: Star,
      color: "from-yellow-500 to-amber-600",
      textColor: "text-yellow-600 dark:text-yellow-400"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 border-b pb-6 border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Xem số liệu thống kê hệ thống thực tế và thực hiện các tác vụ quản trị.
          </p>
        </div>

        {/* REINDEX ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReindex}
            disabled={isReindexing}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow-md
              bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <RefreshCw className={`w-5 h-5 ${isReindexing ? "animate-spin" : ""}`} />
            {isReindexing ? "Đang reindex..." : "Reindex Elasticsearch"}
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="group relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-500`}>
                {card.title}
              </span>
              <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800 ${card.textColor} group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">
                {card.value.toLocaleString()}
              </span>
            </div>
            {/* Decorative bottom bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        ))}
      </div>

      {/* TOP RATED COMICS & GENERAL MANAGEMENT QUICK LINKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TOP COMICS LIST */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Truyện có đánh giá cao nhất
            </h2>
            <button
              onClick={() => router.push("/admin-books")}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Quản lý truyện
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {summary.topComics && summary.topComics.length > 0 ? (
              summary.topComics.map((comic) => (
                <div
                  key={comic.id}
                  onClick={() => router.push(`/books/${comic.id}`)}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={comic.coverImageUrl}
                      alt={comic.title}
                      className="w-12 h-16 object-cover rounded-lg shadow-sm border dark:border-gray-800"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{comic.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">ID: {comic.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-950/20 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span>{comic.averageRating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal text-xs ml-0.5">({comic.totalRatings || 0})</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Chưa có dữ liệu truyện đánh giá cao.
              </div>
            )}
          </div>
        </div>

        {/* QUICK LINK MANAGEMENT */}
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-6">Liên kết nhanh</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/admin/user-management")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/15 hover:border-blue-200 dark:hover:border-blue-900/30 text-left transition duration-200"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Quản lý người dùng</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Khóa/Mở tài khoản, phân quyền Admin.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => router.push("/admin-books")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/15 hover:border-purple-200 dark:hover:border-purple-900/30 text-left transition duration-200"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Quản lý truyện & chương</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Thêm truyện mới, đăng chương, sửa xóa.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 text-center">
            Mọi hành động quản trị hệ thống sẽ được ghi lại trong nhật ký bảo mật.
          </div>
        </div>
      </div>
    </div>
  );
}
