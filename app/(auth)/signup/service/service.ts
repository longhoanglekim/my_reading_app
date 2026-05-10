import HttpRequest from "@/app/config/auth"
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
    try {
    const response = await HttpRequest.post("/auth/register", {
        fullName,
        email,
        password
    });
    return response.data as RegisterResponse;
    } catch (error) {    
        console.error("Registration error:", error)
        throw error;

    }

}
