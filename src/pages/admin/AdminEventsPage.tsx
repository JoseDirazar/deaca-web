import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import AdminEventsList from "@/component/admin/AdminEventsList";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useEventApi } from "@/hooks/useEventApi.hook";

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const { useGetEvents } = useEventApi();
  const { data: events } = useGetEvents();

  return (
    <>
      <PageHeader title="Eventos" description="Gestiona todos los eventos" />
      <Button
        label="Nuevo"
        onClick={() => navigate("/admin/eventos/nuevo")}
        icon={<FaPlus />}
        className="h-fit w-fit"
      />
      <AdminEventsList events={events?.data || []} />
    </>
  );
}
