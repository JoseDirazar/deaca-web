import type { Category } from "@/types/category/category.interface";
import SectionContainer from "../ui/section/SectionContainer";
import SectionHeader from "../ui/section/SectionHeader";
import SearchEstablishments from "../establishment/SearchEstablishments";

export default function SearchSection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <SectionContainer>
      <SectionHeader title="Buscar" />
      <SearchEstablishments categories={categories} />
    </SectionContainer>
  );
}
