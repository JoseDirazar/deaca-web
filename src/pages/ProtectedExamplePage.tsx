import { useUserStore } from "../context/useUserStore";
import SignOutButton from "../component/auth/SignOutButton";

export default function ProtectedExamplePage() {
  const { user } = useUserStore();
  return (
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <h2>Área protegida</h2>
      <p>Solo usuarios autenticados pueden ver esta página.</p>
      <div style={{ margin: "12px 0" }}>
        <SignOutButton />
      </div>
      <pre style={{ background: "#f5f5f5", padding: 12 }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
