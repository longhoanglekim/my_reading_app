// api/auth.ts
import { User } from "@/app/store/userStore"
import HttpRequest from "@/app/config/auth"
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
    try {
    
    const response = await HttpRequest.post("/auth/login", {
        email,
        password
    })
    console.log("Login response:", response.data);
    return response.data as LoginResponse;
    } catch (error) {
        console.error("Login error:", error)
        throw error;

    }
}


export type OAuthProvider = {
    provider: string
    displayName: string
    authorizationUrl: string
}

type OAuthProvidersResponse = {
    data: OAuthProvider[]
}

export const getOAuthProviders = async (): Promise<OAuthProvider[]> => {
    const response = await HttpRequest.get("/oauth2/providers")

    return response.data.data
}

