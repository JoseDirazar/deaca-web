import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth.hook";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import AuthOutletHeader from "@/component/ui/auth/AuthOutletHeader";
import AuthOutletForm from "@/component/ui/auth/AuthOutletForm";
import AuthOutletFooter from "@/component/ui/auth/AuthOutletFooter";

export default function EmailVerificationCodePage() {
  const [email, setEmail] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { confirmEmail, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("pending_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !emailCode) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsVerifying(true);
    try {
      await confirmEmail.mutateAsync({ email, emailCode });
      toast.success("Email verified successfully!");
      navigate("/sign-in");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to verify email");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Email verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail.mutateAsync(email);
      toast.success("Verification email resent");
    } catch (error) {
      console.error("Resend email error:", error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to resend email");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsResending(false);
    }
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
          onClick={handleResend}
          className="mx-auto"
          disabled={isResending}
          label={isResending ? "Reenviando..." : "Reenviar"}
        />
      </div>

      <AuthOutletFooter signInLink />
    </div>
  );
}
