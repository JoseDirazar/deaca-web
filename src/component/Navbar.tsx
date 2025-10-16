import type { Dispatch, SetStateAction } from "react";
import LeftSection from "./ui/navbar/LeftSection";
import MidSection from "./ui/navbar/MidSection";
import RightSection from "./ui/navbar/RightSection";

export default function Navbar({
  setShowSidebar,
}: {
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <nav className="h-20 border-gray-400 bg-gray-50 shadow">
      <h1 className="hidden">deacá guia de Olavarría</h1>
      <div className="flex w-full items-center justify-between px-4 py-3">
        <LeftSection setShowSidebar={setShowSidebar} />
        <MidSection />
        <RightSection />
      </div>
    </nav>
  );
}
