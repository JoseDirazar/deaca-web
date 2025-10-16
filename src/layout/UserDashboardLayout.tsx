import PageContainer from "@/component/ui/PageContainer";
import UserDashboardSidebar from "@/component/sidebars/UserDashboardSidebar";
import { Outlet } from "react-router";

export default function UserDashboardLayout() {
  return (
    <PageContainer className="flex-row">
      <UserDashboardSidebar />
      <div className="flex-1 p-12">
        <Outlet />
      </div>
    </PageContainer>
  );
}
