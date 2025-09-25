import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import GoogleBtn from "../../component/auth/GoogleBtn";
import type { PreviousWindowLocation } from "../../types/common/previous-window-location.interface";
import { useAuth } from "../../hooks/useAuth.hook";

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Get the return path from location state, or default to home
  const from =
    (location.state as PreviousWindowLocation)?.from?.pathname ?? "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      await signIn.mutateAsync({ email, password });
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Invalid email or password");
      console.error("Login error:", error);
    } finally {
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: 16 }}>Inicia sesión</h2>
      <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
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
              placeholder="Tu contraseña"
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>
        <button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <div style={{ margin: "16px 0", textAlign: "center" }}>o</div>
      <GoogleBtn />

      <p style={{ marginTop: 12 }}>
        ¿No tienes cuenta? <Link to="/auth/sign-up">Crear cuenta</Link>
      </p>
      <p style={{ marginTop: 12 }}>
        ¿Olvidaste tu contraseña?{" "}
        <Link to="/auth/forgot-password">Recuperar contraseña</Link>
      </p>
      <p>
        Recibiste un correo de verificación?{" "}
        <Link to="/auth/verify-email">Verificar correo</Link>
      </p>
    </div>
  );
}
