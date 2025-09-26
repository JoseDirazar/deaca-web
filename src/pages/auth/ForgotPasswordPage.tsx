import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth.hook";
import AuthOutletHeader from "@/component/ui/auth/AuthOutletHeader";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import AuthOutletForm from "@/component/ui/auth/AuthOutletForm";
import AuthOutletFooter from "@/component/ui/auth/AuthOutletFooter";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset.mutateAsync({ email });
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message ||
            "Algo salio mal al enviar el correo",
        );
      } else {
        toast.error("Algo salio mal al enviar el correo");
      }
      console.error("Password reset request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <AuthOutletHeader
        title="¿Olvidaste tu contraseña?"
        description="No te preocupes. Ingresa tu correo electrónica a continuación y te enviaremos un enlace para restablecer tu contraseña."
      />
      {!isSubmitted ? (
        <>
          <AuthOutletForm onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              className="w-full py-5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              title="Correo Electronico"
            />

            <Button
              type="submit"
              label={isLoading ? "Sending..." : "Reset password"}
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
            className="mt-4"
            label="Restablecer Contraseña"
          />
        </div>
      )}
    </div>
  );
}
