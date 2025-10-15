import { Link, Outlet } from "react-router";
import { IoIosArrowBack } from "react-icons/io";

export default function AuthOutletContainer() {
  return (
    <div className="z-10 flex w-full flex-col items-center justify-center gap-3 rounded-xl border-l-2 border-fourth bg-gray-50 p-4 px-6 drop-shadow-xl">
      <div className="flex w-full items-center justify-between">
        <Link to="/" className="flex items-center justify-center gap-2">
          <IoIosArrowBack className="text-primary" size={24} />
          <p className="text-center text-2xl font-bold text-primary">Atrás</p>
        </Link>
        <img src="/logos/logotipo.png" alt="deaca logo" className="h-16" />
      </div>
      <div className="flex w-full flex-col">
        <Outlet />
      </div>
    </div>
  );
}
