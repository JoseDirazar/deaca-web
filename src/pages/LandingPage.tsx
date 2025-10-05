import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useEstablishmentsFilters } from "@/hooks/useEstablishmentsFilters.hook";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const {
    state,
    queryString,
    setPage,
    setLimit,
    setName,
    setAddress,
    setSorting,
  } = useEstablishmentsFilters();
  const {getEstablishments} = useEstablishmentApi()
  const { data, isPending, isError, error } = getEstablishments(
    queryString,
    state.page,
    state.limit,
    state.sortBy ?? "createdAt",
    state.sortOrder ?? "DESC",
  ) 
  const navigate = useNavigate()
  
  return (
    <div className="flex h-screen items-center justify-center">
 {data?.data.map(e => (
  <div className="" onClick={() => navigate(`/establishment/${e.id}`)}>{e.name}</div>
 ))}
    </div>
  );
}
