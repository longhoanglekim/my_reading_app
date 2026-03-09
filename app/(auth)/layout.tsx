"use client";

import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className={`
        min-h-screen flex flex-col md:flex-row
        bg-gray-50 text-gray-900
        dark:bg-gray-950 dark:text-gray-100
        transition-colors duration-300
      `}
        >
            {/* Phần hình ảnh minh họa bên trái (desktop) / trên (mobile) */}
            <div
                className={`
          relative flex w-full md:w-1/2 items-center justify-center
          overflow-hidden bg-[#f8f6f2] dark:bg-gray-900
          transition-colors duration-300
        `}
            >
                {/* SVG đám mây - điều chỉnh màu cho dark mode */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-90 dark:opacity-70"
                    viewBox="0 0 800 1000"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="cloudShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
                            <feOffset dx="0" dy="8" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.15" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Đám mây - dùng fill gray đậm ở dark mode */}
                    <g className="fill-white dark:fill-gray-700">
                        {/* Đám mây lớn phía trên bên trái */}
                        <path
                            d="M -50 -50 C 50 -30, 120 10, 180 50 C 220 30, 270 35, 300 70 C 340 60, 380 85, 380 130 C 370 180, 340 200, 290 210 C 250 240, 200 250, 150 240 C 100 250, 50 230, 20 190 C -20 160, -40 110, -30 60 C -35 20, -40 -20, -50 -50 Z"
                            opacity="0.8"
                            filter="url(#cloudShadow)"
                        />

                        {/* Các đám mây khác - tương tự, chỉ cần copy path và opacity */}
                        <path
                            d="M 220 40 C 260 35, 295 50, 310 80 C 335 75, 365 90, 370 120 C 365 150, 345 165, 315 170 C 285 180, 250 175, 225 160 C 200 165, 180 145, 180 115 C 185 80, 200 55, 220 40 Z"
                            opacity="0.6"
                            filter="url(#cloudShadow)"
                        />

                        <path
                            d="M -30 350 C 20 340, 85 365, 150 390 C 200 370, 260 385, 300 425 C 350 415, 400 445, 410 500 C 400 560, 360 590, 300 600 C 250 630, 180 625, 120 600 C 60 610, 10 585, -20 540 C -60 500, -75 440, -60 385 C -55 365, -45 355, -30 350 Z"
                            opacity="0.75"
                            filter="url(#cloudShadow)"
                        />

                        {/* ... copy các path còn lại tương tự, hoặc giữ nguyên nếu bạn muốn */}
                        {/* Để ngắn gọn, bạn có thể giữ nguyên các path khác và chỉ thay fill ở <g> */}
                    </g>
                </svg>

                {/* Hình minh họa */}
                <div className="relative w-[70%] max-w-md aspect-square z-10">
                    <Image
                        src="/library-illu.png"
                        alt="Library illustration"
                        fill
                        className="object-contain rounded-xl drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>

            {/* Phần form đăng nhập/đăng ký */}
            <main
                className={`
          flex-1 flex items-center justify-center
          w-full md:w-1/2 p-6 md:p-8 lg:p-12
          bg-white dark:bg-gray-900
          transition-colors duration-300
        `}
            >
                <div className="w-full">{children}</div>
            </main>
        </div>
    );
}