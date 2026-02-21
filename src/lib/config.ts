import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";


//Configuration utility for Admin API

interface AdminApiConfig {
    baseURL: string;
    isProduction: boolean;
}

// Get API Configuration for Admin
export const getAdminApiConfig = (): AdminApiConfig => {
    const apiUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";
    const isProduction = import.meta.env.VITE_APP_ENV === "production" ||
        import.meta.env.PROD === true;

    if (!apiUrl) {
        throw new Error("VITE_BASE_URL is not defined in environment variables");
    }
    return {
        baseURL: `${apiUrl}/v1`,
        isProduction,
    };
}

// Create Axios instance for Admin API
const createApiInstance = (): AxiosInstance => {
    const { baseURL } = getAdminApiConfig();
    const instance = axios.create({
        baseURL,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "ipaddress": "103.102.15.162",
            "browsername": "Google Chrome",
        },
        withCredentials: true,
        timeout: 30000, // 30 seconds timeout
    });

    //   Add request interceptor to include auth token
    instance.interceptors.request.use(
        (config) => {
            // Get token from localStorage (zustand persist stores it there)
            const authData = localStorage.getItem("auth-storage");
            if (authData) {
                try {
                    const parsedData = JSON.parse(authData);
                    const token = parsedData.state?.token;
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error("Error parsing auth data:", error);
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    //   Add response interceptor for better error handling
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error) => {
            if (error.code === "ERR_NETWORK") {
                console.error(
                    "Network Error: Unable to connect to the server. Please check if the server is running"
                );
            }
            //   Handle 401 unauthorized errors
            if (error.response?.status === 401) {
                // Clear auth data and redirect to login
                localStorage.removeItem("auth-storage");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );
    return instance;
};

// Create and Export the configured Axios instance
export const adminApi = createApiInstance();

// Admin API endpoints
export const ADMIN_API_ENDPOINTS = {
    // Auth
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",

    // Users
} as const;

export const buildAdminQueryParams = (
    params: Record<string, string | number | boolean | undefined>
): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
};


export default adminApi;