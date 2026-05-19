import HttpRequest from "@/app/config/auth";

export type MeResponse = {
    id: number;
    email: string;
    fullName: string;
    role: string;
};

export const getMe = async (): Promise<MeResponse> => {
    const response = await HttpRequest.get("/auth/me");

    return response.data;
};