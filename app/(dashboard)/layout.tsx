'use client'

import Sidebar from "@/app/components/sidebar/Sidebar";
import Topbar from "@/app/components/Topbar/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <main className="flex-1 overflow-y-auto bg-white/70 dark:bg-gray-900/70 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
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