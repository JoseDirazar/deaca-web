import type { Establishment } from "@/types/establishment/etablihment.interface";
import SearchEstablishmentsListItem from "./SearchEstablishmentsListItem";

interface SearchEstablishmentsListProps {
  isLoading: boolean;
  establishments: Establishment[] | undefined;
  isError: boolean;
  error: unknown;
}
// TODO: reutilizar el componente con user dashboard establishments
export default function SearchEstablishmentsList({
  isLoading,
  establishments,
  isError,
  error,
}: SearchEstablishmentsListProps) {
  if (!establishments) return <div>Aún no tienes establecimientos</div>;
  if (isLoading) return <div>Cargando...</div>;
  if (isError) {
    console.error(error);
    return <div>Error al cargar los establecimientos</div>;
  }
  return (
    <div className="flex flex-col gap-3">
      {establishments?.map((e) => (
        <SearchEstablishmentsListItem key={e.id} establishment={e} />
      ))}
    </div>
  );
}
