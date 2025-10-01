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
        "Por favor ingresa tu correo electrónica y el codigo de verificacion",
      );
      return;
    }

    await verifyEmail({ email, emailCode });
    navigate("/sign-in");
  };

  return (
    <div className="">
      <AuthOutletHeader
        title="Verificar su correo electrónica"
        description="Hemos enviado un codigo de verificacion a <strong>{email}</strong>. Por favor ingrese el codigo de verificacion para verificar su cuenta."
      />

      <AuthOutletForm onSubmit={handleVerify}>
        {!email && (
          <Input
            id="email"
            type="email"
            className="w-full py-5"
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
          className="w-full py-5"
          value={emailCode}
          onChange={(e) => setEmailCode(e.target.value)}
          required
          disabled={isVerifying}
          title="Código de verificación"
        />

        <Button
          type="submit"
          className="hover:bg-primary-600 w-full bg-primary py-6 text-white"
          disabled={isVerifying}
          label={isVerifying ? "Verificando..." : "Verificar"}
        />
      </AuthOutletForm>

      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="mb-4 text-gray-600">
          No recibiste un código de verificación?
        </p>
        <Button
          onClick={() => resendEmail(email)}
          className="mx-auto"
          disabled={isResending}
          label={isResending ? "Reenviando..." : "Reenviar"}
        />
      </div>

      <AuthOutletFooter signInLink />
    </div>
  );
}
