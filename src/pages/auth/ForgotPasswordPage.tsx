import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthApi } from "@/hooks/useAuthApi.hook";
import AuthOutletHeader from "@/component/ui/form/OutletHeader";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import AuthOutletForm from "@/component/ui/form/OutletForm";
import AuthOutletFooter from "@/component/auth/AuthOutletFooter";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { requestPasswordReset } = useAuthApi();
  const { isPending: isLoading, mutateAsync, isSuccess } = requestPasswordReset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor ingresa tu correo electrónica");
      return;
    }

    await mutateAsync({ email });
    navigate("/auth/restablecer-contraseña");
  };

  return (
    <>
      <AuthOutletHeader
        title="¿Olvidaste tu contraseña?"
        description="No te preocupes. Ingresa tu correo electrónica a continuación y te enviaremos un enlace para restablecer tu contraseña."
      />
      {!isSuccess ? (
        <>
          <AuthOutletForm onSubmit={handleSubmit}>
            <Input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              title="Correo Electronico"
            />

            <Button
              type="submit"
              className="w-full"
              label={isLoading ? "Enviando..." : "Restablecer Contraseña"}
              disabled={isLoading}
            />
          </AuthOutletForm>
          <AuthOutletFooter resetPasswordLink />
        </>
      ) : (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
          <h2 className="mb-2 text-lg font-semibold">Check your email</h2>
          <p>
            Hemos enviado un enlace para restablecer tu contraseña a{" "}
            <strong>{email}</strong>. Por favor, revisa tu correo electrónico y
            sigue las instrucciones para restablecer tu contraseña.
          </p>
          <Button
            onClick={() => navigate("/auth/reset-password")}
            className="mt-4 w-full"
            label="Restablecer Contraseña"
          />
        </div>
      )}
    </>
  );
}
