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
import UserProfilePage from "./pages/user/profile/UserProfilePage";
import UserEstablishmentPage from "./pages/user/establishment/UserEstablishmentPage";
import EstablishmentDetailPage from "./pages/establishment/EstablishmentDetailPage";
import EditEstablishmentPage from "./pages/user/establishment/EditEstablishmentPage";
import DiscoverEstablishmentsPage from "./pages/establishment/DiscoverEstablishmentsPage";
import AboutUsPage from "./pages/AboutUsPage";
import Open24HoursAndWeekendsPage from "./pages/Open24HoursAndWeekendsPage";
import WhatToDoPage from "./pages/WhatToDoPage";
import { Roles } from "@/types/common/roles.interface";
import { Suspense } from "react";
import Loader from "./component/ui/Loader";
import UserDashboardPage from "./pages/user/UserDashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <LandingPage />
            </Suspense>
          }
        />
        <Route path="sobre-nosotros" element={<AboutUsPage />} />
        <Route
          path="24-horas-y-domingos"
          element={<Open24HoursAndWeekendsPage />}
        />
        <Route path="que-hacer" element={<WhatToDoPage />} />

        <Route path="emprendimientos">
          <Route
            index
            element={
              <Suspense fallback={<Loader />}>
                <DiscoverEstablishmentsPage />
              </Suspense>
            }
          />

          <Route
            path=":slug"
            element={
              <Suspense fallback={<Loader />}>
                <EstablishmentDetailPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="auth/*" element={<AuthLayout />}>
          <Route path="ingresar" element={<SigninPage />} />
          <Route path="registrarse" element={<SignupPage />} />
          <Route
            path="verificar-codigo"
            element={<EmailVerificationCodePage />}
          />
          <Route
            path="restablecer-contraseña"
            element={<ResetPasswordPage />}
          />
          <Route path="recuperar-contraseña" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/usuario/*" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboardPage />} />
          <Route path="perfil" element={<UserProfilePage />} />
          <Route
            path="emprendimientos"
            element={
              <Suspense fallback={<Loader />}>
                <RequireAuth roles={[Roles.BUSINESS_OWNER, Roles.ADMIN]}>
                  <UserEstablishmentPage />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="emprendimientos/:slug"
            element={<EditEstablishmentPage />}
          />
        </Route>
      </Route>
      <Route
        path="/admin/*"
        element={
          <RequireAuth roles={[Roles.ADMIN]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="emprendimientos" element={<AdminEstablishmentsPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
