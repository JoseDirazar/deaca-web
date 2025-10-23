import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import PageContainer from "@/component/ui/PageContainer";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { establishmentService } from "@/api/establishment-service";

export default function UserEstablishmentPage() {
  const navigate = useNavigate();
  const { data: myEstablishments } = useSuspenseQuery({
    queryKey: ["establishment", "me"],
    queryFn: () => establishmentService.getMine().then((res) => res.data.data),
  });
  return (
    <PageContainer className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col gap-3 md:flex-row md:justify-between">
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
      </div>
      <UserEstablishmentsList myEstablishments={myEstablishments} />
    </PageContainer>
  );
}
