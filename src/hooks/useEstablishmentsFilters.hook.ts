import { useCallback, useMemo, useState } from "react";

export type SortOrder = "ASC" | "DESC";
export type SortBy = "name" | "createdAt" | "address";

export interface EstablishmentsFiltersState {
  page: number;
  limit: number;
  name: string;
  address: string;
  categories?: string[];
  subcategories?: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

const DEFAULT_STATE: EstablishmentsFiltersState = {
  page: 1,
  limit: 10,
  name: "",
  address: "",
  categories: undefined,
  subcategories: undefined,
  sortBy: "createdAt",
  sortOrder: "DESC",
};

export const useEstablishmentsFilters = (initial?: Partial<EstablishmentsFiltersState>) => {
  const [state, setState] = useState<EstablishmentsFiltersState>({ ...DEFAULT_STATE, ...initial });

  const setPage = useCallback((page: number) => setState((s) => ({ ...s, page })), []);
  const setLimit = useCallback((limit: number) => setState((s) => ({ ...s, limit, page: 1 })), []);
  const setName = useCallback((name: string) => setState((s) => ({ ...s, name, page: 1 })), []);
  const setAddress = useCallback((address: string) => setState((s) => ({ ...s, address, page: 1 })), []);
  const setCategories = useCallback((categories?: string[]) => setState((s) => ({ ...s, categories: [...s.categories || [], ...(categories || [])], page: 1 })), []);
  const setSubcategories = useCallback((subcategories?: string[]) => setState((s) => ({ ...s, subcategories, page: 1 })), []);
  const setSorting = useCallback((sortBy?: SortBy, sortOrder?: SortOrder) => setState((s) => ({ ...s, sortBy, sortOrder })), []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (state.page) params.set("page", String(state.page));
    if (state.limit) params.set("limit", String(state.limit));
    if (state.name) params.set("name", state.name);
    if (state.address) params.set("address", state.address);
    if (state.categories?.length) state.categories.forEach((c) => params.append("categories[]", c));
    if (state.subcategories?.length) state.subcategories.forEach((sc) => params.append("subcategories[]", sc));
    // Keep sort params in case backend supports them later (harmless if ignored)
    if (state.sortBy) params.set("sortBy", state.sortBy);
    if (state.sortOrder) params.set("sortOrder", state.sortOrder);
    return `?${params.toString()}`;
  }, [state.page, state.limit, state.name, state.address, state.categories, state.subcategories, state.sortBy, state.sortOrder]);

  return {
    state,
    queryString,
    setPage,
    setLimit,
    setName,
    setAddress,
    setCategories,
    setSubcategories,
    setSorting,
  };
};
