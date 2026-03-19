import axios from "axios";

const HttpRequest = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// request interceptor
HttpRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


HttpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${process.env.API_URL}/api/auth/refresh`,
                    { refreshToken }
                );

                const newToken = res.data.accessToken;

                localStorage.setItem("accessToken", newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return HttpRequest(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
export default HttpRequest;