// api/auth.ts
import { User } from "@/app/store/userStore"

type LoginResponse = {
    token: string
    user: {
        id: number
        email: string
        fullName: string
        role: string
    }
}

export const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const response = await fetch(
        "http://localhost:8080/comic/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        }
    )

    if (!response.ok) {
        throw new Error("Invalid email or password")
    }

    const data: LoginResponse = await response.json()

    return data
}