import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
    id: string
    fullname: string
    email: string
    avatar?: string
    role: 'admin' | 'memeber'
}
const fakeUser: User = {
    id: "1",
    fullname: "Long",
    email: "hlklonga5@gmail.com",
    avatar: "https://www.freepik.com/free-photos-vectors/avatar",
    role: 'memeber'
}
interface UserState {
    user: User | null
    accessToken: string | null
    isAuthenticated: boolean
    // Actions
    setUser: (user: User, token: string) => void
    logout: () => void
    updateAvatar: (newAvatar: string) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: fakeUser,
            accessToken: "tokenfakef",
            isAuthenticated: true,

            setUser: (user, token) => set({
                user,
                accessToken: token,
                isAuthenticated: true
            }),

            logout: () => {
                set({ user: null, accessToken: null, isAuthenticated: false });
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