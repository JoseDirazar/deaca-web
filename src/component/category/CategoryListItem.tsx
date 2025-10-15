import { cn } from "@/lib/cn";
import { generateImageUrl } from "@/lib/generate-image-url";
import type { Category } from "@/types/category/category.interface";
import { TbCategory2 } from "react-icons/tb";

export function CategoryListItem({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  console.log(categories);
  return (
    <>
      {categories.map((category) => (
        <div
          key={category.id}
          className={cn("flex flex-col items-center gap-3", className)}
        >
          {category.icon ? (
            <img
              src={generateImageUrl("category", category.icon)}
              alt={category.name}
              className="h-12 w-12 object-cover"
            />
          ) : (
            <TbCategory2 className="h-12 w-12" />
          )}
          <p className="font-century-gothic text-base font-bold tracking-wide text-fourth">
            {category.name}
          </p>
        </div>
      ))}
    </>
  );
}
