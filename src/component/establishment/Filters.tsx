import type { EstablishmentsFiltersState } from "@/hooks/filters/useEstablishmentsFilters.hook";
import type { Category } from "@/types/category/category.interface";
import Loader from "../ui/Loader";
import SearchInput from "../ui/SearchInput";

export default function Filters({
  state,
  setSearch,
  clearAllFilters,
  clearCategories,
  hasActiveFilters,
  toggleCategory,
  toggleBooleanFilter,
  categories,
  isLoadingCategories,
}: {
  state: EstablishmentsFiltersState;
  setSearch: (name: string) => void;
  clearAllFilters: () => void;
  clearCategories: () => void;
  hasActiveFilters: boolean;
  isCategorySelected: (category: string) => boolean;
  toggleCategory: (category: string) => void;
  toggleBooleanFilter: (
    filter: keyof EstablishmentsFiltersState["booleans"],
  ) => void;
  categories?: Category[];
  isLoadingCategories: boolean;
}) {
  return (
    <aside className="flex w-64 flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
      {/* 🔍 Búsqueda por nombre */}
      <div>
        <label
          htmlFor="name-search"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Buscar por nombre
        </label>
        <SearchInput setSearch={setSearch} />
      </div>

      {/* 🧩 Resumen de filtros activos */}
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
            {state.search && <p>• Búsqueda: &quot;{state.search}&quot;</p>}
            {state.categories.length > 0 && (
              <p>• {state.categories.length} categoría(s)</p>
            )}
            {Object.values(state.booleans).some(Boolean) && (
              <p>• Filtros de métodos de pago / descuentos</p>
            )}
          </div>
        </div>
      )}

      {/* 🗂️ Categorías */}
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
          <Loader />
        ) : categories?.length ? (
          <select
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) toggleCategory(selected);
              e.target.value = ""; // reset select
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar categoría...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="py-4 text-center text-sm text-gray-500">
            No hay categorías disponibles
          </p>
        )}

        {/* 🏷️ Etiquetas de categorías seleccionadas */}
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

      {/* 💳 Filtros booleanos */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          Métodos de pago y beneficios
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.booleans.acceptCreditCard}
              onChange={() => toggleBooleanFilter("acceptCreditCard")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Acepta tarjeta de crédito
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.booleans.acceptDebitCard}
              onChange={() => toggleBooleanFilter("acceptDebitCard")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Acepta tarjeta de débito
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.booleans.acceptMercadoPago}
              onChange={() => toggleBooleanFilter("acceptMercadoPago")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Acepta MercadoPago
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.booleans.acceptCtaDNI}
              onChange={() => toggleBooleanFilter("acceptCtaDNI")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Acepta Cuenta DNI
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.booleans.hasDiscount}
              onChange={() => toggleBooleanFilter("hasDiscount")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Tiene descuentos en efectivo
          </label>
        </div>
      </div>
    </aside>
  );
}
