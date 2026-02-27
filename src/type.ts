export interface AdminAPIResponse<T> {
    message: string;
    success?: boolean;
    error_type?: string;
    execution_time?: number;
    data: T;
    queries?: APIQueryInfo;
}

export interface APIQueryInfo {
    duplicates: number;
    time: number;
    log: unknown[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export interface AdminPaginatedAPIResponse<T> extends AdminAPIResponse<T[]> {
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export type User = {
    id: number;
    role_id: string;
    role_name?: string;
    shop_id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
    avatar?: string;
    status: string;
    payment_status: "paid" | "unpaid" | string;
    next_due_date: string | null;
    phone_verified_at: string | null;
    created_at: string;
}