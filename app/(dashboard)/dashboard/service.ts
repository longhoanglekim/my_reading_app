import { BookOverview } from "./type";
import { BookOpen, Users, Calendar, Settings } from 'lucide-react'

export interface IBooksParams {
    page: number;
    size: number;
}
// Dữ liệu giả lập stats
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

// Sách đọc gần đây (thêm id)
const recentBooks: BookOverview[] = [
    { id: '123', title: 'Nhà Giả Kim', author: 'Paulo Coelho', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d467e?w=800' },
    { id: '124', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800' },
    { id: '125', title: 'Atomic Habits', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800' },
]
const favoriteBooks: BookOverview[] = [
    { id: '126', title: 'Nhà Giả Kim', author: 'Paulo Coelho', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d467e?w=800' },
    { id: '127', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800' },
    { id: '128', title: 'Atomic Habits', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800' },
]
export function getRecentBooks(params: IBooksParams): BookOverview[] | undefined {
    try {
        // const data = axios.get data
        return recentBooks;
    } catch (e) {
        console.log(e);
    }
}

