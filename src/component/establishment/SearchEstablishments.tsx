import type { Category } from "@/types/category/category.interface";
import { useNavigate } from "react-router";
import Button from "../ui/Button";
import { FaSearch } from "react-icons/fa";
import Input from "../ui/Input";
import { useMemo, useState } from "react";

export default function SearchEstablishments({
  categories,
}: {
  categories: Category[];
}) {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Filtrar subcategorías según la categoría seleccionada
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory, categories]);

  // Limpiar subcategoría si la categoría cambia
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(""); // Reset subcategory when category changes
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Solo agregar parámetros que tengan valor
    if (searchName.trim()) {
      params.set("name", searchName.trim());
    }

    if (selectedCategory) {
      params.append("categories[]", selectedCategory);
    }

    if (selectedSubcategory) {
      params.append("subcategories[]", selectedSubcategory);
    }

    // Siempre incluir valores por defecto de paginación
    params.set("page", "1");
    params.set("limit", "10");

    // Navegar con los parámetros de búsqueda
    navigate(`/emprendimientos?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="z-20 flex items-center justify-center overflow-hidden rounded-full bg-white">
      <div className="ml-2 flex w-full items-center gap-2 pl-4">
        <input
          placeholder="Buscar"
          type="text"
          id="search-all"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-fit border-none focus:border-none focus:outline-none active:border-none"
        />

        <select
          id="search-category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-fit border-none bg-transparent focus:border-none focus:outline-none active:border-none"
        >
          <option value="">Categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          id="search-subcategory"
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          disabled={!selectedCategory || availableSubcategories.length === 0}
          className="w-fit border-none bg-transparent focus:border-none focus:outline-none active:border-none disabled:opacity-50"
        >
          <option value="">Subcategorías</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        icon={<FaSearch className="text-2xl" />}
        className="aspect-square h-full rounded-full p-4"
        onClick={handleSearch}
      />
    </div>
  );
}
