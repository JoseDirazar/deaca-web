import { useState, useEffect, useRef } from "react";

export default function TypingAnimation() {
  return (
    <div className="text-center">
      <ReactTypingLoop />
    </div>
  );
}

const phrases = [
  "Desarrollador Full Stack 💻",
  "Amante del código limpio ✨",
  "Creando experiencias únicas 🚀",
  "Innovación constante 🎯",
] as const;
function ReactTypingLoop() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];

    // Velocidades más naturales
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseAfterTyping = 2000;
    const pauseAfterDeleting = 500;

    const handleTyping = () => {
      if (!isDeleting && displayText === currentPhrase) {
        // Terminó de escribir, pausar antes de borrar
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseAfterTyping);
        return;
      }

      if (isDeleting && displayText === "") {
        // Terminó de borrar, pausar antes de siguiente frase
        setIsDeleting(false);
        timeoutRef.current = setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, pauseAfterDeleting);
        return;
      }

      // Efecto de typing más natural con variación de velocidad
      const variance = Math.random() * 30 - 15; // +/- 15ms de variación
      const currentSpeed = typingSpeed + variance;

      timeoutRef.current = setTimeout(() => {
        if (isDeleting) {
          setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        } else {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        }
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
