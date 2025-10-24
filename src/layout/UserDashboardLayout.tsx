import PageContainer from "@/component/ui/PageContainer";
import { Outlet } from "react-router";
import Sidebar from "@/component/ui/Sidebar";
import { userDashboardRoutes } from "@/lib/constants/user-dashboard-links";
import { useEffect, useState } from "react";
import { useUserStore } from "@/context/useUserStore";
import Modal from "@/component/ui/Modal";
import AppReviewForm from "@/component/review/AppReviewForm";

export default function UserDashboardLayout() {
  const [renderRoutes, setRenderRoutes] = useState(userDashboardRoutes);
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (user?.role === "user") {
      setRenderRoutes(
        userDashboardRoutes.filter((r) => r.label !== "Emprendimientos"),
      );
    }
  }, [user]);
  return (
    <PageContainer className="relative flex-row">
      <Sidebar
        routes={renderRoutes}
        title={`Panel de Usuario`}
        containerClassName="h-auto"
      />
      <div className="flex w-full flex-1 flex-col gap-4 overflow-auto p-4">
        <Outlet />
      </div>
      <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
        <AppReviewForm />
      </Modal>
    </PageContainer>
  );
}
