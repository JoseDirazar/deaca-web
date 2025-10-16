import { useCallback, useEffect, useState } from "react";

export default function TextSpawmer() {
  const texts = useCallback(
    () => [
      "Emprendimientos de Olavarría",
      "Ejemplo de Texto",
      "De acá, Olavarría",
    ],
    [],
  );

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0); // índice de la frase actual
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: number;

    const current = texts()[index % texts().length];
    const speed = isDeleting ? 60 : 100; // velocidad al borrar/escribir

    if (!isDeleting && text.length < current.length) {
      // Escribiendo
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length + 1));
      }, speed);
    } else if (isDeleting && text.length > 0) {
      // Borrando
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length - 1));
      }, speed);
    } else if (!isDeleting && text.length === current.length) {
      // Pausa al final antes de borrar
      timeout = setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && text.length === 0) {
      // Pasar a la siguiente frase
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts().length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, texts]);

  return (
    <div className="z-30 flex h-10 w-full items-center justify-center">
      <p className="text-2xl font-semibold text-white transition-all">{text}</p>
    </div>
  );
}
