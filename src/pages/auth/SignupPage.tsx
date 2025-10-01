import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthApi } from "@/hooks/useAuthApi.hook";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import AuthOutletHeader from "@/component/ui/form/OutletHeader";
import AuthOutletForm from "@/component/ui/form/OutletForm";
import AuthOutletFooter from "@/component/ui/auth/AuthOutletFooter";
import GoogleBtn from "@/component/auth/GoogleBtn";

export default function SignupPage() {
  const { signUp } = useAuthApi();
  const { isPending: isLoading, mutateAsync } = signUp;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.error("Completa todos los campos");
      return;
    }
    await mutateAsync({ firstName, lastName, email, password });
    navigate("/auth/sign-in", { replace: true });
  };

  return (
    <div>
      <AuthOutletHeader
        title="Crear cuenta"
        description="Registrate con Google en un paso!"
      ></AuthOutletHeader>
      <GoogleBtn />
      <AuthOutletForm onSubmit={onSubmit}>
        <Input
          id="signup-firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          title="Nombre"
        />

        <Input
          id="signup-lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          title="Apellido"
        />

        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          title="Correo Electronico"
        />

        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          title="Contraseña"
        />

        <Button
          type="submit"
          disabled={isLoading}
          label={isLoading ? "Creando..." : "Crear cuenta"}
        />
      </AuthOutletForm>
      <AuthOutletFooter signInLink />
    </div>
  );
}
