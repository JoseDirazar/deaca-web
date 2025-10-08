import Button from "@/component/ui/Button";
import SectionContainer from "@/component/ui/section/SectionContainer";
import UserEstablishmentsList from "@/component/user/UserEtablishmentsList";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";

export default function UserEstablishmentPage() {
  const navigate = useNavigate();
  const { data: myEstablishments, isPending: isLoadingMine } =
    useEstablishmentApi().getMyEstablishments();

  return (
    <SectionContainer className="container w-full">
      <div className="p-3">
        <div className="mt-3 flex items-center justify-between py-3">
          <h2 className="text-3xl font-extrabold text-primary">
            Mis establecimientos
          </h2>
          <Button
            label="Nuevo establecimiento"
            onClick={() => navigate("/usuario/emprendimientos/nuevo")}
            icon={<FaPlus />}
          />
        </div>
      </div>
      <UserEstablishmentsList
        isLoadingMine={isLoadingMine}
        myEstablishments={myEstablishments}
      />
    </SectionContainer>
  );
}
