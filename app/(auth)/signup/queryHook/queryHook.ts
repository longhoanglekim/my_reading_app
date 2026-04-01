// hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login } from '../service/service'
import { useNotification } from '@/app/components/providers/NotificationProvider'
import { useUserStore } from '@/app/store/userStore'
type LoginResponse = {
    id: string
    fullname: string
    email: string
    avatar: string
    role: string
    accessToken: string
    refreshToken: string
    message?: string
}

export const useLogin = () => {
    const { showNotification } = useNotification()
    const router = useRouter()
    const userStore = useUserStore();
    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }): Promise<LoginResponse> =>
            await login(email, password) as Promise<LoginResponse>,

        onSuccess: (data: LoginResponse) => {
            // Lưu token
            localStorage.setItem('accessToken', data.accessToken);

            localStorage.setItem('refreshToken', data.refreshToken)

            userStore.setUser({
                id: data.id,
                fullname: data.fullname,
                email: data.email,
                avatar: data.avatar,
                role: data.role
            });
            showNotification({
                type: 'success',
                title: 'Đăng nhập thành công',
                message: `Chào mừng ${data.fullname}!`,
            })

            router.push('/dashboard')
        },

        onError: (error: any) => {
            showNotification({
                type: 'error',
                title: 'Đăng nhập thất bại',
                message: error.message || 'Email hoặc mật khẩu không đúng',
            })
        },
    })
}