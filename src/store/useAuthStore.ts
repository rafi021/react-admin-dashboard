import { ADMIN_API_ENDPOINTS, api } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: number;
    name: string;
    domain?: string;
    email: string;
    phone: string;
    role_id?: number;
    role?: string;
    shop_id?: number;
    avatar?: string;
    status?: string;
    payment_status?: string;
    phone_verified?: boolean;
    created_at?: string;
    next_due_date?: string;
}

type AuthApiResponse = {
    success: boolean;
    message: string;
    token?: string;
    expire_date?: string;
    permissions?: string[];
    data?: User;
    user?: User;
}

type AuthState = {
    user: User | null;
    token: string | null;
    permissions: string[];
    expireDate: string | null;
    isAuthenticated: boolean;
    login: (credentials: {
        email: string,
        password: string
    }
    ) => Promise<void>;
    register: (userData: {
        name: string,
        phone: string,
        email: string,
        password: string
    }) => Promise<void>;
    logout: () => void;
    checkIsAdmin: () => boolean;
}

const useAuthStore = create<AuthState>()(persist(
    (set, get) => ({
        user: null,
        token: null,
        permissions: [],
        expireDate: null,
        isAuthenticated: false,
        login: async (credentials) => {
            try {
                const response = await api.post(ADMIN_API_ENDPOINTS.LOGIN, credentials);
                const payload = response.data as AuthApiResponse;
                const user = payload.data ?? payload.user;
                const token = payload.token;

                if (!payload.success || !user || !token) {
                    throw new Error(payload.message || "Invalid login response from server");
                }

                set({
                    user,
                    token,
                    permissions: payload.permissions ?? [],
                    expireDate: payload.expire_date ?? null,
                    isAuthenticated: true,
                });
            } catch (error) {
                console.log("Login Error: ", error);
                throw error;
            }
        },
        register: async (userData) => {
            try {
                const response = await api.post(ADMIN_API_ENDPOINTS.REGISTER, userData);
                const payload = response.data as AuthApiResponse;
                const user = payload.data ?? payload.user;
                const token = payload.token;

                if (!payload.success || !user || !token) {
                    throw new Error(payload.message || "Invalid registration response from server");
                }

                set({
                    user,
                    token,
                    permissions: payload.permissions ?? [],
                    expireDate: payload.expire_date ?? null,
                    isAuthenticated: true,
                });
            } catch (error) {
                console.log("Registration Error: ", error);
                throw error;
            }
        },
        logout: () => {
            set({
                user: null,
                token: null,
                permissions: [],
                expireDate: null,
                isAuthenticated: false,
            });
        },
        checkIsAdmin: () => {
            // if user has role=admin then return true
            const user = get().user;
            return user?.role === "Merchant";
        }
    }), {
    name: "auth-storage",
}));

export default useAuthStore;