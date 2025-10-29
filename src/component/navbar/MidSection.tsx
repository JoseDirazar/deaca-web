import { navLinks } from "@/lib/constants/nav-links";
import { Link, useLocation } from "react-router";

export default function MidSection() {
  const pathname = useLocation().pathname;
  return (
    <div className="hidden w-full gap-6 text-center text-xl text-primary md:flex">
      {navLinks.map((link) => (
        <Link
          className={
            link.active.includes(pathname) ? "text-fourth" : "text-primary"
          }
          key={link.to}
          to={link.to}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
