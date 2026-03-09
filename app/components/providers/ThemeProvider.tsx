"use client";

import { ThemeProvider } from "next-themes";
import { IntlProvider } from "react-intl";
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

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleContext.Provider value={{ locale, setLocale }}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          {children}
        </IntlProvider>
      </LocaleContext.Provider>
    </ThemeProvider>
  );
}