"use client";

import React from "react";
import clsx from "clsx";

type FormVariant =
    | "default"
    | "auth"
    | "card"
    | "modal";

interface CFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    variant?: FormVariant;
    loading?: boolean;
    title?: string;
    description?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const variantStyles: Record<FormVariant, string> = {
    default: "space-y-4",

    auth: `
    space-y-5 p-8 rounded-xl shadow-md w-full
    bg-white border border-gray-200 text-gray-900
    dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:shadow-gray-950/30
  `,

    card: `
    space-y-4 p-6 rounded-lg shadow
    bg-white border border-gray-200 text-gray-900
    dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:shadow-gray-950/20
  `,

    modal: `
    space-y-4 p-6 rounded-lg
    bg-white border border-gray-200 text-gray-900
    dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100
  `,
};

export default function CForm({
    children,
    variant = "default",
    className,
    loading = false,
    title,
    description,
    onSubmit,
    ...props
}: CFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (loading) {
            e.preventDefault();
            return;
        }
        onSubmit?.(e);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={clsx(
                variantStyles[variant],
                loading && "opacity-60 pointer-events-none",
                "transition-colors duration-200",
                className,
            )}
            {...props}
        >
            {title && (
                <div className="space-y-1 mb-10">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>
            )}

            {children}
        </form>
    );
}