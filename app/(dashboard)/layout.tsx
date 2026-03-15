'use client'

import Sidebar from "@/app/components/sidebar/Sidebar";
import Topbar from "@/app/components/Topbar/Topbar";
import CInput from "../components/common/CInput";
import { useState } from "react";
import CButton from "../components/common/CButton";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('type', 'query');
    params.set('query', query.trim());

    const newUrl = `/books?${params.toString()}`;

    router.push(newUrl, { scroll: false });  // replace thay vì push để không thêm history
    router.refresh();  // ← quan trọng: force Next.js re-fetch server components và re-apply layout
  };
  return (
    <div className="relative min-h-screen bg-[#E8E0D3] text-gray-900 dark:bg-[#2D2D2D] dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar fixed bên trái, full height, không di chuyển khi scroll */}
      <div className="fixed inset-y-0 left-0 z-30 lg:block lg:w-64 lg:shrink-0">
        <Sidebar />
      </div>

      {/* Nội dung chính */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar (có thể fixed nếu bạn muốn) */}
        <Topbar />

        {/* Main content - scroll độc lập */}
        <main className="flex flex-1 overflow-y-auto bg-white/70 dark:bg-gray-900/70 transition-colors duration-200">
          <div className="flex-1 flex justify-center items-start min-h-full px-4 md:px-6 lg:px-8">
            <div className="w-full max-w-5xl">  {/* thay max-w-7xl bằng max-w-5xl hoặc bỏ hẳn */}
              {/* Search bar nếu cần */}
              <div className="flex flex-row gap-4 justify-center w-full mb-6 md:mb-8 max-w-md mx-auto mt-5">
                <CInput
                  variant='outline'
                  className='flex-1 h-10'
                  placeholder='Nhập tên sách,tác giả, thể loại,...'
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />
                <CButton variant="primary" className="h-10" onClick={handleSearch}>Tìm kiếm</CButton>
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