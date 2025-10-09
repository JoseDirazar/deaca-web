import type { Category } from "@/types/category/category.interface";
import { useNavigate } from "react-router";

export default function SearchEstablishments({
  categories,
}: {
  categories: Category[];
}) {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/emprendimientos")}>Buscar</button>
    </div>
  );
}
