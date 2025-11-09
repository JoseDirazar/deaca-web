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
  (error) => Promise.reject(error),
);

// Variable para evitar múltiples llamadas simultáneas al refresh
let isRefreshing = false;
// Ignore the any type for failedQueue variable
// because it will be used as an array of promises
// and TypeScript is not able to infer the type correctly
// @ts-expect-error any[]
let failedQueue: promise[] | null = [];

const processQueue = (error: Error, token: string | null = null) => {
  failedQueue?.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Función para formatear errores de Axios
interface AxiosErrorResponse {
  type: string;
  status?: number;
  data?: unknown;
  headers?: Record<string, string>;
  config?: {
    url?: string;
    method?: string;
    params?: unknown;
    data?: unknown;
  };
  originalError: Error;
  message?: string;
}

interface AxiosErrorWithResponse extends Error {
  response?: {
    status?: number;
    data?: unknown;
    headers?: Record<string, string>;
    config?: {
      url?: string;
      method?: string;
      params?: unknown;
      data?: unknown;
    };
  };
  request?: XMLHttpRequest | null;
  config?: {
    url?: string;
    method?: string;
    params?: unknown;
    data?: unknown;
  };
  isAxiosError?: boolean;
  toJSON?: () => Record<string, unknown>;
}

const formatAxiosError = (error: unknown): AxiosErrorResponse => {
  const err = error as AxiosErrorWithResponse;
  if (err.response) {
    // La petición fue hecha y el servidor respondió con un código de estado
    // que está fuera del rango 2xx
    const { status, data, headers, config } = err.response;
    return {
      type: "response_error",
      status,
      data,
      headers,
      config: {
        url: config?.url,
        method: config?.method,
        params: config?.params,
        data: config?.data,
      },
      originalError: err,
    };
  } else if (err.request) {
    // La petición fue hecha pero no se recibió respuesta
    return {
      type: "network_error",
      message: "No se pudo conectar con el servidor",
      originalError: err,
    };
  } else {
    // Algo pasó en la configuración de la petición que lanzó un error
    return {
      type: "request_error",
      message: err.message || "Error desconocido en la petición",
      originalError: err,
    };
  }
};

// Interceptor para manejar tokens expirados
api.interceptors.response.use(
  (response) => {
    console.debug("Respuesta exitosa:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const errorInfo = formatAxiosError(error);
    console.error("Error en la petición:", errorInfo);

    const originalRequest = error.config;

    // Si es un error 401 y no es una solicitud de refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      if (isRefreshing) {
        // Si ya se está refrescando, encola esta petición
        return new Promise((resolve, reject) => {
          if (!failedQueue) failedQueue = [];
          failedQueue?.push({ resolve, reject });
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
        console.debug("Intentando refrescar token...");
        const { data } = await apiRefresh.post("/auth/refresh");
        const newAccessToken = data.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No se recibió un token de acceso válido");
        }

        console.debug("Token refrescado exitosamente");
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Procesa la cola de peticiones pendientes
        processQueue(new Error("Refresh failed"), newAccessToken);

        // Reintentar la petición original
        console.debug("Reintentando petición original:", originalRequest.url);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        const refreshError = error as AxiosErrorWithResponse;
        console.error("Error al refrescar el token:", {
          message: refreshError.message,
          response: refreshError.response?.data,
          status: refreshError.response?.status,
        });

        // Limpiar el estado de autenticación
        processQueue(refreshError, null);
        useAuthStore.getState().setAccessToken(null);
        useUserStore.getState().setUser(null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
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
    console.error(error);
    // throw error;
  }
}

export default api;
