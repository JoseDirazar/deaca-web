import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth.hook";

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      await signUp.mutateAsync({ firstName, lastName, email, password });
      toast.success("Registro exitoso. Revisa tu email para verificar tu cuenta.");
      navigate("/auth/sign-in", { replace: true });
    } catch (e) {
      // useAuth ya muestra toast de error
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: 16 }}>Crear cuenta</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label>Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Tu apellido"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
        <div>
          <label>Contraseña</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        <button type="submit" disabled={signUp.isPending}>
          {signUp.isPending ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        ¿Ya tienes cuenta? <Link to="/auth/sign-in">Inicia sesión</Link>
      </p>
    </div>
  );
}
