import { userDashboardRoutes } from "@/lib/constants/user-dashboard-links";
import Sidebar from "../ui/Sidebar";

export default function UserDashboardSidebar() {
  return <Sidebar routes={userDashboardRoutes} title="Panel de Usuario" />;
}
