import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthApi } from "@/hooks/useAuthApi.hook";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import AuthOutletHeader from "@/component/ui/form/OutletHeader";
import AuthOutletForm from "@/component/ui/form/OutletForm";
import AuthOutletFooter from "@/component/ui/auth/AuthOutletFooter";
import GoogleBtn from "@/component/auth/GoogleBtn";
import type { PreviousWindowLocation } from "@/types/common/previous-window-location.interface";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuthApi();

  const from =
    (location.state as PreviousWindowLocation)?.from?.pathname ?? "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    await signIn.mutateAsync({ email, password });
    navigate(from, { replace: true });
  };

  return (
    <div>
      <AuthOutletHeader
        title="Inicia sesión"
        description="Ingresa Google en un paso!"
      />
      <GoogleBtn />
      <AuthOutletForm onSubmit={handleLogin}>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          title="Correo Electronico"
        />

        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          title="Contraseña"
        />
        <Button
          type="submit"
          disabled={signIn.isPending}
          label={signIn.isPending ? "Ingresando..." : "Ingresar"}
        />
      </AuthOutletForm>

      <AuthOutletFooter signUpLink sendRecoverLink resetPasswordLink />
    </div>
  );
}
