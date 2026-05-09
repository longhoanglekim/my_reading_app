// hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { register } from '../service/service'
import { useNotification } from '@/app/components/providers/NotificationProvider'
import { useUserStore } from '@/app/store/userStore'

type RegisterResponse = {
    token: string
    user: {
        id: number
        email: string
        fullName: string
        role: string
    }
}

export const useRegister = () => {
    const { showNotification } = useNotification()
    const router = useRouter()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: async ({
            fullName,
            email,
            password,
        }: {
            fullName: string
            email: string
            password: string
        }): Promise<RegisterResponse> => register(fullName, email, password),

        onSuccess: (data: RegisterResponse) => {
            // Lưu token
            localStorage.setItem('accessToken', data.token)

            // Lưu thông tin user vào store
            userStore.setUser({
                id: data.user.id.toString(),
                fullname: data.user.fullName,
                email: data.user.email,
                avatar: "",
                role: data.user.role
            })

            showNotification({
                type: 'success',
                title: 'Đăng ký thành công',
                message: `Chào mừng ${data.user.fullName}!`,
            })

            router.push('/dashboard')
        },

        onError: (error: any) => {
            showNotification({
                type: 'error',
                title: 'Đăng ký thất bại',
                message: error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.',
            })
        },
    })
}