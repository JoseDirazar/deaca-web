import type { NavbarRoutes } from "@/types/common/navbar-routes.interface";
import { FaUser } from "react-icons/fa6";
import { IoBusiness } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

export const userDashboardRoutes: NavbarRoutes = [
  {
    label: "Panel",
    icon: MdDashboard,
    href: "/usuario",
  },
  {
    label: "Perfil",
    icon: FaUser,
    href: "/usuario/perfil",
  },
  {
    label: "Emprendimientos",
    icon: IoBusiness,
    href: "/usuario/emprendimientos",
  },
];
