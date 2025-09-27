import { cn } from "@/lib/cn";
import { Link, useNavigate } from "react-router";
import { FaHome } from "react-icons/fa";
import { adminRoutes } from "@/lib/constants/admin-nav-links";

export default function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text font-nueva-bold text-2xl font-semibold text-primary select-none">
          Panel Administrador
        </h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {adminRoutes.map((route) => (
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
        <Link
          to="/"
          className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-lg text-white transition-transform hover:scale-110"
        >
          <FaHome size={20} className="inline-block" />
          Home
        </Link>
      </div>
    </div>
  );
}
