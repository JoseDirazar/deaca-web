import { useCallback, useMemo, useState } from "react";

export type SortOrder = "ASC" | "DESC";
export type SortBy = "firstName" | "lastName" | "email" | "createdAt" | "role" | "lastLogin";

export interface UsersFiltersState {
  page: number;
  limit: number;
  search: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

const DEFAULT_STATE: UsersFiltersState = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: "createdAt",
  sortOrder: "DESC",
};

export const useUsersFilters = (initial?: Partial<UsersFiltersState>) => {
  const [state, setState] = useState<UsersFiltersState>({ ...DEFAULT_STATE, ...initial });

  const setPage = useCallback((page: number) => setState((s) => ({ ...s, page })), []);
  const setLimit = useCallback((limit: number) => setState((s) => ({ ...s, limit, page: 1 })), []);
  const setSearch = useCallback((search: string) => setState((s) => ({ ...s, search, page: 1 })), []);
  const setSorting = useCallback((sortBy?: SortBy, sortOrder?: SortOrder) => setState((s) => ({ ...s, sortBy, sortOrder })), []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (state.page) params.set("page", String(state.page));
    if (state.limit) params.set("limit", String(state.limit));
    if (state.search) params.set("search", state.search);
    if (state.sortBy) params.set("sortBy", state.sortBy);
    if (state.sortOrder) params.set("sortOrder", state.sortOrder);
    const qs = `?${params.toString()}`;
    return qs;
  }, [state.page, state.limit, state.search, state.sortBy, state.sortOrder]);

  return {
    state,
    queryString,
    setPage,
    setLimit,
    setSearch,
    setSorting,
  };
};
