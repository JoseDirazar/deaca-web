import type { Establishment } from "@/types/establishment/etablihment.interface";
import SearchEstablishmentsListItem from "./SearchEstablishmentsListItem";
import CardSkeleton from "../ui/CardSkeleton";

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
  if (!establishments)
    return (
      <div className="p-4 text-center text-2xl font-extrabold text-wrap text-gray-300">
        No se encontraron resultados
      </div>
    );
  if (isLoading)
    return (
      <>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </>
    );
  if (isError) {
    console.error(error);
    return (
      <div className="p-4 text-center text-2xl font-extrabold text-wrap text-gray-300">
        Ocurrio un error al cargar la información, intente de nuevo
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {establishments?.map((e) => (
        <SearchEstablishmentsListItem key={e.id} establishment={e} />
      ))}
    </div>
  );
}
