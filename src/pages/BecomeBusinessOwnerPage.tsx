import PageHeader from "@/component/PageHeader";
import Button from "@/component/ui/Button";
import PageContainer from "@/component/ui/PageContainer";
import { useUserApi } from "@/hooks/useUserApi.hook";
import { useUserStore } from "@/context/useUserStore";
import { Navigate } from "react-router";

export default function BecomeBusinessOwnerPage() {
  const { user } = useUserStore();
  const { becomeBusinessOwner } = useUserApi();
  if (!user || !user.email || user.role !== "user") return <Navigate to="/" />;
  return (
    <PageContainer className="gap-8 p-8">
      <PageHeader
        title="Tenes un emprendimiento o local?"
        description="Registra tu emprendimiento o local y llega a mas clientes"
        subdescription="Gestioná tus emprendimientso, estate al tanto de las metricas y los comentarios que recibes de nuestros usuarios"
      />
      <Button
        label="Registrarme como emprendedor"
        onClick={() => becomeBusinessOwner.mutateAsync({ email: user?.email })}
      />
    </PageContainer>
  );
}
