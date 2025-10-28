import SearchEstablishmentsList from "@/component/establishment/SearchEstablishmentsList";
import Button from "@/component/ui/Button";
import PageContainer from "@/component/ui/PageContainer";
import SectionHeader from "@/component/ui/section/SectionHeader";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import type { Category } from "@/types/category/category.interface";
import { useEffect, useState } from "react";

export default function Open24HoursAndWeekendsPage() {
  const { data, isPending, isError, error } = useCategoryApi().useGetCategories(
    {
      select: ["24Hs", "Domingos"],
    },
  );
  const [selected, setSelected] = useState<Category | null>(null);

  useEffect(() => {
    if (data?.data?.length) {
      setSelected(data?.data?.[0]);
    }
  }, [data]);
  return (
    <PageContainer className="flex flex-col items-center gap-4 p-4">
      <SectionHeader
        className="text-fourth"
        title="24/7"
        description="Encontrá que esta disponible 24 horas y domingos"
        separator
      />
      <CategorySelector
        categories={data?.data || []}
        setSelected={setSelected}
        selected={selected}
      />
      <SearchEstablishmentsList
        className="p-2"
        establishments={selected?.establishments || []}
        isLoading={isPending}
        isError={isError}
        error={error}
      />
    </PageContainer>
  );
}

const CategorySelector = ({
  categories,
  setSelected,
  selected,
}: {
  categories: Category[];
  setSelected: React.Dispatch<React.SetStateAction<Category | null>>;
  selected: Category | null;
}) => {
  return (
    <div className="flex w-full justify-center gap-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          label={category.name}
          onClick={() => setSelected(category)}
          className={`max-w-3xs flex-1 ${selected?.id === category.id ? "bg-primary" : ""}`}
        />
      ))}
    </div>
  );
};
