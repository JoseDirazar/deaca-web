import { FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { IoBusiness } from "react-icons/io5";

export const adminRoutes = [
    {
        label: "Dashboard",
        icon: MdDashboard,
        href: "/admin/dashboard",
    },
    {
        label: "Categorias",
        icon: MdCategory,
        href: "/admin/categories",
    },
    {
        label: "Usuarios",
        icon: FaUsers,
        href: "/admin/users",
    },
    {
        label: "Establecimientos",
        icon: IoBusiness,
        href: "/admin/establishments",
    },
];