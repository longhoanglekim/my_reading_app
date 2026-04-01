// api/auth.ts
import { User } from "@/app/store/userStore"

const fakeUserData: User = {
    id: "1",
    fullname: "LongHoang",
    email: "hlklonga5@gmail.com",
    avatar: "data:image/png;base64,...",   // giữ nguyên avatar của bạn
    role: 'memeber'
}

export const login = async (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === "hlklonga5@gmail.com" && password === "123456") {
                resolve({
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fakejwt1234567890abcdef1234567890",
                    user: {
                        id: parseInt(fakeUserData.id),
                        email: fakeUserData.email,
                        fullName: fakeUserData.fullname,     
                        role: fakeUserData.role.toUpperCase() 
                    }
                })
            } else {
                reject(new Error("Invalid email or password"))
            }
        }, 1000)
    })
}