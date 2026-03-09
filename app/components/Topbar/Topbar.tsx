"use client";

import TopbarItem from "./TopbarItem/TopbarItem";
import ThemeToggle from "../toggle/ThemeToggle";
import LanguageToggle from "../toggle/LanguageToogle";

export default function Topbar() {
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

        <TopbarItem>Long</TopbarItem>

        <div
          className="
            w-8 h-8 rounded-full
            bg-gradient-to-br from-gray-300 to-gray-400
            dark:from-gray-700 dark:to-gray-600
            ring-1 ring-gray-200/70 dark:ring-gray-700/70
          "
        />
      </div>
    </header>
  );
}