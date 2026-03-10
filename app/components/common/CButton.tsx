"use client";

import React from "react";
import clsx from "clsx";
import { ButtonVariant } from "@/app/const/style";

type ButtonAction = "delete";

interface CButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  fullWidth?: boolean;
  loading?: boolean;
  action?: ButtonAction;
}

const variantStyles: Record<string, string> = {
  [ButtonVariant.primary]: `
    bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
    dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-500
  `,
  [ButtonVariant.secondary]: `
    bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800
    dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500
  `,
  [ButtonVariant.danger]: `
    bg-red-600 text-white hover:bg-red-700 active:bg-red-800
    dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-500
  `,
  [ButtonVariant.outline]: `
    border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200
    dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:border-gray-500 dark:active:bg-gray-700
  `,
  [ButtonVariant.ghost]: `
    hover:bg-gray-100 active:bg-gray-200
    dark:hover:bg-gray-800 dark:active:bg-gray-700
  `,
  [ButtonVariant.link]: `text-blue-700 bg-blue-100 hover:bg-blue-200 active:bg-blue-300
    dark:text-gray-200 dark:hover:bg-blue-800 dark:active:bg-blue-700`

};

export default function CButton({
  variant = "primary",
  fullWidth = false,
  loading = false,
  action,
  className,
  children,
  onClick,
  disabled,
  ...props
}: CButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;

    if (action === "delete") {
      const confirmed = window.confirm("Bạn có chắc muốn xóa không?");
      if (!confirmed) return;
    }

    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={clsx(
        "rounded-md font-medium transition flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        "px-3 py-2 text-sm md:px-4 md:py-2.5 md:text-sm lg:px-6 lg:py-3 lg:text-base",

        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}