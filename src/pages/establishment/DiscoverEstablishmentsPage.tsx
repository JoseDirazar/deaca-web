import PageContainer from "@/component/ui/PageContainer";
import SearchEstablishmentsList from "@/component/establishment/SearchEstablishmentsList";
import { useEstablishmentsFilters } from "@/hooks/filters/useEstablishmentsFilters.hook";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import Filters from "@/component/establishment/Filters";
import { FaFilter } from "react-icons/fa6";
import Modal from "@/component/ui/Modal";
import Button from "@/component/ui/Button";

import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import EstablishmentsMap from "@/component/EstablishmentsMap";

export default function DiscoverEstablishmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { useGetEstablishments } = useEstablishmentApi();
  const { useGetCategories } = useCategoryApi();
  const {
    queryString,
    state,
    setSearch,
    toggleCategory,
    isCategorySelected,
    clearCategories,
    clearAllFilters,
    hasActiveFilters,
    toggleBooleanFilter,
    toggleSubcategory,
  } = useEstablishmentsFilters({
    search: searchParams.get("search") || "",
    categories: searchParams.getAll("categories[]"),
    subcategories: searchParams.getAll("subcategories[]"),
    booleans: {
      acceptCreditCard: searchParams.get("acceptCreditCard") === "true",
      acceptDebitCard: searchParams.get("acceptDebitCard") === "true",
      acceptMercadoPago: searchParams.get("acceptMercadoPago") === "true",
      acceptCtaDNI: searchParams.get("acceptCtaDNI") === "true",
      hasDiscount: searchParams.get("hasDiscount") === "true",
    },
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
  console.log(queryString);
  const { data: establishments } = useGetEstablishments(queryString);
  const markers = useMemo(() => {
    return establishments?.data?.map((e) => ({
      title: e.name,
      lat: Number(e.latitude),
      lng: Number(e.longitude),
      image: e.avatar,
      slug: e.slug,
    }));
  }, [establishments]);

  const { data: categories } = useGetCategories({});

  useEffect(() => {
    const params = new URLSearchParams(searchParams); // 👈 clona los actuales

    params.set("page", String(state.page));
    params.set("limit", String(state.limit));

    if (state.search.trim()) {
      params.set("search", state.search.trim());
    } else {
      params.delete("search");
    }

    // ✅ Limpieza dinámica
    params.delete("categories[]");
    state.categories.forEach((cat) => params.append("categories[]", cat));

    params.delete("subcategories[]");
    state.subcategories.forEach((sub) => params.append("subcategories[]", sub));

    Object.entries(state.booleans).forEach(([key, value]) => {
      if (value) params.set(key, "true");
      else params.delete(key);
    });

    if (state.sortBy) params.set("sortBy", state.sortBy);
    if (state.sortOrder) params.set("sortOrder", state.sortOrder);

    setSearchParams(params, { replace: true });
  }, [
    state.page,
    state.limit,
    state.search,
    state.categories,
    state.subcategories,
    state.sortBy,
    state.sortOrder,
    state.booleans,
    searchParams,
    setSearchParams,
  ]);
  return (
    <PageContainer className="flex flex-col gap-4 p-4 md:flex-row">
      <Modal isOpen={showFilters} setIsOpen={setShowFilters}>
        <Filters
          toggleBooleanFilter={toggleBooleanFilter}
          state={state}
          setSearch={setSearch}
          clearAllFilters={clearAllFilters}
          clearCategories={clearCategories}
          hasActiveFilters={hasActiveFilters}
          isCategorySelected={isCategorySelected}
          toggleCategory={toggleCategory}
          categories={categories?.data}
          isLoadingCategories={false}
          selectedCategories={state.categories}
          toggleSubcategory={toggleSubcategory}
        />
      </Modal>

      <div className="hidden w-auto md:block">
        <Filters
          toggleBooleanFilter={toggleBooleanFilter}
          state={state}
          setSearch={setSearch}
          clearAllFilters={clearAllFilters}
          clearCategories={clearCategories}
          hasActiveFilters={hasActiveFilters}
          isCategorySelected={isCategorySelected}
          toggleCategory={toggleCategory}
          categories={categories?.data}
          isLoadingCategories={false}
          selectedCategories={state.categories}
          toggleSubcategory={toggleSubcategory}
        />
      </div>

      <div className="flex flex-1 flex-grow flex-col gap-4">
        <EstablishmentsMap
          className="h-90 w-full shadow-lg"
          markers={markers}
        />
        <Button
          className="w-fit text-xl md:hidden"
          icon={<FaFilter />}
          onClick={() => setShowFilters((prev) => !prev)}
          label="Filtrar"
        />

        <SearchEstablishmentsList
          establishments={establishments?.data}
          isLoading={false}
          isError={false}
          error={null}
        />
      </div>
    </PageContainer>
  );
}
