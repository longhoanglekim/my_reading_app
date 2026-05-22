import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
    id: string
    fullname: string
    email: string
    avatar?: string
    role: string
}
interface UserState {
    user: User | null
    isAuthenticated: boolean
    accessToken: string
    refreshToken: string
    // Actions
    setUser: (user: User) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    logout: () => void
    updateAvatar: (newAvatar: string) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: "",
            isAuthenticated: false,
            refreshToken: "",
            setUser: (user) => set({
                user,
                isAuthenticated: true
            }),
            setTokens: (accessToken: string, refreshToken: string) => set({
                accessToken,
                refreshToken
            }),

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    accessToken: "",
                    refreshToken: ""
                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            },

            updateAvatar: (newAvatar) => set((state) => ({
                user: state.user ? { ...state.user, avatar: newAvatar } : null
            })),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)