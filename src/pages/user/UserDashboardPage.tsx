import PageHeader from "@/component/PageHeader";
import AppReviewForm from "@/component/review/AppReviewForm";

export default function UserDashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Bienvenido al dashboard" />
      <AppReviewForm />
    </>
  );
}
