"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { getMe } from "./service";

export default function OAuth2SuccessPage() {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await getMe();

        setUser({
          id: me.id.toString(),
          fullname: me.fullName,
          email: me.email,
          avatar: "",
          role: me.role,
        });

        router.replace("/dashboard");
      } catch (e) {
        console.error(e);
        router.replace("/login");
      }
    };

    init();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>
  );
}
