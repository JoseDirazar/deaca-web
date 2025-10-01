import axios from "axios";
import { useUserStore } from "@/context/useUserStore";
import type { GetMyProfileResponse, GetUsersResponse } from "@/types/common/api-response.interface";

export const baseURL = import.meta.env.VITE_PUBLIC_API_URL;
export const uploadBaseURL = import.meta.env.VITE_PUBLIC_BASE_API_URL;
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

// A clean axios client (no interceptors) for auth endpoints like refresh
const authApi = axios.create({ baseURL });

// Decode JWT payload safely
function decodeJwt<T = any>(accessToken: string): T | null {
    try {
        const [, payload] = accessToken.split(".");
        if (!payload) return null;
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
        return null;
    }
}

function isTokenExpired(accessToken: string, skewSeconds = 30): boolean {
    const payload = decodeJwt<{ exp?: number }>(accessToken);
    if (!payload?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp - skewSeconds <= now;
}

async function refreshAccessToken(): Promise<string> {
    const storedRefreshToken = localStorage.getItem("refresh_token");
    if (!storedRefreshToken) throw new Error("Missing refresh token");
    // Backend endpoint is `POST /auth/refresh-accesstoken`
    const response = await authApi.post("/auth/refresh-accesstoken", {
        refreshToken: storedRefreshToken,
    });
    const accessToken: string | undefined = response.data.data.accessToken;
    if (!accessToken) throw new Error("No access token returned");
    localStorage.setItem("access_token", accessToken);
    return accessToken;
}

// Request interceptor
api.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    // Preemptively refresh if access accessToken is expired and we have a refresh accessToken
    if (accessToken && refreshToken && isTokenExpired(accessToken) && !isRefreshing) {
        try {
            isRefreshing = true;
            const newAccess = await refreshAccessToken();
            // resolve queued requests (if any were added meanwhile)
            failedQueue.forEach((r) => r.resolve(newAccess));
            failedQueue.length = 0;
        } catch (e) {
            // on failure, clear tokens and bubble up (request likely gets 401 and will be handled in response interceptor)
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        } finally {
            isRefreshing = false;
        }
    }

    const latest = localStorage.getItem("access_token");
    if (latest) {
        config.headers.Authorization = `Bearer ${latest}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // If any response contains user data, persist it into the store
        const user = (response?.data && (response.data.data.user || response.data?.data?.user));
        if (user) {
            try {
                useUserStore.getState().setUser(user as any);
            } catch { }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config || {};
        const status = error.response?.status;
        const url: string = originalRequest?.url || "";

        // If error is not 401 or request already retried, reject
        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Do not try to refresh for auth endpoints that naturally return 401
        const isAuthEndpoint = url?.startsWith("/auth/");
        if (isAuthEndpoint) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // If refreshing, queue the request
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const accessToken = await refreshAccessToken();

            // Process queued requests
            failedQueue.forEach((request) => request.resolve(accessToken));
            failedQueue.length = 0; // Clear the queue

            // Retry original request
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            // Clear tokens and user on refresh failure
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            try {
                useUserStore.getState().clearUser();
            } catch { }
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

// Bootstraps auth on app startup or page reload.
// - If there is only a refresh token, attempts to get a new access token.
// - Sets Authorization header for subsequent requests.
// - Fetches the current user and saves to the store.
export async function bootstrapAuth(): Promise<void> {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    try {
        let tokenToUse = accessToken || undefined;
        if (!tokenToUse && refreshToken) {
            tokenToUse = await refreshAccessToken();
        } else if (tokenToUse && isTokenExpired(tokenToUse) && refreshToken) {
            tokenToUse = await refreshAccessToken();
        }

        if (tokenToUse) {
            api.defaults.headers.common["Authorization"] = `Bearer ${tokenToUse}`;
            try {
                const me = await api.get("/user/me");
                const user = me?.data?.data;
                if (user) useUserStore.getState().setUser(user);
            } catch (error) {
                console.error(error)
            }
        }
    } catch (err) {
        // On any failure, ensure clean state
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        try {
            useUserStore.getState().clearUser();
        } catch { }
        // swallow error to not block app boot
    }
}

export default api;
