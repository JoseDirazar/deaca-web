import { Routes, Route } from "react-router";
import RootLayout from "./pages/RootLayout";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/auth/SigninPage";
import SignupPage from "./pages/auth/SignupPage";
import ProtectedExamplePage from "./pages/ProtectedExamplePage";
import RequireAuth from "./component/auth/RequireAuth";
import EmailVerificationCodePage from "./pages/auth/EmailVerificationCodePage";
import AuthLayout from "./pages/auth/AuthLayout";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

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
        <Route
          path="/protected"
          element={
            <RequireAuth>
              <ProtectedExamplePage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
