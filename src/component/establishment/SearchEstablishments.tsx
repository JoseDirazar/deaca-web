import type { Category } from "@/types/category/category.interface";
import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";
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

  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const category = categories.find((cat) => cat.name === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory, categories]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchName.trim()) {
      params.set("search", searchName.trim());
    }

    if (selectedCategory) {
      params.append("categories[]", selectedCategory);
    }

    if (selectedSubcategory) {
      params.append("subcategories[]", selectedSubcategory);
    }

    params.set("page", "1");
    params.set("limit", "10");

    navigate(`/emprendimientos?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="z-20 flex flex-col items-center justify-center gap-3 overflow-hidden rounded md:flex-row md:rounded-full md:bg-white/50">
      <div className="flex w-full flex-col items-center gap-3 md:mr-2 md:flex-row md:gap-2">
        <input
          placeholder="Buscar"
          type="text"
          id="search-all"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full rounded border-none bg-white/50 p-4 focus:border-none focus:outline-none active:border-none md:bg-transparent"
        />

        <select
          id="search-category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded border-none bg-white/50 p-4 focus:border-none focus:outline-none active:border-none md:bg-transparent"
        >
          <option value="">Categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          id="search-subcategory"
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          disabled={!selectedCategory || availableSubcategories.length === 0}
          className="w-full rounded border-none bg-white/50 p-4 focus:border-none focus:outline-none active:border-none disabled:text-gray-500 md:bg-transparent"
        >
          <option value="">Subcategorías</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.name}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="flex h-full w-full items-center justify-center gap-3 rounded bg-fourth px-4 py-4 text-center text-2xl text-white md:aspect-square md:w-fit md:rounded-full md:text-base"
        onClick={handleSearch}
      >
        <FaSearch className="text-3xl" />
        <p className="md:hidden">Buscar</p>
      </button>
    </div>
  );
}
