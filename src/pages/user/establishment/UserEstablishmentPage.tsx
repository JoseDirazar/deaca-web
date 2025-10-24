import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { establishmentService } from "@/api/establishment-service";

export default function UserEstablishmentPage() {
  const navigate = useNavigate();
  const { data: myEstablishments } = useSuspenseQuery({
    queryKey: ["establishments", "me"],
    queryFn: () => establishmentService.getMine().then((res) => res.data.data),
  });
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
      <UserEstablishmentsList myEstablishments={myEstablishments} />
    </>
  );
}
