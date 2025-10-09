import PageContainer from "@/component/ui/PageContainer";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import SearchEstablishmentsList from "@/component/ui/establishment/SearchEstablishmentsList";
import { useEstablishmentsFilters } from "@/hooks/useEstablishmentsFilters.hook";
import GoogleMaps from "@/component/GoogleMaps";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";

export default function DiscoverEstablishmentsPage() {
  const { queryString, state, setCategories } = useEstablishmentsFilters();
  const {
    data,
    isPending: isLoading,
    error,
    isError,
  } = useEstablishmentApi().getEstablishments(
    queryString,
    state.page,
    state.limit,
  );
  const markers = data?.data.map((e) => ({
    lat: Number(e.latitude),
    lng: Number(e.longitude),
  }));
  const { data: categories, isPending: isLoadingCategories } =
    useCategoryApi().getCategories;

  return (
    <PageContainer className="flex-row gap-4 p-4">
      <div className="w-44">
        <ul>
          {categories &&
            categories.map((c) => (
              <li key={c.id} onClick={() => setCategories([c.name])}>
                {c.name}
              </li>
            ))}
        </ul>
      </div>
      <SearchEstablishmentsList
        establishments={data?.data}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <GoogleMaps className="flex-grow" markers={markers} />
    </PageContainer>
  );
}
