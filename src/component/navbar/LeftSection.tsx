import type { Dispatch, SetStateAction } from "react";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router";

export default function LeftSection({
  setShowSidebar,
}: {
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div>
      <Link
        to="/"
        className="-mt-1 mr-4 hidden items-center justify-center md:flex"
      >
        <img
          src="/logos/logo-horizontal-a-color.png"
          alt="logo"
          width={170}
          height={170}
          className=""
        />{" "}
      </Link>
      <button
        className="md:hidden"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <IoMenu strokeWidth="1" className="h-9 w-9 text-primary" />
      </button>
    </div>
  );
}
