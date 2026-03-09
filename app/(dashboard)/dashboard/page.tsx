'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Users, Calendar, Settings } from 'lucide-react' // Cài: npm i lucide-react
import CInput from '@/app/components/common/CInput'
import { BookOverview } from './type'

export default function Dashboard() {
    const router = useRouter()

    // Dữ liệu giả lập (sau này thay bằng API)
    const stats = [
        {
            title: 'Sách đã đọc',
            value: '1,234',
            change: '+12.5%',
            icon: BookOpen,
            color: 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300',
            hover: 'hover:bg-amber-200 dark:hover:bg-amber-900/50',
        },
        {
            title: 'Người dùng hoạt động',
            value: '567',
            change: '+8.3%',
            icon: Users,
            color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300',
            hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/50',
        },
        {
            title: 'Sự kiện sắp tới',
            value: '12',
            change: '+4.2%',
            icon: Calendar,
            color: 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300',
            hover: 'hover:bg-green-200 dark:hover:bg-green-900/50',
        },
        {
            title: 'Cài đặt đang chờ',
            value: '5',
            change: '0%',
            icon: Settings,
            color: 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300',
            hover: 'hover:bg-purple-200 dark:hover:bg-purple-900/50',
        },
    ]

    const recentBooks: BookOverview[] = [
        { title: 'Nhà Giả Kim', author: 'Paulo Coelho', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d467e?w=800' },
        { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800' },
        { title: 'Atomic Habits', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800' },
    ]

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <CInput variant='outline' className='w-2/3' placeholder='Nhập tên sách,tác giả, thể loại,...' />
            {/* Main content */}
            <main className="max-w-7xl mx-auto px-0 py-8">
                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`
                rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800
                ${stat.color} ${stat.hover}
                transition-all duration-200 cursor-pointer
              `}
                            onClick={() => router.push('/dashboard/stats')} // Ví dụ chuyển trang
                        >
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className="w-8 h-8 opacity-80" />
                                <span className="text-sm font-medium">{stat.change}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent books */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Sách gần đây</h2>
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                            Xem tất cả →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recentBooks.map((book, index) => (
                            <div
                                key={index}
                                className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="aspect-[1] relative">
                                    <img
                                        src={book.cover}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick actions */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Hành động nhanh</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left">
                            <h3 className="text-lg font-semibold mb-2">Thêm sách mới</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Thêm vào thư viện cá nhân</p>
                        </button>
                        <button className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors text-left">
                            <h3 className="text-lg font-semibold mb-2">Tạo sự kiện đọc sách</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Mời bạn bè cùng đọc</p>
                        </button>
                        <button className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-left">
                            <h3 className="text-lg font-semibold mb-2">Cài đặt tài khoản</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cập nhật thông tin</p>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}