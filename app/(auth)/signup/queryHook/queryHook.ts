import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { register, registerOtp, verifyEmailOtp, resendEmailOtp, RegisterResponse, MessageResponse } from '../service/service'
import { useNotification } from '@/app/components/providers/NotificationProvider'
import { useUserStore } from '@/app/store/userStore'
import { AxiosError } from 'axios'

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
            // Lưu token vào Zustand store để dùng trong Interceptor
            userStore.setTokens(data.token, "");

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

        onError: (error: AxiosError) => {
            showNotification({
                type: 'error',
                title: 'Đăng ký thất bại',
                message: (error.response?.data as any)?.message || error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.',
            })
        },
    })
}

export const useRegisterOtp = () => {
    const { showNotification } = useNotification()

    return useMutation({
        mutationFn: async ({
            fullName,
            email,
            password,
        }: {
            fullName: string
            email: string
            password: string
        }): Promise<MessageResponse> => registerOtp(fullName, email, password),

        onSuccess: (data: MessageResponse) => {
            showNotification({
                type: 'success',
                title: 'Gửi OTP thành công',
                message: data.message || 'Mã xác thực đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư.',
            })
        },

        onError: (error: AxiosError) => {
            showNotification({
                type: 'error',
                title: 'Yêu cầu OTP thất bại',
                message: (error.response?.data as any)?.message || error.message || 'Có lỗi xảy ra khi gửi mã OTP.',
            })
        },
    })
}

export const useVerifyEmailOtp = () => {
    const { showNotification } = useNotification()
    const router = useRouter()
    const userStore = useUserStore()

    return useMutation({
        mutationFn: async ({
            email,
            otp,
        }: {
            email: string
            otp: string
        }): Promise<RegisterResponse> => verifyEmailOtp(email, otp),

        onSuccess: (data: RegisterResponse) => {
            // Lưu token vào Zustand store để dùng trong Interceptor
            userStore.setTokens(data.token, "");

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
                title: 'Xác thực thành công',
                message: `Chào mừng ${data.user.fullName}! Tài khoản của bạn đã được kích hoạt.`,
            })

            router.push('/dashboard')
        },

        onError: (error: AxiosError) => {
            showNotification({
                type: 'error',
                title: 'Xác thực thất bại',
                message: error.message || 'Mã OTP không chính xác hoặc đã hết hạn.',
            })
        },
    })
}

export const useResendEmailOtp = () => {
    const { showNotification } = useNotification()

    return useMutation({
        mutationFn: async (email: string): Promise<MessageResponse> => resendEmailOtp(email),

        onSuccess: (data: MessageResponse) => {
            showNotification({
                type: 'success',
                title: 'Gửi lại OTP thành công',
                message: data.message || 'Mã OTP mới đã được gửi lại vào email của bạn.',
            })
        },

        onError: (error: AxiosError) => {
            showNotification({
                type: 'error',
                title: 'Gửi lại OTP thất bại',
                message: error.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.',
            })
        },
    })
}