import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
    id: string
    fullname: string
    email: string
    avatar?: string
    role: string
}
const fakeUser: User = {
    id: "1",
    fullname: "LongHoang",
    email: "hlklonga5@gmail.com",
    avatar: "data:image/png;base64,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",
    role: 'admin'
}
interface UserState {
    user: User | null
    isAuthenticated: boolean
    // Actions
    setUser: (user: User) => void
    logout: () => void
    updateAvatar: (newAvatar: string) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: fakeUser,
            accessToken: "tokenfakedf",
            isAuthenticated: true,
            refreshToken: "refreshtokenfakedf",
            setUser: (user) => set({
                user,
                isAuthenticated: true
            }),

            logout: () => {
                set({ user: null, isAuthenticated: false });
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