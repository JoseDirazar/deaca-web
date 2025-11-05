import { useState, useEffect } from "react";
import Input from "./Input";

export default function SearchInput({
  // TODO: implementar en las busquedas admin
  setSearch,
}: {
  setSearch: (val: string) => void;
}) {
  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(localValue);
    }, 400); // 400ms de debounce

    return () => clearTimeout(timeout);
  }, [localValue, setSearch]);

  return (
    <Input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      id="name-search"
      title="Buscar"
    />
  );
}
