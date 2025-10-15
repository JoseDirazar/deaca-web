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
    <SectionContainer className="flex flex-col items-center justify-center gap-6">
      <SectionHeader
        className=""
        title="Categorías"
        description=" "
        descriptionClassName="bg-fourth h-[2px] w-20 rounded-full"
      />
      <SectionBody className="grid w-full grid-cols-3 gap-18 text-sm md:grid-cols-4 lg:grid-cols-5 lg:px-[20%]">
        <CategoryListItem categories={categories} />
      </SectionBody>
    </SectionContainer>
  );
}
