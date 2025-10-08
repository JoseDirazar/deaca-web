import type { Category } from "@/types/category/category.interface";
import SectionContainer from "../ui/section/SectionContainer";
import { generateImageUrl } from "@/lib/generate-image-url";
import SectionHeader from "../ui/section/SectionHeader";
import SectionBody from "../ui/section/SectionBody";
import { TbCategory2 } from "react-icons/tb";

export default function CategorySection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <SectionContainer>
      <SectionHeader title="Categorias" />
      <SectionBody>
        <CategoryListItem categories={categories} />
      </SectionBody>
    </SectionContainer>
  );
}

function CategoryListItem({ categories }: { categories: Category[] }) {
  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-3">
          {category.icon ? (
            <img
              src={generateImageUrl("category", category.icon)}
              alt={category.name}
              className="h-16 w-16"
            />
          ) : (
            <TbCategory2 className="h-16 w-16" />
          )}
          <p className="text-lg font-semibold">{category.name}</p>
        </div>
      ))}
    </>
  );
}
