import type { Category } from "@/types/category/category.interface";
import SectionContainer from "../../ui/section/SectionContainer";
import SectionHeader from "../../ui/section/SectionHeader";
import SearchEstablishments from "../../establishment/SearchEstablishments";
import TypingAnimation from "./TextAanimation";

export default function SearchSection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <SectionContainer className="relative flex min-h-[600px] w-full flex-1 flex-grow flex-col items-center overflow-hidden rounded-none p-0">
      <div className="z-20 flex h-full w-full max-w-2/3 flex-grow flex-col justify-around">
        <SectionHeader
          title="deacá"
          className="z-20 text-center font-nueva text-8xl font-bold text-white text-shadow-lg"
        />
        <TypingAnimation />
        <SearchEstablishments categories={categories} />
      </div>
      <div className="absolute inset-0 scale-105 bg-[url('/fondos/ola-arroyo.jpg')] bg-cover bg-center blur-[2px]" />
      <div className="absolute inset-0 bg-black/10" />
    </SectionContainer>
  );
}
