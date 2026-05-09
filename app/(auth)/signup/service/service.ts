type RegisterResponse = {
    token: string
    user: {
        id: number
        email: string
        fullName: string
        role: string
    }
}

export const register = async (
    fullName: string,
    email: string,
    password: string
): Promise<RegisterResponse> => {
    const response = await fetch(
        "http://localhost:8080/comic/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullName,
                email,
                password,
            }),
        }
    )

    if (!response.ok) {
        throw new Error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.")
    }

    const data: RegisterResponse = await response.json()

    return data
}
