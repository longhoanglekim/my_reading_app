// components/ui/Notification.tsx
'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationProps {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
}

const colors = {
  success: 'border-green-500 bg-green-50 dark:bg-green-950/30',
  error: 'border-red-500 bg-red-50 dark:bg-red-950/30',
  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
}

export default function Notification({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full
        ${colors[type]} transition-all duration-300
      `}
    >
      <div className="mt-0.5">{icons[type]}</div>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        {message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{message}</p>}
      </div>

      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}