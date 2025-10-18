import { FaHome } from "react-icons/fa";
import type { NavbarRoutes } from "@/types/common/navbar-routes.interface";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/cn";
import { TbCategory } from "react-icons/tb";

export default function Sidebar({
  routes,
  title,
  containerClassName,
}: {
  routes: NavbarRoutes;
  title: string;
  containerClassName?: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "flex h-full max-w-1/4 flex-col items-center justify-start border-r border-gray-400 bg-white md:py-4",
        containerClassName,
      )}
    >
      <div className="flex items-center p-2">
        <TbCategory className="inline-block h-11 w-11 text-primary md:hidden" />
        <h2 className="hidden text-center font-century-gothic text-3xl font-semibold text-wrap text-primary select-none md:block">
          {title}
        </h2>
      </div>
      <nav className="flex w-full flex-1 flex-col items-center p-2">
        {routes.map((route) => (
          <button
            key={route.href}
            onClick={() => navigate(route.href)}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-110 md:justify-start",
              location.pathname === route.href
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <route.icon className="h-5 w-5" />
            <p className="hidden md:block">{route.label}</p>
          </button>
        ))}
      </nav>
      <div className="w-full p-2">
        <Link
          to="/"
          className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-lg text-white transition-transform hover:scale-110 md:w-full"
        >
          <FaHome size={20} className="inline-block" />
          <p className="hidden md:block">Inicio</p>
        </Link>
      </div>
    </div>
  );
}
