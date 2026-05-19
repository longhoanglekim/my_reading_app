"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/app/components/providers/NotificationProvider";
import { useUserStore } from "@/app/store/userStore";
import { getMe } from "@/app/(auth)/login/service/service";

export default function OAuth2SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasRun = useRef(false);

  const { showNotification } = useNotification();

  const setTokens = useUserStore((state) => state.setTokens);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;

    const handleOAuthLogin = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        // save localStorage trước để interceptor đọc được
        localStorage.setItem("accessToken", token);

        // save zustand
        setTokens(token, "");

        // lấy thông tin user
        const me = await getMe();

        // set user
        setUser({
          id: me.id.toString(),
          fullname: me.fullName,
          email: me.email,
          avatar: "",
          role: me.role,
        });

        showNotification({
          type: "success",
          title: "Đăng nhập thành công",
          message: `Chào mừng ${me.fullName}!`,
        });

        router.replace("/dashboard");
      } catch (error) {
        console.error("OAuth2 login failed:", error);

        showNotification({
          type: "error",
          title: "Đăng nhập thất bại",
          message: "Không thể lấy thông tin người dùng",
        });

        router.replace("/login");
      }
    };

    handleOAuthLogin();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" />

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Đang đăng nhập với Google...
        </p>
      </div>
    </div>
  );
}
