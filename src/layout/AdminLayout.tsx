import AdminSidebar from "@/component/sidebars/AdminSidebar";
import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="flex h-screen flex-grow">
      <AdminSidebar />
      <Outlet />
    </div>
  );
}
