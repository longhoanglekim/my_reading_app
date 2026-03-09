"use client";

import React from "react";
import clsx from "clsx";

type InputVariant = "outline" | "filled" | "ghost" | "link";

interface CInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  variant?: InputVariant;
}

const variantStyles: Record<InputVariant, string> = {
  outline: `
    border border-gray-300 bg-white text-gray-900
    placeholder:text-gray-400
    focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30
    dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
    dark:placeholder:text-gray-500
    dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/30
  `,
  filled: `
    border border-transparent bg-gray-100 text-gray-900
    placeholder:text-gray-500
    focus-within:bg-gray-200 focus-within:ring-2 focus-within:ring-blue-500/30
    dark:bg-gray-700 dark:text-gray-100
    dark:placeholder:text-gray-400
    dark:focus-within:bg-gray-600 dark:focus-within:ring-blue-400/30
  `,
  ghost: `
    border-b border-gray-300 bg-transparent text-gray-900
    placeholder:text-gray-400
    focus-within:border-blue-500 focus-within:ring-0
    dark:border-gray-600 dark:text-gray-100
    dark:placeholder:text-gray-500
    dark:focus-within:border-blue-400
  `,
  link: `
    border-none bg-transparent underline text-blue-600 p-0
    hover:text-blue-800
    dark:text-blue-400 dark:hover:text-blue-300
  `,
};

export default function CInput({
  label,
  error,
  helperText,
  prefix,
  suffix,
  variant = "outline",
  className,
  ...props
}: CInputProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* label */}
      {label && (
        <label
          className={`
            text-md font-medium
            text-gray-700 dark:text-gray-300 
          `}
        >
          {label}
        </label>
      )}

      {/* input wrapper */}
      <div
        className={clsx(
          "flex items-center rounded-md transition-colors duration-200 py-0",
          variant !== "link" && "focus-within:ring-2",
          variantStyles[variant],
          error && `
            border-red-500 focus-within:ring-red-500/30
            dark:border-red-400 dark:focus-within:ring-red-400/30
          `,
          className
        )}
      >
        {/* prefix */}
        {prefix && (
          <span
            className={`
              pl-3 text-gray-400
              dark:text-gray-500
            `}
          >
            {prefix}
          </span>
        )}

        {/* input */}
        <input
          className={clsx(
            "flex-1 bg-transparent outline-none",
            variant !== "link" && [
              "px-2 py-2 text-sm",
              "md:py-2 md:text-base",
              "lg:py-2",
            ],
            // Thêm placeholder dark mode (nếu chưa có trong variant)
            "placeholder:text-gray-400 dark:placeholder:text-gray-500"
          )}
          {...props}
        />

        {/* suffix */}
        {suffix && (
          <span
            className={`
              pr-3 text-gray-400
              dark:text-gray-500
            `}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* error */}
      {error && (
        <span className="text-sm text-red-500 dark:text-red-400">
          {error}
        </span>
      )}

      {/* helper */}
      {!error && helperText && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </span>
      )}
    </div>
  );
}