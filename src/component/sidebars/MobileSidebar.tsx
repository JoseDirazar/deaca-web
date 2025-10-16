import { navLinks } from "@/lib/constants/nav-links";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link, useLocation } from "react-router";

export default function MobileSidebar({
  onClose,
  show,
}: {
  onClose: () => void;
  show: boolean;
}) {
  const [shouldRender, setShouldRender] = useState(show);
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (show) setTimeout(() => setShouldRender(true), 100);
    else setTimeout(() => setShouldRender(false), 300);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setTimeout(() => setShouldRender(false), 300);
  };

  return (
    <div
      className={
        shouldRender
          ? "fixed top-0 left-0 z-[100] flex h-screen w-full md:hidden"
          : "hidden"
      }
    >
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-xs"
        onClick={onClose}
      />
      <nav
        className={`${
          show ? "animate-slide-in-from-left" : "animate-slide-out-to-left"
        } z-[101] flex h-full w-2xs flex-col justify-between bg-gradient-to-b from-primary to-primary-hover p-4 transition-all`}
        onAnimationEnd={onAnimationEnd}
      >
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <img
              src="/logos/logo-horizontal-a-color.png"
              alt="logo"
              width={180}
              height={180}
              className=""
            />
            <button
              onClick={onClose}
              className="rounded-full bg-white p-2 text-fourth transition-colors hover:bg-fourth hover:text-white"
            >
              <IoClose className="h-8 w-8" />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-between gap-8 text-center text-2xl font-extrabold">
            {navLinks.map((link, index) => (
              <div className="flex w-fit flex-grow flex-col items-center">
                <Link
                  className={`${link.active.includes(pathname) ? "text-fourth" : "text-white"} p-2 transition-colors hover:bg-fourth hover:text-white`}
                  key={link.to}
                  to={link.to}
                >
                  {link.label}
                </Link>
                {index < navLinks.length - 1 && (
                  <div className="h-px w-full bg-white" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-white p-2 px-4 py-3 text-fourth transition-colors hover:bg-fourth hover:text-white"
          >
            <FaHome className="h-8 w-8" />
            <p className="text-center text-xl font-bold">Inicio</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}
