import UserEstablishmentForm from "@/component/user/UserEstablishmentForm";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useParams } from "react-router";

export default function EditEstablishmentPage() {
  const { id } = useParams();
  const { getEstablishment } = useEstablishmentApi();
  const { data: establishment } = getEstablishment(id as string);
  return (
    <div className="p-6">
      <UserEstablishmentForm establishment={establishment} />
    </div>
  );
}
