import { adminRoutes } from "@/lib/constants/admin-nav-links";
import Sidebar from "../ui/Sidebar";

export default function AdminSidebar() {
  return <Sidebar routes={adminRoutes} title="Panel Adminitrador" />;
}
