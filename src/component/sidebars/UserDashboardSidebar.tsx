import { userDashboardRoutes } from "@/lib/constants/user-dashboard-links";
import Sidebar from "../ui/Sidebar";

export default function UserDashboardSidebar() {
  return (
    <Sidebar
      routes={userDashboardRoutes}
      title="Panel de Usuario"
      containerClassName="min-h-[calc(100vh-5rem)] h-full"
    />
  );
}
