import axios from "axios";

const HttpRequest = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
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
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const userStorage = getUserStorage();

            const refreshToken = userStorage?.state?.refreshToken;

            if (!refreshToken) {
                localStorage.removeItem("userStorage");
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
                    { refreshToken }
                );

                const newAccessToken = res.data.accessToken;

                // update localStorage
                userStorage.state.accessToken = newAccessToken;

                localStorage.setItem(
                    "userStorage",
                    JSON.stringify(userStorage)
                );

                // update header request cũ
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return HttpRequest(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("userStorage");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default HttpRequest;