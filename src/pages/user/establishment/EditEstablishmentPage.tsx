import UserEstablishmentForm from "@/component/user/UserEstablishmentForm";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useParams } from "react-router";

export default function EditEstablishmentPage() {
  const { slug } = useParams();
  const { useGetEstablishmentBySlug } = useEstablishmentApi();
  const { data } = useGetEstablishmentBySlug(slug as string, {
    enabled: !!slug,
  });
  return (
    <div className="p-6">
      <UserEstablishmentForm establishment={data} />
    </div>
  );
}
