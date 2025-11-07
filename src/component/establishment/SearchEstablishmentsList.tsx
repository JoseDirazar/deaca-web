import type { Establishment } from "@/types/establishment/etablihment.interface";
import SearchEstablishmentsListItem from "./SearchEstablishmentsListItem";
import CardSkeleton from "../ui/CardSkeleton";
import { cn } from "@/lib/cn";
import CardsLoader from "../ui/CardsLoader";

interface SearchEstablishmentsListProps {
  isLoading: boolean;
  establishments: Establishment[] | undefined;
  isError: boolean;
  error: unknown;
  className?: string;
}
// TODO: reutilizar el componente con user dashboard establishments
export default function SearchEstablishmentsList({
  isLoading,
  establishments,
  isError,
  error,
  className,
}: SearchEstablishmentsListProps) {
  if (!establishments)
    return (
      <div className="p-4 text-center text-2xl font-extrabold text-wrap text-gray-300">
        No se encontraron resultados
      </div>
    );
  if (isLoading) return <CardsLoader />;
  if (isError) {
    console.error(error);
    return (
      <div className="p-4 text-center text-2xl font-extrabold text-wrap text-gray-300">
        Ocurrio un error al cargar la información, intente de nuevo
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {establishments?.map((e) => (
        <SearchEstablishmentsListItem key={e.id} establishment={e} />
      ))}
    </div>
  );
}
