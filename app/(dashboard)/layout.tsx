'use client'

import Sidebar from "@/app/components/sidebar/Sidebar";
import Topbar from "@/app/components/Topbar/Topbar";
import CInput from "../components/common/CInput";
import { useState } from "react";
import CButton from "../components/common/CButton";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const intl = useIntl();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('type', 'query');
    params.set('query', query.trim());

    const newUrl = `/books?${params.toString()}`;

    router.push(newUrl, { scroll: false });
    router.refresh();
  };
  return (
    <div className="relative min-h-screen bg-[#E8E0D3] text-gray-900 dark:bg-[#2D2D2D] dark:text-gray-100 transition-colors duration-300">
      <div className="fixed inset-y-0 left-0 z-30 lg:block lg:w-64 lg:shrink-0">
        <Sidebar />
      </div>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex flex-1 overflow-y-auto bg-white/70 dark:bg-gray-900/70 transition-colors duration-200">
          <div className="flex-1 flex justify-center items-start min-h-full px-4 md:px-6 lg:px-8">
            <div className="w-full max-w-5xl">

              <div className="flex flex-row gap-4 justify-center w-full mb-2 md:mb-4 max-w-md mx-auto mt-2">
                <CInput
                  variant='outline'
                  className='flex-1 h-10'
                  placeholder={intl.formatMessage({ id: "dashboard.searchBarPlaceholder" })}
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />
                <CButton variant="primary" className="h-10 whitespace-nowrap" onClick={handleSearch} >{intl.formatMessage({ id: "common.search" })}</CButton>
              </div>

              {children}
            </div>
          </div>
        </main>

        {/* Footer (nếu cần, tránh nền thừa dưới cùng) */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025 My Reading App. All rights reserved.
        </footer>
      </div>
    </div>
  );
}