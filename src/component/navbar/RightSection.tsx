import SignOutButton from "@/component/auth/SignOutButton";
import { useUserStore } from "@/context/useUserStore";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { FaSignInAlt } from "react-icons/fa";
import { useState } from "react";
import DLink from "../ui/DLink";
import UserAvatar from "../ui/user/UserAvatar";

export default function RightSection() {
  // TODO: al iniciar sesión se activa el dropdown menu por alguna razón
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const handleClick = (to: string) => {
    setShowDropdownMenu(false);
    navigate(to);
  };
  return (
    <div>
      {user ? (
        <div className="relative flex w-26 items-center justify-end gap-2">
          {user.role === "admin" && (
            <Link to="/admin">
              <MdAdminPanelSettings size={30} />
            </Link>
          )}
          <button
            onClick={() => setShowDropdownMenu((prev) => !prev)}
            className="relative"
          >
            <UserAvatar avatar={user?.avatar} className="h-16 w-16" />
          </button>
          {showDropdownMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdownMenu(false)}
              />
              <div className="absolute top-15 z-50 flex w-44 origin-top flex-col divide-y-2 divide-primary rounded bg-gray-50 p-2 drop-shadow-xl">
                <button
                  className="py-2"
                  onClick={() => handleClick("/usuario")}
                >
                  Perfil
                </button>
                {user.role !== "user" && (
                  <button
                    className="py-2"
                    onClick={() => handleClick("/usuario/emprendimientos")}
                  >
                    Mis emprendimientos
                  </button>
                )}
                <SignOutButton setShowDropdownMenu={setShowDropdownMenu} />
              </div>
            </>
          )}
        </div>
      ) : (
        <DLink
          to="/auth/ingresar"
          label="Ingresar"
          icon={<FaSignInAlt size={20} />}
        />
      )}
    </div>
  );
}
