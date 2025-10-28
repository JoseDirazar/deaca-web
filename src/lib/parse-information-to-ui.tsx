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
        <p className="rounded bg-green-100 px-2 py-1 text-green-500">Activo</p>
      );
    case "INACTIVE":
      return (
        <p className="rounded bg-red-100 px-2 py-1 text-red-500">Baneado</p>
      );
    case "PENDING":
      return (
        <p className="rounded bg-yellow-100 px-2 py-1 text-yellow-500">
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
        <p className="rounded bg-green-100 px-2 py-1 text-green-500">Activo</p>
      );
    case "INACTIVE":
      return (
        <p className="rounded bg-red-100 px-2 py-1 text-red-500">Baneado</p>
      );
    case "PENDING":
      return (
        <p className="rounded bg-yellow-100 px-2 py-1 text-yellow-500">
          Pendiente
        </p>
      );
    default:
      return "Desconocido";
  }
};
