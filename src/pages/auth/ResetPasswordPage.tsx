import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth.hook";
import AuthOutletHeader from "@/component/ui/auth/AuthOutletHeader";
import AuthOutletForm from "@/component/ui/auth/AuthOutletForm";
import Input from "@/component/ui/Input";
import AuthOutletFooter from "@/component/ui/auth/AuthOutletFooter";
import Button from "@/component/ui/Button";

export default function ResetPasswordPage() {
  const [resetPasswordState, setResetPasswordState] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { isPending: isResettingPassword, mutateAsync: resetPasswordAsync } =
    resetPassword;

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordState({
      ...resetPasswordState,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !resetPasswordState.newPassword ||
      !resetPasswordState.confirmPassword
    ) {
      toast.error("Por favor ingrese su nueva contraseña");
      return;
    }

    if (resetPasswordState.newPassword !== resetPasswordState.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (resetPasswordState.newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      await resetPasswordAsync({
        email: resetPasswordState.email,
        resetCode: resetPasswordState.resetCode,
        newPassword: resetPasswordState.newPassword,
      });
      toast.success("Restablecimiento de contraseña exitoso!");
      navigate("/auth/sign-in", { state: { passwordReset: true } });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to reset password",
        );
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Password reset error:", error);
    }
  };

  return (
    <div>
      <AuthOutletHeader
        title="Restablecer Contraseña"
        description="Por favor ingrese su nueva contraseña."
      ></AuthOutletHeader>
      <AuthOutletForm onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          value={resetPasswordState.email}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Correo Electronico"
        />

        <Input
          id="resetCode"
          type="text"
          value={resetPasswordState.resetCode}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Codigo de Restablecimiento"
        />

        <Input
          id="newPassword"
          type="password"
          value={resetPasswordState.newPassword}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Nueva Contraseña"
        />

        <Input
          id="confirmPassword"
          type="password"
          className="w-full py-5 pr-16"
          value={resetPasswordState.confirmPassword}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Confirmar Contraseña"
        />

        <Button
          type="submit"
          label={isResettingPassword ? "Resetting..." : "Reset Password"}
          disabled={isResettingPassword}
        />
      </AuthOutletForm>

      <AuthOutletFooter signInLink resetPasswordLink sendRecoverLink />
    </div>
  );
}
