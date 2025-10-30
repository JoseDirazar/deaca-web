import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import { FaPlus } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";

export default function UserEstablishmentPage() {
  const location = useLocation();
  const { from } = location.state || {};
  const navigate = useNavigate();
  const { data: myEstablishments } =
    useEstablishmentApi().useGetMyEstablishments();
  return (
    <>
      <PageHeader
        title="Mis emprendimientos"
        description="Gestiona tus emprendimientos"
      />
      <Button
        label="Nuevo"
        onClick={() => navigate("/usuario/emprendimientos/nuevo")}
        icon={<FaPlus />}
        className="h-fit w-fit"
      />
      {from === "become-business-owner" && (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center font-century-gothic text-3xl font-bold text-gray-500">
          <p>Gracias por registrarte como emprendedor</p>
          <p className="text-lg">
            Por favor, completa el formulario para registrar tu emprendimiento
            presionando en el boton "Nuevo"
          </p>
        </div>
      )}
      <UserEstablishmentsList myEstablishments={myEstablishments?.data || []} />
    </>
  );
}
