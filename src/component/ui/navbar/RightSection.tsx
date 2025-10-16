import SignOutButton from "@/component/auth/SignOutButton";
import { useUserStore } from "@/context/useUserStore";
import { generateImageUrl } from "@/lib/generate-image-url";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import DLink from "../DLink";
import { FaSignInAlt } from "react-icons/fa";
import { useState } from "react";

export default function RightSection() {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  return (
    <div>
      {user ? (
        <div className="relative flex w-44 items-center justify-end gap-2">
          {user.role === "admin" && (
            <Link to="/admin">
              <MdAdminPanelSettings size={30} />
            </Link>
          )}
          <button
            onClick={() => setShowDropdownMenu((prev) => !prev)}
            className="relative"
          >
            <img
              src={generateImageUrl("user", user?.avatar)}
              alt="avatar"
              className="h-14 w-14 rounded-full"
            />
          </button>
          {showDropdownMenu && (
            <div className="absolute top-15 z-50 flex w-44 origin-top flex-col divide-y-2 divide-primary rounded bg-gray-50 p-2 drop-shadow-xl">
              <button className="py-2" onClick={() => navigate("/usuario")}>
                Perfil
              </button>
              <button
                className="py-2"
                onClick={() => navigate("/usuario/emprendimientos")}
              >
                Mis emprendimientos
              </button>
              <SignOutButton />
            </div>
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
