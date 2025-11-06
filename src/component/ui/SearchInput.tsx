import { useEffect } from "react";
import Input from "./Input";

export default function SearchInput({
  // TODO: implementar en las busquedas admin
  setSearch,
  value,
}: {
  setSearch: (val: string) => void;
  value: string;
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(value);
    }, 400); // 400ms de debounce

    return () => clearTimeout(timeout);
  }, [value, setSearch]);

  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => setSearch(e.target.value)}
      id="name-search"
      title="Buscar"
    />
  );
}
