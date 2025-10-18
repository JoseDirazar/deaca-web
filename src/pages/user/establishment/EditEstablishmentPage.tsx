import UserEstablishmentForm from "@/component/user/UserEstablishmentForm";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useParams } from "react-router";

export default function EditEstablishmentPage() {
  const { id } = useParams();
  const { useGetEstablishment } = useEstablishmentApi();
  const { data: establishment } = useGetEstablishment(id as string, {
    enabled: !!id,
  });
  return (
    <div className="p-6">
      <UserEstablishmentForm establishment={establishment} />
    </div>
  );
}
