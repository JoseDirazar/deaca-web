import { useState, useEffect, useRef } from "react";

export default function TypingAnimation() {
  return (
    <div className="text-center">
      <ReactTypingLoop />
    </div>
  );
}

const phrases = [
  "Pizza de masa madre",
  "Un regalo especial",
  "Shampoo sólido",
  "Una modista",
  "Podóloga a domicilio",
  "Quien arregla tu compu",
  "Paseador para tu perro",
  "Semillas orgánicas",
  "Animador infantíl",
  "Ambientar tu fiesta",
  "El horario del consultorio",
  "Quién repara tu heladera",
  "Encontrá tu masajista cerca",
  "Gimnasio con aparatos",
  "Clases de apoyo",
  "Un cafe tranqui",
  "Programa para el finde",
  "Un parque diferente",
  "Data de Olavarría",
  "Algo abierto 3 am",
  "Empanadas lunes a la noche",
  "Remis después de las 12",
  "Cerveza artesanal",
  "Encontrá Taller de pintura",
] as const;

function ReactTypingLoop() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseAfterTyping = 2000;
    const pauseAfterDeleting = 500;

    const handleTyping = () => {
      // Completó la escritura
      if (!isDeleting && displayText === currentPhrase) {
        timeoutRef.current = window.setTimeout(() => {
          setIsDeleting(true);
        }, pauseAfterTyping);
        return;
      }

      // Terminó de borrar
      if (isDeleting && displayText === "") {
        timeoutRef.current = window.setTimeout(() => {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, pauseAfterDeleting);
        return;
      }

      const variance = Math.random() * 40 - 20; // +/- 20ms de variación
      const currentSpeed = typingSpeed + variance;

      timeoutRef.current = window.setTimeout(() => {
        const nextText = isDeleting
          ? currentPhrase.substring(0, displayText.length - 1)
          : currentPhrase.substring(0, displayText.length + 1);

        setDisplayText(nextText);
      }, currentSpeed);
    };

    handleTyping();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, isDeleting, currentPhraseIndex]);

  return (
    <div className="relative max-h-10">
      <p className="font-mono text-3xl text-white md:text-4xl">
        {displayText}
        <span className="animate-pulse text-cyan-400">|</span>
      </p>
    </div>
  );
}
