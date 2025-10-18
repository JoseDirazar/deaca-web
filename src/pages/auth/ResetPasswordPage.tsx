import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AuthOutletHeader from "@/component/ui/form/OutletHeader";
import AuthOutletForm from "@/component/ui/form/OutletForm";
import Input from "@/component/ui/Input";
import AuthOutletFooter from "@/component/auth/AuthOutletFooter";
import Button from "@/component/ui/Button";
import { useAuthApi } from "@/hooks/useAuthApi.hook";

export default function ResetPasswordPage() {
  const [resetPasswordState, setResetPasswordState] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { resetPassword } = useAuthApi();
  const { isPending: isResettingPassword, mutateAsync } = resetPassword;

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordState({
      ...resetPasswordState,
      [e.target.name]: e.target.value,
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
    await mutateAsync({
      email: resetPasswordState.email,
      resetCode: resetPasswordState.resetCode,
      newPassword: resetPasswordState.newPassword,
    });
    navigate("/auth/ingresar", { state: { passwordReset: true } });
  };

  return (
    <>
      <AuthOutletHeader
        title="Restablecer Contraseña"
        description="Por favor ingrese su nueva contraseña."
      ></AuthOutletHeader>
      <AuthOutletForm onSubmit={handleSubmit}>
        <Input
          id="reset-email"
          name="email"
          type="email"
          value={resetPasswordState.email}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Correo Electronico"
        />

        <Input
          id="reset-resetCode"
          name="resetCode"
          type="text"
          value={resetPasswordState.resetCode}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Codigo de Restablecimiento"
        />

        <Input
          id="reset-password-newPassword"
          name="newPassword"
          type="password"
          value={resetPasswordState.newPassword}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Nueva Contraseña"
        />

        <Input
          id="reset-password-confirmPassword"
          name="confirmPassword"
          type="password"
          value={resetPasswordState.confirmPassword}
          onChange={handleInputs}
          required
          disabled={isResettingPassword}
          title="Confirmar Contraseña"
        />

        <Button
          type="submit"
          className="w-full"
          label={
            isResettingPassword ? "Restableciendo..." : "Restablecer Contraseña"
          }
          disabled={isResettingPassword}
        />
      </AuthOutletForm>

      <AuthOutletFooter signInLink resetPasswordLink sendRecoverLink />
    </>
  );
}
