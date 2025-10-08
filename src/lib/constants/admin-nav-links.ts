import { FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { IoBusiness } from "react-icons/io5";
import type { NavbarRoutes } from "@/types/common/navbar-routes.interface";

export const adminRoutes: NavbarRoutes = [
    {
        label: "Dashboard",
        icon: MdDashboard,
        href: "/admin/dashboard",
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
];