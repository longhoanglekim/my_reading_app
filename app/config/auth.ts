// import axios from "axios";

// const HttpRequest = axios.create({
//   baseURL: process.env.API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// // request interceptor
// HttpRequest.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });


// HttpRequest.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Nếu là 401 và chưa thử refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       const refreshToken = localStorage.getItem("refreshToken");

//       // Nếu KHÔNG có refreshToken → không cố refresh, reject ngay
//       // Điều này ngăn chặn vòng lặp vô ích khi chưa login
//       if (!refreshToken) {
//         // Optional: Xóa token cũ nếu có
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");

//         // Nếu bạn muốn redirect ở đây, có thể làm, nhưng tốt hơn để page xử lý
//         // router.push('/login');  // ← KHÔNG nên làm ở interceptor (gây loop)
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       try {
//         const res = await axios.post(
//           `${process.env.API_URL}/api/auth/refresh`,
//           { refreshToken }
//         );

//         const newToken = res.data.accessToken;

//         localStorage.setItem("accessToken", newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         // Retry request gốc với token mới
//         return HttpRequest(originalRequest);
//       } catch (refreshError) {
//         // Refresh thất bại → xóa token và reject
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");

//         // Optional: redirect ở đây nếu bạn chắc chắn muốn
//         // Nhưng tốt nhất để component/page xử lý (tránh loop ở interceptor)
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
// export default HttpRequest;