import HttpRequest from "@/app/config/auth"

export type RegisterResponse = {
    token: string
    user: {
        id: number
        email: string
        fullName: string
        role: string
    }
}

export type MessageResponse = {
    message: string
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

export const registerOtp = async (
    fullName: string,
    email: string,
    password: string
): Promise<MessageResponse> => {
    try {
        const response = await HttpRequest.post("/auth/register-otp", {
            fullName,
            email,
            password
        });
        return response.data as MessageResponse;
    } catch (error) {
        console.error("Register OTP error:", error)
        throw error;
    }
}

export const verifyEmailOtp = async (
    email: string,
    otp: string
): Promise<RegisterResponse> => {
    try {
        const response = await HttpRequest.post("/auth/verify-email-otp", {
            email,
            otp
        });
        return response.data as RegisterResponse;
    } catch (error) {
        console.error("Verify OTP error:", error)
        throw error;
    }
}

export const resendEmailOtp = async (
    email: string
): Promise<MessageResponse> => {
    try {
        const response = await HttpRequest.post("/auth/resend-email-otp", {
            email
        });
        return response.data as MessageResponse;
    } catch (error) {
        console.error("Resend OTP error:", error)
        throw error;
    }
}
