import { useCallback, useMemo, useState } from "react";

export type SortOrder = "ASC" | "DESC";
export type SortBy = "name" | "createdAt" | "address" | "status";

export interface EstablishmentsFiltersState {
  page: number;
  limit: number;
  name: string;
  address: string;
  categories: string[];
  subcategories: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

const DEFAULT_STATE: EstablishmentsFiltersState = {
  page: 1,
  limit: 10,
  name: "",
  address: "",
  categories: [],
  subcategories: [],
  sortBy: "createdAt",
  sortOrder: "DESC",
};

export const useEstablishmentsFilters = (
  initial?: Partial<EstablishmentsFiltersState>
) => {
  const [state, setState] = useState<EstablishmentsFiltersState>({
    ...DEFAULT_STATE,
    ...initial,
    categories: initial?.categories || [],
    subcategories: initial?.subcategories || [],
  });

  const setPage = useCallback(
    (page: number) => setState((s) => ({ ...s, page })),
    []
  );

  const setLimit = useCallback(
    (limit: number) => setState((s) => ({ ...s, limit, page: 1 })),
    []
  );

  const setName = useCallback(
    (name: string) => setState((s) => ({ ...s, name, page: 1 })),
    []
  );

  const setAddress = useCallback(
    (address: string) => setState((s) => ({ ...s, address, page: 1 })),
    []
  );

  // Toggle de categoría (agregar si no existe, remover si existe)
  const toggleCategory = useCallback((category: string) => {
    setState((s) => {
      const isSelected = s.categories.includes(category);
      const newCategories = isSelected
        ? s.categories.filter((cat) => cat !== category)
        : [...s.categories, category];

      return { ...s, categories: newCategories, page: 1 };
    });
  }, []);

  // Establecer categorías completas (reemplaza las existentes)
  const setCategories = useCallback((categories: string[]) => {
    setState((s) => ({
      ...s,
      categories: Array.from(new Set(categories)),
      page: 1,
    }));
  }, []);

  // Limpiar categorías
  const clearCategories = useCallback(() => {
    setState((s) => ({ ...s, categories: [], page: 1 }));
  }, []);

  // Toggle de subcategoría
  const toggleSubcategory = useCallback((subcategory: string) => {
    setState((s) => {
      const isSelected = s.subcategories.includes(subcategory);
      const newSubcategories = isSelected
        ? s.subcategories.filter((sub) => sub !== subcategory)
        : [...s.subcategories, subcategory];

      return { ...s, subcategories: newSubcategories, page: 1 };
    });
  }, []);

  // Establecer subcategorías completas
  const setSubcategories = useCallback((subcategories: string[]) => {
    setState((s) => ({
      ...s,
      subcategories: Array.from(new Set(subcategories)),
      page: 1,
    }));
  }, []);

  const setSorting = useCallback(
    (sortBy?: SortBy, sortOrder?: SortOrder) =>
      setState((s) => ({ ...s, sortBy, sortOrder })),
    []
  );

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // Query string optimizado - solo incluye parámetros con valores
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    // Siempre incluir paginación
    params.set("page", String(state.page));
    params.set("limit", String(state.limit));

    // Incluir solo filtros con valores
    if (state.name.trim()) {
      params.set("name", state.name.trim());
    }

    if (state.address.trim()) {
      params.set("address", state.address.trim());
    }

    // Categorías: solo si hay alguna seleccionada
    if (state.categories.length > 0) {
      state.categories.forEach((category) => {
        params.append("categories[]", category);
      });
    }

    // Subcategorías: solo si hay alguna seleccionada
    if (state.subcategories.length > 0) {
      state.subcategories.forEach((subcategory) => {
        params.append("subcategories[]", subcategory);
      });
    }

    // Ordenamiento: solo si está definido
    if (state.sortBy) {
      params.set("sortBy", state.sortBy);
    }

    if (state.sortOrder) {
      params.set("sortOrder", state.sortOrder);
    }

    return `?${params.toString()}`;
  }, [
    state.page,
    state.limit,
    state.name,
    state.address,
    state.categories,
    state.subcategories,
    state.sortBy,
    state.sortOrder,
  ]);

  // Indicador de si hay filtros activos (excluyendo paginación y orden)
  const hasActiveFilters = useMemo(() => {
    return (
      state.name.trim() !== "" ||
      state.address.trim() !== "" ||
      state.categories.length > 0 ||
      state.subcategories.length > 0
    );
  }, [state.name, state.address, state.categories, state.subcategories]);

  // Verificar si una categoría está seleccionada
  const isCategorySelected = useCallback(
    (category: string) => state.categories.includes(category),
    [state.categories]
  );

  // Verificar si una subcategoría está seleccionada
  const isSubcategorySelected = useCallback(
    (subcategory: string) => state.subcategories.includes(subcategory),
    [state.subcategories]
  );

  return {
    state,
    queryString,
    hasActiveFilters,
    setPage,
    setLimit,
    setName,
    setAddress,
    setCategories,
    toggleCategory,
    clearCategories,
    setSubcategories,
    toggleSubcategory,
    setSorting,
    clearAllFilters,
    isCategorySelected,
    isSubcategorySelected,
  };
};