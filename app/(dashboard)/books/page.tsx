"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BooksRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paramsStr = searchParams.toString();
    const targetUrl = `/library${paramsStr ? `?${paramsStr}` : ""}`;
    router.replace(targetUrl);
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-500 font-medium animate-pulse">
        Redirecting to library...
      </div>
    </div>
  );
}
