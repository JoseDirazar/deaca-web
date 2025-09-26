import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth.hook";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import AuthOutletHeader from "@/component/ui/auth/AuthOutletHeader";
import AuthOutletForm from "@/component/ui/auth/AuthOutletForm";
import AuthOutletFooter from "@/component/ui/auth/AuthOutletFooter";
import GoogleBtn from "@/component/auth/GoogleBtn";

export default function SignupPage() {
  const { signUp } = useAuth();
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

    try {
      await signUp.mutateAsync({ firstName, lastName, email, password });
      toast.success(
        "Registro exitoso. Revisa tu email para verificar tu cuenta.",
      );
      navigate("/auth/sign-in", { replace: true });
    } catch (e) {
      // useAuth ya muestra toast de error
      console.error(e);
    }
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
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          title="Nombre"
        />

        <Input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          title="Apellido"
        />

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          title="Correo Electronico"
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          title="Contraseña"
        />

        <Button
          type="submit"
          disabled={signUp.isPending}
          label={signUp.isPending ? "Creando..." : "Crear cuenta"}
        />
      </AuthOutletForm>
      <AuthOutletFooter signInLink />
    </div>
  );
}
