import type { Category } from "@/types/category/category.interface";
import SectionContainer from "../../ui/section/SectionContainer";
import SectionHeader from "../../ui/section/SectionHeader";
import SearchEstablishments from "../../establishment/SearchEstablishments";
import TextSpawmer from "./TextSpawmer";

export default function SearchSection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <SectionContainer className="relative flex h-[600px] flex-col items-center justify-evenly overflow-hidden rounded-none">
      <SectionHeader
        title="deacá"
        className="z-20 text-center font-nueva text-8xl font-bold text-white"
      />
      <TextSpawmer />
      <SearchEstablishments categories={categories} />
      <div className="absolute inset-0 scale-105 bg-[url('/fondos/ola-arroyo.jpg')] bg-cover bg-center blur-[2px]" />
      <div className="absolute inset-0 bg-black/10" />
    </SectionContainer>
  );
}
