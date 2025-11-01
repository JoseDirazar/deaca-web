import AdminNatureSpotForm from "@/component/admin/AdminNatureSpotForm";
import { useNatureSpotApi } from "@/hooks/useNatureSpotApi.hook";
import { useParams } from "react-router";

export default function EditNatureSpotPage() {
  const { id } = useParams();
  const { useGetNatureSpotById } = useNatureSpotApi();
  const { data } = useGetNatureSpotById(id as string);

  return (
    <div className="p-6">
      <AdminNatureSpotForm natureSpot={data?.data ?? null} />
    </div>
  );
}
