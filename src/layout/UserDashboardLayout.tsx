import UserDashboardSidebar from "@/component/sidebars/UserDashboardSidebar";
import { Outlet } from "react-router";

export default function UserDashboardLayout() {
  return (
    <div className="flex h-screen flex-grow">
      <UserDashboardSidebar />
      <Outlet />
    </div>
  );
}
