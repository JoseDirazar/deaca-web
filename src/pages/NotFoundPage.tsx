import PageHeader from "@/component/PageHeader";
import DLink from "@/component/ui/DLink";
import PageContainer from "@/component/ui/PageContainer";
import { ArrowLeftIcon } from "lucide-react";

export default function NotFoundPage() {
  return (
    <PageContainer className="items-center justify-center text-center">
      <PageHeader
        title="404"
        description="Pagina no encontrada"
        subdescription="Volver al inicio"
      />

      <DLink to="/" label="Volver" icon={<ArrowLeftIcon />} />
    </PageContainer>
  );
}
