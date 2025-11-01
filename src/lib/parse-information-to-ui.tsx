import type { Roles } from "@/types/enums/roles.interface.enum";
import type { AccountStatus } from "@/types/enums/account-status.enum";
import type { AppReviewStatus } from "@/types/enums/app-review-status.enum";
import type { EstablishmentStatus } from "@/types/enums/establishment-status.enum";
import { FaCheck, FaX } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";

export const parseRoleToUI = (role: Roles) => {
  switch (role) {
    case "admin":
      return "Administrador";
    case "user":
      return "Usuario";
    case "business_owner":
      return "Emprendedor";
    default:
      return "Desconocido";
  }
};

export const parseAccountStatus = (status: AccountStatus) => {
  switch (status) {
    case "ACTIVE":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          <FaCheck className="font-bold text-green-500" /> Activo
        </p>
      );
    case "INACTIVE":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          <FaX className="font-bold text-red-500" /> Suspendido
        </p>
      );
    case "PENDING":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          <IoWarning className="font-bold text-yellow-500" /> Pendiente
        </p>
      );
    default:
      return "Desconocido";
  }
};

export const parseEstablishmentStatus = (status: EstablishmentStatus) => {
  switch (status) {
    case "ACTIVE":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          <FaCheck className="font-bold text-green-500" /> Activo
        </p>
      );
    case "INACTIVE":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          <FaX className="font-bold text-red-500" /> No Visible
        </p>
      );
    case "PENDING":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          {" "}
          <IoWarning className="font-bold text-yellow-500" /> Pendiente
        </p>
      );
    default:
      return "Desconocido";
  }
};

export const parseCommentStatus = (status: AppReviewStatus) => {
  switch (status) {
    case "APPROVED":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          <FaCheck className="font-bold text-green-500" /> Aprobado
        </p>
      );
    case "REJECTED":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          <FaX className="font-bold text-red-500" /> Rechazado
        </p>
      );
    case "PENDING":
      return (
        <p className="flex items-center justify-center gap-2 rounded px-2 py-1 text-center text-gray-500">
          {" "}
          <IoWarning className="font-bold text-yellow-500" /> Pendiente
        </p>
      );
    default:
      return "Desconocido";
  }
};
