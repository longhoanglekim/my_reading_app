import axios from "axios";
import { useUserStore } from "@/app/store/userStore";

const HttpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// lấy data từ localStorage userStorage
const getUserStorage = () => {
    const storage = localStorage.getItem("user-storage");

    if (!storage) return null;

    try {
        return JSON.parse(storage);
    } catch {
        return null;
    }
};

// request interceptor
HttpRequest.interceptors.request.use((config) => {
    const userStorage = getUserStorage();

    const token = userStorage?.state?.accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// response interceptor
HttpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Đồng bộ bộ nhớ và localStorage thông qua action logout của Zustand store
            useUserStore.getState().logout();
        }

        return Promise.reject(error);
    }
);

export default HttpRequest;