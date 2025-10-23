import PageContainer from "@/component/ui/PageContainer";
import { Outlet } from "react-router";
import Sidebar from "@/component/ui/Sidebar";
import { userDashboardRoutes } from "@/lib/constants/user-dashboard-links";
import { useEffect, useState } from "react";
import { useUserStore } from "@/context/useUserStore";

export default function UserDashboardLayout() {
  const [renderRoutes, setRenderRoutes] = useState(userDashboardRoutes);
  const { user } = useUserStore();
  useEffect(() => {
    if (user?.role === "user") {
      setRenderRoutes(
        userDashboardRoutes.filter((r) => r.label !== "Emprendimientos"),
      );
    }
  }, [user]);
  return (
    <PageContainer className="flex-row">
      <Sidebar
        routes={renderRoutes}
        title={`Panel de Usuario`}
        containerClassName="h-auto"
      />
      <div className="w-full flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </PageContainer>
  );
}
