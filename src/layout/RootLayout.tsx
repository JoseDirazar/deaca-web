import { Outlet } from "react-router";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";

export default function RootLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
