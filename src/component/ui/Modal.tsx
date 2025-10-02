import type { Dispatch, ReactNode, SetStateAction } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface ModalProps {
  children: ReactNode;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
}

export default function Modal({ children, setIsOpen }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-opacity-50 fixed inset-0 z-40 flex items-center justify-center bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-2 right-2">
          <button onClick={() => setIsOpen(false)}>
            <IoCloseCircle className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
