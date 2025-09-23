import axios from "axios";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL;
const api = axios.create({
    baseURL,
});

// Variable to track if we're refreshing the token
let isRefreshing = false;
// Store pending requests
const failedQueue: {
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}[] = [];

// Request interceptor
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request already retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // If refreshing, queue the request
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const storedRefreshToken = localStorage.getItem("refresh_token");
            if (!storedRefreshToken) {
                return;
            }

            const response = await fetch(
                "/auth/refresh-token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refreshToken: storedRefreshToken }),
                },
            );
            const { accessToken } = await response.json();

            localStorage.setItem("access_token", accessToken);

            // Process queued requests
            failedQueue.forEach((request) => request.resolve(accessToken));
            failedQueue.length = 0; // Clear the queue

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            // Clear tokens on refresh failure
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return Promise.reject(
                refreshError instanceof Error
                    ? refreshError
                    : new Error(String(refreshError)),
            );
        } finally {
            isRefreshing = false;
        }
    },
);

export default api;
