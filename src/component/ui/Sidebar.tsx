import { FaHome } from "react-icons/fa";
import DLink from "./DLink";
import type { NavbarRoutes } from "@/types/common/navbar-routes.interface";
import { useNavigate } from "react-router";
import { cn } from "@/lib/cn";

export default function Sidebar({
  routes,
  title,
}: {
  routes: NavbarRoutes;
  title: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border-r bg-white">
      <div className="flex items-center border-b p-6">
        <h2 className="text text-center font-century-gothic-bold text-3xl font-semibold text-primary select-none">
          {title}
        </h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <button
            key={route.href}
            onClick={() => navigate(route.href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-110",
              location.pathname === route.href
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </button>
        ))}
      </nav>
      <div className="w-full p-4">
        <DLink
          to="/"
          className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-lg text-white transition-transform hover:scale-110"
          icon={<FaHome size={20} className="inline-block" />}
          label="Inicio"
        />
      </div>
    </div>
  );
}
