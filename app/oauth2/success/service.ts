import axios from "axios";

export type MeResponse = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    {
      withCredentials: true, 
    }
  );

  return response.data;
};