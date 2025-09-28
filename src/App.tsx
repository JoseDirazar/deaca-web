import { Routes, Route } from "react-router";
import RootLayout from "./layout/RootLayout";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/auth/SigninPage";
import SignupPage from "./pages/auth/SignupPage";
import RequireAuth from "./component/auth/RequireAuth";
import EmailVerificationCodePage from "./pages/auth/EmailVerificationCodePage";
import AuthLayout from "./layout/AuthLayout";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminEstablishmentsPage from "./pages/admin/AdminEstablishmentsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import UserDashboardLayout from "./layout/UserDashboardLayout";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserEstablishmentPage from "./pages/user/UserEstablishmentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="auth/*" element={<AuthLayout />}>
          <Route path="sign-in" element={<SigninPage />} />
          <Route path="sign-up" element={<SignupPage />} />
          <Route path="verify-email" element={<EmailVerificationCodePage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="establishments" element={<AdminEstablishmentsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>
      <Route path="/user/*" element={<UserDashboardLayout />}>
        <Route index element={<UserProfilePage />} />
        <Route path="establishments" element={<UserEstablishmentPage />} />
      </Route>
    </Routes>
  );
}

export default App;
