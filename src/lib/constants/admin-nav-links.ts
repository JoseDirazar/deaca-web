import { FaUsers } from "react-icons/fa";
import { MdComment, MdDashboard } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { IoBusiness } from "react-icons/io5";
import { MdTrendingUp } from "react-icons/md";
import type { NavbarRoutes } from "@/types/common/navbar-routes.interface";

export const adminRoutes: NavbarRoutes = [
  {
    label: "Dashboard",
    icon: MdDashboard,
    href: "/admin",
  },
  {
    label: "Comentarios",
    icon: MdComment,
    href: "/admin/comentarios",
  },
  {
    label: "Categorias",
    icon: MdCategory,
    href: "/admin/categorias",
  },
  {
    label: "Usuarios",
    icon: FaUsers,
    href: "/admin/usuarios",
  },
  {
    label: "Establecimientos",
    icon: IoBusiness,
    href: "/admin/emprendimientos",
  },
  {
    label: "Tendencias",
    icon: MdTrendingUp,
    href: "/admin/tendencias",
  },
];
