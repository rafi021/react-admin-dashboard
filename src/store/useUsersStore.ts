import { ADMIN_API_ENDPOINTS } from "@/lib/config";
import type { AdminAPIResponse, AdminPaginatedAPIResponse, User } from "@/type";
import type { AxiosInstance } from "axios";
import { create } from "zustand";

type AddUserPayload = {
    name: string;
    phone: string;
    email: string;
    password: string;
    role_id: "5" | "6";
    avatar?: string;
};

type EditUserPayload = Omit<AddUserPayload, "password">;

type UsersState = {
    users: User[];
    loading: boolean;
    refreshing: boolean;
    formLoading: boolean;
    isEditModalOpen: boolean;
    isAddModalOpen: boolean;
    isDeleteModalOpen: boolean;
    selectedUser: User | null;
    searchTerm: string;
    roleFilter: string;
    total: number;
    currentPage: number;
    perPage: number;
    lastPage: number;
    from: number | null;
    to: number | null;
    setSearchTerm: (value: string) => void;
    setRoleFilter: (value: string) => void;
    setIsEditModalOpen: (open: boolean) => void;
    setIsAddModalOpen: (open: boolean) => void;
    setIsDeleteModalOpen: (open: boolean) => void;
    setSelectedUser: (user: User | null) => void;
    openEditModal: (user: User) => void;
    openDeleteModal: (user: User) => void;
    fetchUsers: (axiosPrivate: AxiosInstance) => Promise<void>;
    applyFilters: (axiosPrivate: AxiosInstance) => Promise<void>;
    resetFilters: (axiosPrivate: AxiosInstance) => Promise<void>;
    goToPage: (axiosPrivate: AxiosInstance, page: number) => Promise<void>;
    goToPreviousPage: (axiosPrivate: AxiosInstance) => Promise<void>;
    goToNextPage: (axiosPrivate: AxiosInstance) => Promise<void>;
    addUser: (axiosPrivate: AxiosInstance, payload: AddUserPayload) => Promise<boolean>;
    updateUser: (
        axiosPrivate: AxiosInstance,
        userId: number,
        payload: EditUserPayload,
    ) => Promise<boolean>;
    deleteUser: (axiosPrivate: AxiosInstance, userId: number) => Promise<boolean>;
};

const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    loading: false,
    refreshing: false,
    formLoading: false,
    isEditModalOpen: false,
    isAddModalOpen: false,
    isDeleteModalOpen: false,
    selectedUser: null,
    searchTerm: "",
    roleFilter: "all",
    total: 0,
    currentPage: 1,
    perPage: 10,
    lastPage: 1,
    from: null,
    to: null,

    setSearchTerm: (value) => set({ searchTerm: value }),
    setRoleFilter: (value) => set({ roleFilter: value }),
    setIsEditModalOpen: (open) => set({ isEditModalOpen: open }),
    setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),
    setIsDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
    setSelectedUser: (user) => set({ selectedUser: user }),

    openEditModal: (user) => {
        set({ selectedUser: user, isEditModalOpen: true });
    },

    openDeleteModal: (user) => {
        set({ selectedUser: user, isDeleteModalOpen: true });
    },

    fetchUsers: async (axiosPrivate) => {
        const { currentPage, searchTerm, perPage, roleFilter } = get();
        const normalizedRole = roleFilter !== "all" ? roleFilter : undefined;
        const normalizedSearch = searchTerm.trim() || undefined;
        const normalizedPage = Number(currentPage) || 1;
        const normalizedPerPage = Number(perPage) || 10;
        const isInitialLoad = get().users.length === 0;

        set({ loading: isInitialLoad, refreshing: true });
        try {
            const { data: response } = await axiosPrivate.get<AdminPaginatedAPIResponse<User>>(
                ADMIN_API_ENDPOINTS.USER_INDEX,
                {
                    params: {
                        page: normalizedPage,
                        search: normalizedSearch,
                        keyword: normalizedSearch,
                        per_page: normalizedPerPage,
                        perPage: normalizedPerPage,
                        role: normalizedRole,
                        role_id: normalizedRole,
                    },
                },
            );

            const currentPageValue = Number(response.current_page) || 1;
            const lastPageValue = Number(response.last_page) || 1;
            const perPageValue = Number(response.per_page) || normalizedPerPage;
            const totalValue = Number(response.total) || 0;
            const fromValue = response.from !== null ? Number(response.from) : null;
            const toValue = response.to !== null ? Number(response.to) : null;

            set({
                users: response.data || [],
                total: totalValue,
                perPage: perPageValue,
                currentPage: currentPageValue,
                lastPage: lastPageValue,
                from: fromValue,
                to: toValue,
            });
        } finally {
            set({ loading: false, refreshing: false });
        }
    },

    applyFilters: async (axiosPrivate) => {
        set({ currentPage: 1 });
        await get().fetchUsers(axiosPrivate);
    },

    resetFilters: async (axiosPrivate) => {
        set({ searchTerm: "", roleFilter: "all", currentPage: 1 });
        await get().fetchUsers(axiosPrivate);
    },

    goToPage: async (axiosPrivate, page) => {
        const lastPage = Number(get().lastPage) || 1;
        const targetPage = Math.min(Math.max(Number(page) || 1, 1), lastPage);
        set({ currentPage: targetPage });
        await get().fetchUsers(axiosPrivate);
    },

    goToPreviousPage: async (axiosPrivate) => {
        const currentPage = Number(get().currentPage) || 1;
        if (currentPage <= 1) return;
        set({ currentPage: currentPage - 1 });
        await get().fetchUsers(axiosPrivate);
    },

    goToNextPage: async (axiosPrivate) => {
        const currentPage = Number(get().currentPage) || 1;
        const lastPage = Number(get().lastPage) || 1;
        if (currentPage >= lastPage) return;
        set({ currentPage: currentPage + 1 });
        await get().fetchUsers(axiosPrivate);
    },

    addUser: async (axiosPrivate, payload) => {
        set({ formLoading: true });
        try {
            const { data: response } = await axiosPrivate.post<AdminAPIResponse<User>>(
                ADMIN_API_ENDPOINTS.USER_CREATE,
                payload,
            );
            if (!response.success) return false;
            return true;
        } finally {
            set({ formLoading: false });
        }
    },

    updateUser: async (axiosPrivate, userId, payload) => {
        set({ formLoading: true });
        try {
            const { data: response } = await axiosPrivate.put<AdminAPIResponse<User>>(
                ADMIN_API_ENDPOINTS.USER_UPDATE(userId),
                payload,
            );
            if (!response.success) return false;
            return true;
        } finally {
            set({ formLoading: false });
        }
    },

    deleteUser: async (axiosPrivate, userId) => {
        set({ formLoading: true });
        try {
            const { data: response } = await axiosPrivate.delete<AdminAPIResponse<null>>(
                ADMIN_API_ENDPOINTS.USER_DELETE(userId),
            );
            if (!response.success) return false;
            return true;
        } finally {
            set({ formLoading: false });
        }
    },
}));

export default useUsersStore;
