import { Outlet } from "react-router";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import { useState } from "react";
import MobileSidebar from "@/component/sidebars/MobileSidebar";

export default function RootLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="relative">
      <MobileSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

      <Navbar setShowSidebar={setShowSidebar} />
      <Outlet />
      <Footer />
    </div>
  );
}
