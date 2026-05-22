"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import HttpRequest from "@/app/config/auth";
import { useIntl } from "react-intl";

export default function LogoutPage() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const intl = useIntl();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    const performLogout = async () => {
      try {
        // Gọi API logout ở backend để thu hồi token và xóa cookie COMIC_AUTH
        await HttpRequest.post("/auth/logout");
      } catch (error) {
        console.error("Backend logout failed:", error);
      } finally {
        // Luôn dọn dẹp state ở client và chuyển hướng về trang login
        logout();
        router.replace("/login");
      }
    };

    performLogout();
  }, [router, logout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex flex-col items-center max-w-sm p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 text-center animate-fade-in">
        {/* Modern Premium Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
        </div>
        
        <h2 className="text-xl font-bold tracking-tight mb-2 animate-pulse">
          {intl.formatMessage({ id: "topbar.logout" }) || "Đăng xuất"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Đang bảo mật và đăng xuất khỏi phiên làm việc...
        </p>
      </div>
    </div>
  );
}
