import PageContainer from "@/component/ui/PageContainer";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import SearchEstablishmentsList from "@/component/ui/establishment/SearchEstablishmentsList";
import { useEstablishmentsFilters } from "@/hooks/useEstablishmentsFilters.hook";
import GoogleMaps from "@/component/GoogleMaps";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";

export default function DiscoverEstablishmentsPage() {
  const {
    queryString,
    state,
    toggleCategory,
    isCategorySelected,
    clearCategories,
  } = useEstablishmentsFilters();

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

  // Debug
  console.log("Query String:", queryString);
  console.log("Selected Categories:", state.categories);

  return (
    <PageContainer className="flex-row gap-4 p-4">
      {/* Sidebar de Categorías */}
      <aside className="flex w-64 flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
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
