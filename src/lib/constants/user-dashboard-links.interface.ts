import type { NavbarRoutes } from "@/types/common/navbar-routes.interface";
import { FaUser } from "react-icons/fa6";
import { IoBusiness } from "react-icons/io5";

export const userDashboardRoutes: NavbarRoutes = [
    {
        label: "Perfil",
        icon: FaUser,
        href: "/user/perfil",
    },
    {
        label: "Establecimientos",
        icon: IoBusiness,
        href: "/user/establishments",
    },
]