import type { Category } from "@/types/category/category.interface";
import { useNavigate } from "react-router";
import Button from "../ui/Button";
import { FaSearch } from "react-icons/fa";
import Input from "../ui/Input";

export default function SearchEstablishments({
  categories,
}: {
  categories: Category[];
}) {
  const navigate = useNavigate();
  return (
    <div className="z-20 flex items-center justify-center overflow-hidden rounded-full bg-white">
      <div className="ml-2 flex w-full items-center pl-4">
        <input
          placeholder="Buscar"
          type="text"
          id="search-all"
          className="w-fit border-none focus:border-none focus:outline-none active:border-none"
        />
        <input
          placeholder="Categorias"
          type="text"
          id="search-category"
          className="w-fit border-none focus:border-none focus:outline-none active:border-none"
        />
        <input
          placeholder="Subcategorias"
          type="text"
          id="search-subcategory"
          className="w-fit border-none focus:border-none focus:outline-none active:border-none"
        />
      </div>
      <Button
        icon={<FaSearch className="text-2xl" />}
        className="aspect-square h-full rounded-full p-4"
        onClick={() => navigate("/emprendimientos")}
      />
    </div>
  );
}
