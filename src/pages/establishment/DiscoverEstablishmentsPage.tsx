import PageContainer from "@/component/ui/PageContainer";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import SearchEstablishmentsList from "@/component/ui/establishment/SearchEstablishmentsList";
import { useEstablishmentsFilters } from "@/hooks/useEstablishmentsFilters.hook";
import GoogleMaps from "@/component/GoogleMaps";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

export default function DiscoverEstablishmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔹 Inicializar filtros desde URL params
  const {
    queryString,
    state,
    setName,
    toggleCategory,
    setCategories,
    setSubcategories,
    isCategorySelected,
    clearCategories,
    clearAllFilters,
    hasActiveFilters,
  } = useEstablishmentsFilters({
    name: searchParams.get("name") || "",
    categories: searchParams.getAll("categories[]"),
    subcategories: searchParams.getAll("subcategories[]"),
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });

  // 🔹 Obtener establecimientos con filtros activos
  const {
    data,
    isPending: isLoading,
    isError,
    error,
  } = useEstablishmentApi().getEstablishments(
    queryString,
    state.page,
    state.limit,
  );

  const markers = data?.data?.map((e) => ({
    lat: Number(e.latitude),
    lng: Number(e.longitude),
  }));

  // 🔹 Obtener categorías
  const { data: categories, isPending: isLoadingCategories } =
    useCategoryApi().getCategories;

  // 🔹 Sincronizar cambios de filtros con la URL
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", String(state.page));
    params.set("limit", String(state.limit));

    if (state.name.trim()) {
      params.set("name", state.name.trim());
    }

    state.categories.forEach((cat) => {
      params.append("categories[]", cat);
    });

    state.subcategories.forEach((sub) => {
      params.append("subcategories[]", sub);
    });

    if (state.sortBy) {
      params.set("sortBy", state.sortBy);
    }

    if (state.sortOrder) {
      params.set("sortOrder", state.sortOrder);
    }

    // Actualizar URL sin recargar la página
    setSearchParams(params, { replace: true });
  }, [
    state.page,
    state.limit,
    state.name,
    state.categories,
    state.subcategories,
    state.sortBy,
    state.sortOrder,
    setSearchParams,
  ]);

  return (
    <PageContainer className="flex-row gap-4 p-4">
      {/* Sidebar de Categorías y Filtros */}
      <aside className="flex w-64 flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
        {/* Búsqueda por nombre */}
        <div>
          <label
            htmlFor="name-search"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Buscar por nombre
          </label>
          <input
            id="name-search"
            type="text"
            value={state.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del establecimiento..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filtros activos - Resumen */}
        {hasActiveFilters && (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
                Filtros activos
              </p>
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Limpiar todo
              </button>
            </div>
            <div className="space-y-1 text-xs text-blue-600">
              {state.name && <p>• Búsqueda: &quot;{state.name}&quot;</p>}
              {state.categories.length > 0 && (
                <p>• {state.categories.length} categoría(s)</p>
              )}
              {state.subcategories.length > 0 && (
                <p>• {state.subcategories.length} subcategoría(s)</p>
              )}
            </div>
          </div>
        )}

        {/* Sección de categorías */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Categorías</h3>
            {state.categories.length > 0 && (
              <button
                onClick={clearCategories}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Limpiar
              </button>
            )}
          </div>

          {isLoadingCategories ? (
            <p className="py-4 text-center text-sm text-gray-500">
              Cargando categorías...
            </p>
          ) : categories?.length ? (
            <div className="space-y-2">
              {categories.map((category) => {
                const isSelected = isCategorySelected(category.name);
                return (
                  <label
                    key={category.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-all duration-200 ${
                      isSelected
                        ? "border-blue-300 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCategory(category.name)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      className={`text-sm font-medium select-none ${
                        isSelected ? "text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {category.name}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-gray-500">
              No hay categorías disponibles
            </p>
          )}

          {/* Mostrar etiquetas de filtros activos */}
          {state.categories.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="mb-2 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Filtrando por ({state.categories.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {state.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {cat}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="ml-1 font-bold hover:text-blue-900"
                      title={`Quitar ${cat}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mostrar subcategorías activas si las hay */}
        {state.subcategories.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Subcategorías ({state.subcategories.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {state.subcategories.map((sub) => (
                <span
                  key={sub}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Lista de Establecimientos */}
      <SearchEstablishmentsList
        establishments={data?.data}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      {/* Mapa con marcadores */}
      <GoogleMaps className="flex-grow" markers={markers} />
    </PageContainer>
  );
}
