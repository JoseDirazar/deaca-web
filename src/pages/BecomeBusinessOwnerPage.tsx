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
    <PageContainer>
      <PageHeader
        title="Tenes algun emprendimiento o local para registrar?"
        description="Registra tu emprendimiento o local para que los usuarios puedan buscarlo"
      />
      <Button
        label="Quiero registrar un emprendimiento"
        onClick={() => becomeBusinessOwner.mutateAsync({ email: user?.email })}
      />
    </PageContainer>
  );
}
