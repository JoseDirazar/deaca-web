import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";

export default function UserEstablishmentPage() {
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
      <UserEstablishmentsList myEstablishments={myEstablishments?.data || []} />
    </>
  );
}
