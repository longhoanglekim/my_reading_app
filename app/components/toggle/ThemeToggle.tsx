"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

export default function ThemeToggle() {
    const intl = useIntl();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="w-9 h-9 rounded-md bg-gray-200 dark:bg-gray-800 transition-colors"
                disabled
                aria-hidden="true"
            />
        ); // placeholder đơn giản, giữ kích thước
    }

    const isDark = resolvedTheme === "dark";
    const label = intl.formatMessage({
        id: isDark ? "themeToggle.switchToLight" : "themeToggle.switchToDark",
    });

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            aria-label={label}
            title={label}
        >
            {isDark ? "☀️" : "🌙"}
        </button>
    );
}