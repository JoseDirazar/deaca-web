import { Link } from "react-router";
import { useUserStore } from "@/context/useUserStore";
import SignOutButton from "./auth/SignOutButton";

export default function Navbar() {
  const { user } = useUserStore();

  return (
    <nav className="bg-fifth text-white shadow-lg">
      <h1 className="hidden">deacá guia de Olavarría</h1>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center justify-center text-2xl">
            <img
              src="/logos/logo-horizontal-a-color.png"
              alt="logo"
              width={170}
              height={170}
              className=""
            />{" "}
          </Link>
          <p className="hidden items-center pt-1 text-center font-century-gothic-bold text-base text-primary transform-content xs:flex sm:text-2xl md:justify-center">
            De Turno
          </p>
          <div>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/protected">Ir a protegida</Link>
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/sign-in">Iniciar sesión</Link>
                <Link to="/auth/sign-up">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
