// components/ui/NotificationProvider.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Notification, { NotificationType } from '../common/Notification'

type NotificationItem = {
    id: string
    type: NotificationType
    title: string
    message?: string
    duration?: number
}

type NotificationContextType = {
    showNotification: (props: Omit<NotificationItem, 'id'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])

    const showNotification = ({ type, title, message, duration = 4000 }: Omit<NotificationItem, 'id'>) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)

        setNotifications((prev) => [...prev, { id, type, title, message, duration }])
    }

    const closeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    }

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            {/* Notification Container */}
            <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3">
                {notifications.map((notif) => (
                    <Notification
                        key={notif.id}
                        id={notif.id}
                        type={notif.type}
                        title={notif.title}
                        message={notif.message}
                        duration={notif.duration}
                        onClose={closeNotification}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    )
}

// Hook để dùng ở bất kỳ component nào
export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider')
    }
    return context
}