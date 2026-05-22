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
        title: intl.formatMessage({ id: "adminOverview.notification.accessDeniedTitle" }),
        message: intl.formatMessage({ id: "adminOverview.notification.accessDeniedMessage" }),
      });
      router.push("/dashboard");
    }
  }, [user, isAdmin, router, showNotification, intl]);

  // Fetch summary stats
  const { data: summary, isLoading, isError, refetch } = useAdminDashboardSummary();

  // Reindex mutation
  const { mutate: triggerReindex, isPending: isReindexing } = useTriggerReindex();

  const handleReindex = () => {
    triggerReindex(undefined, {
      onSuccess: () => {
        showNotification({
          type: "success",
          title: intl.formatMessage({ id: "adminOverview.notification.reindexSuccessTitle" }),
          message: intl.formatMessage({ id: "adminOverview.notification.reindexSuccessMessage" }),
        });
        refetch();
      },
      onError: (error: Error) => {
        showNotification({
          type: "error",
          title: intl.formatMessage({ id: "adminOverview.notification.reindexErrorTitle" }),
          message: error.message || intl.formatMessage({ id: "adminOverview.notification.reindexErrorMessage" }),
        });
      }
    });
  };

  if (!user) {
    return <div className="text-center py-10 font-medium text-gray-500">{intl.formatMessage({ id: "adminOverview.loadingUser" })}</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2">{intl.formatMessage({ id: "adminOverview.noAccessTitle" })}</h1>
        <p className="text-gray-600 dark:text-gray-400">{intl.formatMessage({ id: "adminOverview.noAccessDesc" })}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">{intl.formatMessage({ id: "adminOverview.loadingStats" })}</span>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="text-center py-10 text-red-500 font-medium flex flex-col items-center gap-4">
        <span>{intl.formatMessage({ id: "adminOverview.errorFetchStats" })}</span>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm"
        >
          {intl.formatMessage({ id: "adminOverview.retry" })}
        </button>
      </div>
    );
  }

  const statCards = [
    {
      titleId: "adminOverview.stats.totalComics",
      value: summary.totalComics,
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      titleId: "adminOverview.stats.totalChapters",
      value: summary.totalChapters,
      icon: Layers,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      titleId: "adminOverview.stats.totalPages",
      value: summary.totalPages,
      icon: FileText,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      titleId: "adminOverview.stats.totalHistories",
      value: summary.totalReadingHistories,
      icon: History,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-600 dark:text-teal-400"
    },
    {
      titleId: "adminOverview.stats.totalUsers",
      value: summary.totalUsers,
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      titleId: "adminOverview.stats.activeUsers",
      value: summary.activeUsers,
      icon: UserCheck,
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      titleId: "adminOverview.stats.lockedUsers",
      value: summary.lockedUsers,
      icon: UserX,
      color: "from-red-500 to-rose-600",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      titleId: "adminOverview.stats.totalRatings",
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
          <h1 className="text-3xl font-extrabold tracking-tight">{intl.formatMessage({ id: "adminOverview.title" })}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {intl.formatMessage({ id: "adminOverview.subtitle" })}
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
            {isReindexing 
              ? intl.formatMessage({ id: "adminOverview.reindexing" }) 
              : intl.formatMessage({ id: "adminOverview.reindexButton" })}
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
                {intl.formatMessage({ id: card.titleId })}
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
              {intl.formatMessage({ id: "adminOverview.topRatedComics" })}
            </h2>
            <button
              onClick={() => router.push("/admin-books")}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              {intl.formatMessage({ id: "adminOverview.manageComics" })}
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
                {intl.formatMessage({ id: "adminOverview.noTopComics" })}
              </div>
            )}
          </div>
        </div>

        {/* QUICK LINK MANAGEMENT */}
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-6">{intl.formatMessage({ id: "adminOverview.quickLinks" })}</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/admin/user-management")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/15 hover:border-blue-200 dark:hover:border-blue-900/30 text-left transition duration-200"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{intl.formatMessage({ id: "adminOverview.manageUsersTitle" })}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{intl.formatMessage({ id: "adminOverview.manageUsersDesc" })}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => router.push("/admin-books")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/15 hover:border-purple-200 dark:hover:border-purple-900/30 text-left transition duration-200"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{intl.formatMessage({ id: "adminOverview.manageComicsTitle" })}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{intl.formatMessage({ id: "adminOverview.manageComicsDesc" })}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 text-center">
            {intl.formatMessage({ id: "adminOverview.footerNote" })}
          </div>
        </div>
      </div>
    </div>
  );
}
