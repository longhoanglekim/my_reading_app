"use client";

import { ThemeProvider } from "next-themes";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useState, useEffect, useMemo } from "react";

import en from "@/app/langs/en.json";
import vi from "@/app/langs/vi.json";

export const LocaleContext = createContext<any>(null);

interface NestedMessages {
  [key: string]: string | NestedMessages;
}

function flattenMessages(nestedMessages: NestedMessages, prefix = ''): Record<string, string> {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(messages, flattenMessages(value as NestedMessages, prefixedKey));
    }
    return messages;
  }, {} as Record<string, string>);
}

const allMessages = { en, vi };

export default function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<"en" | "vi">("vi");
  const [mounted, setMounted] = useState(false);

  // 1. Chỉ chạy ở Client sau khi component đã mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("app_locale") as "en" | "vi";
    if (savedLocale && (savedLocale === "en" || savedLocale === "vi")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocale(savedLocale);
    }
    setMounted(true);
  }, []);

  // 2. Hàm đổi ngôn ngữ kèm lưu localStorage
  const handleSetLocale = (newLocale: "en" | "vi") => {
    setLocale(newLocale);
    localStorage.setItem("app_locale", newLocale);
  };

  // 3. Dùng useMemo để không phải flatten lại mỗi lần render không cần thiết
  const flattenedMessages = useMemo(() => {
    return flattenMessages(allMessages[locale] as unknown as NestedMessages);
  }, [locale]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  // 4. Ngăn chặn Hydration Mismatch
  // Trong khi chờ đọc LocalStorage, không render IntlProvider để tránh nháy chữ
  if (!mounted) {
    return null; // Hoặc một loading spinner đơn giản
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
        <IntlProvider locale={locale} messages={flattenedMessages} onError={() => { }}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </IntlProvider>
      </LocaleContext.Provider>
    </ThemeProvider>
  );
}