// hooks/useLogin.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getOAuthProviders, login } from '../service/service'
import { useNotification } from '@/app/components/providers/NotificationProvider'
import { useUserStore } from '@/app/store/userStore'
import { AxiosError } from 'axios'

type LoginResponse = {
    token: string
    user: {
        id: number
        email: string
        fullName: string
        role: string
    }
}

export const useLogin = () => {
    const { showNotification } = useNotification()
    const router = useRouter()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }): Promise<LoginResponse> =>
            login(email, password) as Promise<LoginResponse>,

        onSuccess: (data: LoginResponse) => {
            // Lưu token
            console.log("Login successful, received data:", data);
            userStore.setTokens(data.token, "")
            // Lưu thông tin user vào store
            userStore.setUser({
                id: data.user.id.toString(),
                fullname: data.user.fullName,
                email: data.user.email,
                avatar: "",
                role: data.user.role,
            })


            showNotification({
                type: 'success',
                title: 'Đăng nhập thành công',
                message: `Chào mừng ${data.user.fullName}!`,
            })

            router.push('/dashboard')
        },

        onError: (error: AxiosError) => {
            showNotification({
                type: 'error',
                title: 'Đăng nhập thất bại',
                message: (error.response?.data as any)?.message || error.message || 'Email hoặc mật khẩu không đúng',
            })
        },
    })
}

export const useOAuthProviders = () => {
    return useQuery({
        queryKey: ["oauth-providers"],
        queryFn: getOAuthProviders,
    })
}