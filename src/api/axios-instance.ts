// axios-instance.ts
import axios from "axios";
import { useAuthStore } from "@/context/useAuthStore";
import { useUserStore } from "@/context/useUserStore";
import { baseURL } from "@/lib/constants/enviroment-variables";

const api = axios.create({
    baseURL,
    withCredentials: true,
});

// Instancia separada para refresh token (SIN interceptores)
const apiRefresh = axios.create({
    baseURL,
    withCredentials: true,
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Variable para evitar múltiples llamadas simultáneas al refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor para manejar tokens expirados
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Si ya se está refrescando, encola esta petición
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // USA apiRefresh en lugar de api
                const { data } = await apiRefresh.post("/auth/refresh");
                const newAccessToken = data.data.accessToken;

                useAuthStore.getState().setAccessToken(newAccessToken);

                // Procesa la cola de peticiones pendientes
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().setAccessToken(null);
                useUserStore.getState().setUser(null);

                // Opcional: redirigir al login
                // window.location.href = '/login';

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Función para inicializar la autenticación al cargar la app
export async function bootstrapAuth() {
    try {
        // USA apiRefresh en lugar de api
        const { data } = await apiRefresh.post("/auth/refresh");
        const accessToken = data.data.accessToken;

        useAuthStore.getState().setAccessToken(accessToken);

        // Ahora usa api con el token ya seteado
        const userResponse = await api.get("/user/me");
        useUserStore.getState().setUser(userResponse.data.data);

        return { accessToken, user: userResponse.data.data };
    } catch (error) {
        useAuthStore.getState().setAccessToken(null);
        useUserStore.getState().setUser(null);
        throw error;
    }
}

export default api;