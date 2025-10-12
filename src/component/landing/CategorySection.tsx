import type { Category } from "@/types/category/category.interface";
import SectionContainer from "../ui/section/SectionContainer";
import SectionHeader from "../ui/section/SectionHeader";
import SectionBody from "../ui/section/SectionBody";
import { CategoryListItem } from "../category/CategoryListItem";

export default function CategorySection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <SectionContainer>
      <SectionHeader title="Categorias" />
      <SectionBody className="flex flex-wrap items-center justify-between">
        <CategoryListItem categories={categories} />
      </SectionBody>
    </SectionContainer>
  );
}
