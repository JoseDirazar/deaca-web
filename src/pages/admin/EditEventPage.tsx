import AdminEventForm from "@/component/admin/AdminEventForm";
import { useEventApi } from "@/hooks/useEventApi.hook";
import { useParams } from "react-router";

export default function EditEventPage() {
  const { id } = useParams();
  const { useGetEventById } = useEventApi();
  const { data } = useGetEventById(id as string);

  return (
    <div className="p-6">
      <AdminEventForm event={data?.data ?? null} />
    </div>
  );
}
