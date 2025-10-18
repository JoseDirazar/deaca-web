import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import PageContainer from "@/component/ui/PageContainer";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";

export default function UserEstablishmentPage() {
  const navigate = useNavigate();
  const { data: myEstablishments, isPending: isLoadingMine } =
    useEstablishmentApi().useGetMyEstablishments();
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
      <UserEstablishmentsList
        isLoadingMine={isLoadingMine}
        myEstablishments={myEstablishments}
      />
    </PageContainer>
  );
}
