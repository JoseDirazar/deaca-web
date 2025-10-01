import { Link, useLocation, useNavigate } from "react-router";
import { useUserStore } from "@/context/useUserStore";
import SignOutButton from "./auth/SignOutButton";
import DLink from "./ui/DLink";
import { FaSignInAlt } from "react-icons/fa";
import { navLinks } from "@/lib/constants/nav-links";
import { MdAdminPanelSettings } from "react-icons/md";
import { useState } from "react";
import { generateImageUrl } from "@/lib/generate-image-url";

export default function Navbar() {
  const { user } = useUserStore();
  const pathname = useLocation().pathname;
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="bg-fifth shadow-lg">
      <h1 className="hidden">deacá guia de Olavarría</h1>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <Link
            to="/"
            className="-mt-1 flex items-center justify-center text-2xl"
          >
            <img
              src="/logos/logo-horizontal-a-color.png"
              alt="logo"
              width={170}
              height={170}
              className=""
            />{" "}
          </Link>
          <div className="hidden w-full items-center gap-4 p-4 font-century-gothic-bold text-primary xs:flex">
            {navLinks.map((link) => (
              <Link
                className={
                  link.active.includes(pathname)
                    ? "text-fourth"
                    : "text-primary"
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            {user ? (
              <div className="relative flex w-44 items-center justify-end gap-2">
                {user.role === "admin" && (
                  <Link to="/admin">
                    <MdAdminPanelSettings size={30} />
                  </Link>
                )}
                <button
                  onClick={() => setShowDropdownMenu(!showDropdownMenu)}
                  className="relative"
                >
                  <img
                    src={generateImageUrl("user", user?.avatar)}
                    alt="avatar"
                    className="h-14 w-14 rounded-full"
                  />
                </button>
                {showDropdownMenu && (
                  <div className="absolute top-15 z-10 flex w-44 origin-top flex-col divide-y-2 divide-primary rounded bg-fifth p-2 drop-shadow-xl">
                    <button className="py-2" onClick={() => navigate("/user")}>
                      Perfil
                    </button>
                    <button
                      className="py-2"
                      onClick={() => navigate("/user/establishments")}
                    >
                      Mis emprendimientos
                    </button>
                    <SignOutButton />
                  </div>
                )}
              </div>
            ) : (
              <DLink
                to="/auth/sign-in"
                label="Ingresar"
                icon={<FaSignInAlt size={20} />}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
