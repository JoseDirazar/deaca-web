export interface ApiResponse<T> {
    ok: boolean;
    data: T;
}

export interface ApiError {
    ok: boolean;
    message: string;
}

// TODO: extender axios response para eliminar el primer nesting
export interface ApiPaginatedResponse<T> {
    data: {
        ok: boolean;
        data: T;
        meta: {
            itemCount: number;
            itemsPerPage: number;
            currentPage: number;
            totalItems: number;
            totalPages: number;
        }
    }
}