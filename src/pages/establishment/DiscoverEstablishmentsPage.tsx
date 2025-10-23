import PageContainer from "@/component/ui/PageContainer";
import SearchEstablishmentsList from "@/component/establishment/SearchEstablishmentsList";
import { useEstablishmentsFilters } from "@/hooks/filters/useEstablishmentsFilters.hook";
import GoogleMaps from "@/component/GoogleMaps";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Filters from "@/component/establishment/Filters";
import { FaFilter } from "react-icons/fa6";
import Modal from "@/component/ui/Modal";
import Button from "@/component/ui/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { establishmentService } from "@/api/establishment-service";
import { categoryService } from "@/api/category-service";

export default function DiscoverEstablishmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const {
    queryString,
    state,
    setName,
    toggleCategory,
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

  const { data } = useSuspenseQuery({
    queryKey: ["establishments", queryString],
    queryFn: () =>
      establishmentService
        .getEstablishments(queryString)
        .then((res) => res.data),
  });

  const markers = data?.data?.map((e) => ({
    lat: Number(e.latitude),
    lng: Number(e.longitude),
  }));

  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories().then((res) => res.data.data),
  });

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
    <PageContainer className="flex flex-col gap-4 p-4 md:flex-row">
      {/* Sidebar de Categorías y Filtros */}
      <Modal isOpen={showFilters} setIsOpen={setShowFilters}>
        <Filters
          state={state}
          setName={setName}
          clearAllFilters={clearAllFilters}
          clearCategories={clearCategories}
          hasActiveFilters={hasActiveFilters}
          isCategorySelected={isCategorySelected}
          toggleCategory={toggleCategory}
          categories={categories}
          isLoadingCategories={false}
        />
      </Modal>
      <div className="hidden w-auto md:block">
        <Filters
          state={state}
          setName={setName}
          clearAllFilters={clearAllFilters}
          clearCategories={clearCategories}
          hasActiveFilters={hasActiveFilters}
          isCategorySelected={isCategorySelected}
          toggleCategory={toggleCategory}
          categories={categories}
          isLoadingCategories={false}
        />
      </div>

      <div className="flex flex-1 flex-grow flex-col gap-4">
        <GoogleMaps className="h-90 w-full shadow-lg" markers={markers} />
        <Button
          className="w-fit text-xl md:hidden"
          icon={<FaFilter />}
          onClick={() => setShowFilters((prev) => !prev)}
          label="Filtrar"
        />

        {/* Lista de Establecimientos */}
        <SearchEstablishmentsList
          establishments={data?.data}
          isLoading={false}
          isError={false}
          error={null}
        />
      </div>

      {/* Mapa con marcadores */}
    </PageContainer>
  );
}
