import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import AdminNatureSpotsList from "@/component/admin/AdminNatureSpotsList";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useNatureSpotApi } from "@/hooks/useNatureSpotApi.hook";

export default function AdminNatureSpotsPage() {
  const navigate = useNavigate();
  const { useGetNatureSpots } = useNatureSpotApi();
  const { data: natureSpots } = useGetNatureSpots();

  return (
    <>
      <PageHeader
        title="Paseos Naturales"
        description="Gestiona todos los paseos naturales"
      />
      <Button
        label="Nuevo"
        onClick={() => navigate("/admin/paseos-naturales/nuevo")}
        icon={<FaPlus />}
        className="my-4 h-fit w-fit"
      />
      <AdminNatureSpotsList natureSpots={natureSpots?.data || []} />
    </>
  );
}
