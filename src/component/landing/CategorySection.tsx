import type { Category } from "@/types/category/category.interface";
import SectionContainer from "../ui/section/SectionContainer";
import SectionHeader from "../ui/section/SectionHeader";
import SectionBody from "../ui/section/SectionBody";
import { CategoryList } from "../category/CategoryListItem";

export default function CategorySection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <SectionContainer className="flex flex-col items-center justify-center gap-8">
      <SectionHeader title="Categorías" separator />
      <SectionBody className="grid w-full grid-cols-3 gap-4 text-xs md:grid-cols-4 lg:grid-cols-5">
        <CategoryList categories={categories} />
      </SectionBody>
    </SectionContainer>
  );
}
