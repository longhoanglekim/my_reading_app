'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import SidebarItem from './SidebarItem/SidebarItem'

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (mobile) setIsOpen(false)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <>
            {/* Toggle button on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={isOpen ? 'Đóng sidebar' : 'Mở sidebar'}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay on mobile */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-gray-50 border-r border-gray-200 dark:bg-gray-950 dark:border-gray-800
          flex flex-col
          h-screen overflow-hidden
        `}
            >
                <div className="flex flex-col flex-1 overflow-y-auto">
                    {/* Mobile header */}
                    <div className="flex items-center justify-between mb-6 p-5 lg:hidden">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-600 dark:text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Desktop header */}
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 hidden lg:block px-5 pt-5">
                        Dashboard
                    </h2>

                    <nav className="flex flex-col gap-1.5 px-5">
                        <SidebarItem href="/dashboard" label="Overview" />
                        <SidebarItem href="/dashboard/users" label="Users" />
                        <SidebarItem href="/dashboard/events" label="Events" />
                        <SidebarItem href="/dashboard/settings" label="Settings" />
                    </nav>

                    <div className="mt-auto pt-6 px-5 pb-5 border-t border-gray-200 dark:border-gray-800">
                        <SidebarItem href="/logout" label="Đăng xuất" />
                    </div>
                </div>
            </aside>
        </>
    )
}