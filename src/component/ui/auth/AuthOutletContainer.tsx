import { Link, Outlet } from "react-router";
import { IoIosArrowBack } from "react-icons/io";

export default function AuthOutletContainer() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-fifth p-4 px-8 shadow-2xl lg:max-w-lg">
      <div className="flex w-full items-center justify-between">
        <Link to="/" className="flex items-center justify-center gap-2">
          <IoIosArrowBack className="text-primary" size={24} />
          <p className="text-center text-2xl font-bold text-primary">Atrás</p>
        </Link>
        <img src="/logos/logotipo.png" alt="deaca logo" className="h-16" />
      </div>
      <Outlet />
    </div>
  );
}
