"use client";

import { useContext } from "react";
import { LocaleContext } from "@/app/components/providers/ThemeProvider";

export default function LanguageToggle() {
    const { locale, setLocale } = useContext(LocaleContext);

    const toggleLanguage = () => {
        setLocale(locale === "vi" ? "en" : "vi");
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-2 py-1 text-sm border rounded"
        >
            {locale === "vi" ? "EN" : "VI"}
        </button>
    );
}