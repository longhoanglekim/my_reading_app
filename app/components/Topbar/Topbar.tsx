"use client";

import TopbarItem from "./TopbarItem/TopbarItem";
import ThemeToggle from "../toggle/ThemeToggle";
import LanguageToggle from "../toggle/LanguageToogle";
import { useUserStore } from "@/app/store/userStore";
import { useState } from "react";
import Link from "next/link";
import CButton from "../common/CButton";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const userStore = useUserStore();
  const user = userStore.user;
  const [isOpen, setIsOpen] = useState(false);
  const logout = () => {
    userStore.logout();
  }
  const intl = useIntl();
  const router = useRouter();
  return (
    <header
      className="
        h-16 px-6 flex items-center justify-between
        bg-white/80 backdrop-blur-sm border-b border-gray-200
        dark:bg-gray-950/80 dark:backdrop-blur-md dark:border-gray-800
        text-gray-900 dark:text-gray-100
        shadow-sm dark:shadow-gray-950/40
        transition-colors duration-200
      "
    >
      <h1 className="font-semibold text-lg tracking-tight">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <LanguageToggle />
        <ThemeToggle />

        <TopbarItem>🔔</TopbarItem>
        <div className="flex items-center gap-4">
          {userStore.isAuthenticated ? (
            <div className="relative group">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-lg transition"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">
                    {user?.fullname || "User"}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 ring-2 ring-white dark:ring-gray-900 shadow-sm overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {user?.fullname?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50 
            invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform origin-top-right">

                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-xs text-gray-500">Tài khoản</p>
                  <p className="text-sm font-semibold truncate">{user?.email}</p>
                </div>

                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Thông tin hồ sơ
                </Link>

                <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Cài đặt
                </Link>

                <hr className="my-1 border-gray-100 dark:border-gray-800" />

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP */
            <div className="flex items-center gap-2">

              <CButton
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => router.push("/login")}
              >
                {intl.formatMessage({ id: "auth.title.login" })}
              </CButton>
              <CButton
                variant="ghost"
                onClick={() => router.push("/signup")}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {intl.formatMessage({ id: "auth.title.register" })}
              </CButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}