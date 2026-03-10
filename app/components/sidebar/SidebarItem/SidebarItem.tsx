"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  label: string;
}

export default function SidebarItem({ href, label }: Props) {
  const pathname = usePathname();
  const isActive = includesPath(pathname, href) ||
    (href === '/dashboard' && pathname.startsWith('/books'));

  function includesPath(pathname: string, href: string) {
    const normalizedPathname = pathname.endsWith("/") ? pathname : pathname + "/";
    const normalizedHref = href.endsWith("/") ? href : href + "/";
    return normalizedPathname.startsWith(normalizedHref);
  }

  return (
    <Link
      href={href}
      className={`
        flex items-center px-4 py-2.5 rounded-lg transition-all duration-200
        text-gray-700 hover:bg-gray-100 hover:text-gray-900
        dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white
        ${isActive
          ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
          : ""
        }
      `}
    >
      {label}
    </Link>
  );
}