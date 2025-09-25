import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUserStore } from "../context/useUserStore";
import SignOutButton from "../component/auth/SignOutButton";

export default function LandingPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { user } = useUserStore();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);
  console.log(user);
  return (
    <div>
      <h1>Landin</h1>
      <p>{accessToken}</p>
      <p>{user?.email}</p>
      {user ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/protected">Ir a protegida</Link>
          <SignOutButton />
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/auth/sign-in">Sign In</Link>
          <Link to="/auth/sign-up">Sign Up</Link>
        </div>
      )}
    </div>
  );
}
