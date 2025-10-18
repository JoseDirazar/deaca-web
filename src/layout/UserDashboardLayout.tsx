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
        containerClassName="min-h-[calc(100vh-5rem)] h-full"
      />
      <div className="w-full flex-1 p-4">
        <Outlet />
      </div>
    </PageContainer>
  );
}
