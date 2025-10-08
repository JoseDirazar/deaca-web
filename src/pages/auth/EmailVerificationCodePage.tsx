import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthApi } from "@/hooks/useAuthApi.hook";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import AuthOutletHeader from "@/component/ui/form/OutletHeader";
import AuthOutletForm from "@/component/ui/form/OutletForm";
import AuthOutletFooter from "@/component/ui/auth/AuthOutletFooter";

export default function EmailVerificationCodePage() {
  const [email, setEmail] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const { confirmEmail, resendVerificationEmail } = useAuthApi();
  const navigate = useNavigate();

  const { isPending: isVerifying, mutateAsync: verifyEmail } = confirmEmail;
  const { isPending: isResending, mutateAsync: resendEmail } =
    resendVerificationEmail;

  useEffect(() => {
    const storedEmail = localStorage.getItem("pending_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !emailCode) {
      toast.error(
        email
          ? "Por favor ingresa el codigo de verificacion"
          : "Por favor ingresa tu correo electrónica y el codigo de verificacion",
      );
      return;
    }
    if (email) {
      localStorage.removeItem("pending_email");
    }
    await verifyEmail({ email, emailCode });
    navigate("/auth/ingresar");
  };

  return (
    <>
      <AuthOutletHeader
        title="Verificar su correo electrónica"
        description={
          email
            ? `Hemos enviado un codigo de verificacion a ${email}. Por favor ingrese el codigo de verificacion para verificar su cuenta.`
            : "Por favor ingrese su correo electrónica"
        }
      />

      <AuthOutletForm onSubmit={handleVerify}>
        {!email && (
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isVerifying}
            title="Correo electronico"
          />
        )}

        <Input
          id="verificationCode"
          type="text"
          value={emailCode}
          onChange={(e) => setEmailCode(e.target.value)}
          required
          disabled={isVerifying}
          title="Código de verificación"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isVerifying}
          label={isVerifying ? "Verificando..." : "Verificar"}
        />
      </AuthOutletForm>

      <div className="mt-10 border-t border-gray-200 text-center">
        <p className="mb-4 text-gray-600">
          No recibiste un código de verificación?
        </p>
        <Button
          onClick={() => resendEmail(email)}
          disabled={isResending}
          className="w-full bg-primary"
          label={isResending ? "Reenviando..." : "Reenviar"}
        />
      </div>

      <AuthOutletFooter signInLink />
    </>
  );
}
