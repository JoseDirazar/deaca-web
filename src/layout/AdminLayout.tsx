import Sidebar from "@/component/ui/Sidebar";
import { adminRoutes } from "@/lib/constants/admin-nav-links";
import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="flex h-screen flex-grow flex-row overflow-auto">
      <Sidebar
        routes={adminRoutes}
        title="Panel Adminitrador"
        containerClassName="h-auto"
      />
      <div className="w-full flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}
