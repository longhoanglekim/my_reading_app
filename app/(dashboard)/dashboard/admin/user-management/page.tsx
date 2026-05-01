'use client'

import { useEffect, useState } from 'react'

type User = {
    id: number
    name: string
    email: string
    role: 'USER' | 'ADMIN'
    status: 'ACTIVE' | 'BANNED'
}

const PAGE_SIZE = 8

// 🔥 MOCK DATA
const ALL_USERS: User[] = [
    { id: 1, name: 'Nguyen Van A', email: 'a@gmail.com', role: 'USER', status: 'ACTIVE' },
    { id: 2, name: 'Tran Thi B', email: 'b@gmail.com', role: 'ADMIN', status: 'ACTIVE' },
    { id: 3, name: 'Le Van C', email: 'c@gmail.com', role: 'USER', status: 'BANNED' },
    { id: 4, name: 'Pham D', email: 'd@gmail.com', role: 'USER', status: 'ACTIVE' },
    { id: 5, name: 'Hoang E', email: 'e@gmail.com', role: 'USER', status: 'ACTIVE' },
    { id: 6, name: 'Vo F', email: 'f@gmail.com', role: 'ADMIN', status: 'ACTIVE' },
    { id: 7, name: 'Dang G', email: 'g@gmail.com', role: 'USER', status: 'BANNED' },
    { id: 8, name: 'Bui H', email: 'h@gmail.com', role: 'USER', status: 'ACTIVE' },
    { id: 9, name: 'Ngo I', email: 'i@gmail.com', role: 'USER', status: 'ACTIVE' },
    { id: 10, name: 'Do K', email: 'k@gmail.com', role: 'USER', status: 'ACTIVE' },
    { id: 11, name: 'Pham L', email: 'l@gmail.com', role: 'ADMIN', status: 'ACTIVE' },
    { id: 12, name: 'Le M', email: 'm@gmail.com', role: 'USER', status: 'BANNED' },
]

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [filtered, setFiltered] = useState<User[]>([])
    const [page, setPage] = useState(1)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // 🔥 fake fetch
    useEffect(() => {
        setIsLoading(true)

        setTimeout(() => {
            setUsers(ALL_USERS)
            setFiltered(ALL_USERS)
            setIsLoading(false)
        }, 300)
    }, [])

    // 🔥 search
    const handleSearch = () => {
        const q = input.toLowerCase()

        const result = ALL_USERS.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
        )

        setFiltered(result)
        setPage(1)
    }

    // 🔥 update role (fake)
    const updateRole = (userId: number, role: User['role']) => {
        const updated = users.map((u) =>
            u.id === userId ? { ...u, role } : u
        )
        setUsers(updated)
        setFiltered(updated)
    }

    // 🔥 update status (fake)
    const updateStatus = (userId: number, status: User['status']) => {
        const updated = users.map((u) =>
            u.id === userId ? { ...u, status } : u
        )
        setUsers(updated)
        setFiltered(updated)
    }

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {/* SEARCH */}
            <div className="flex gap-3 mb-6 max-w-md">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search user..."
                    className="flex-1 border px-3 py-2 rounded-lg"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* LOADING */}
            {isLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-gray-500">No users found</div>
            ) : (
                <>
                    {/* TABLE */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-sm">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginated.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>

                                        {/* ROLE */}
                                        <td className="p-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) =>
                                                    updateRole(user.id, e.target.value as User['role'])
                                                }
                                                className="border rounded px-2 py-1"
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-sm ${user.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="p-3">
                                            {user.status === 'ACTIVE' ? (
                                                <button
                                                    onClick={() => updateStatus(user.id, 'BANNED')}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Ban
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateStatus(user.id, 'ACTIVE')}
                                                    className="text-green-600 hover:underline"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 border rounded ${page === pageNum ? 'bg-blue-600 text-white' : ''
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}