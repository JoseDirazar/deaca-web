import type { Dispatch, SetStateAction } from "react";
import LeftSection from "./navbar/LeftSection";
import MidSection from "./navbar/MidSection";
import RightSection from "./navbar/RightSection";

export default function Navbar({
  setShowSidebar,
}: {
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <nav className="flex h-20 items-center justify-center border-gray-400 bg-gray-50 shadow">
      <h1 className="hidden">deacá guia de Olavarría</h1>
      <div className="flex h-full w-full items-center justify-between px-4">
        <LeftSection setShowSidebar={setShowSidebar} />
        <MidSection />
        <RightSection />
      </div>
    </nav>
  );
}
