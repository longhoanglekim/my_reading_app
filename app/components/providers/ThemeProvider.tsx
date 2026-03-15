// app/Providers.tsx  (hoặc app/providers.tsx)
"use client";

import { ThemeProvider } from "next-themes";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createContext, useState } from "react";

import en from "@/app/langs/en.json";
import vi from "@/app/langs/vi.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LocaleContext = createContext<any>(null);

const messages = {
  en,
  vi,
};

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<"en" | "vi">("vi");

  // Tạo QueryClient chỉ 1 lần (dùng useState để tránh tạo mới mỗi render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 phút, khớp với hook của bạn
            gcTime: 10 * 60 * 1000,   // giữ cache 10 phút
            retry: 1,                 // retry 1 lần nếu fail
            // refetchOnWindowFocus: false, // nếu không muốn refetch khi focus tab
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleContext.Provider value={{ locale, setLocale }}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <QueryClientProvider client={queryClient}>
            {children}
            {/* Devtools: chỉ hiện ở development, có thể toggle bằng phím '?' */}

          </QueryClientProvider>
        </IntlProvider>
      </LocaleContext.Provider>
    </ThemeProvider>
  );
}