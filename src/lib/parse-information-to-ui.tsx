import type { AccountStatus } from "@/types/common/api-request.interface";
import type { Roles } from "@/types/common/roles.interface";
import type { EstablishmentStatus } from "@/types/establishment/establishment-status.enum";

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
        <p className="rounded-full bg-green-500 px-2 py-1 text-white">Activo</p>
      );
    case "INACTIVE":
      return (
        <p className="rounded-full bg-red-500 px-2 py-1 text-white">Baneado</p>
      );
    case "PENDING":
      return (
        <p className="rounded-full bg-yellow-500 px-2 py-1 text-white">
          Pendiente
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
        <p className="rounded-full bg-green-500 px-2 py-1 text-white">Activo</p>
      );
    case "INACTIVE":
      return (
        <p className="rounded-full bg-red-500 px-2 py-1 text-white">Baneado</p>
      );
    case "PENDING":
      return (
        <p className="rounded-full bg-yellow-500 px-2 py-1 text-white">
          Pendiente
        </p>
      );
    default:
      return "Desconocido";
  }
};
