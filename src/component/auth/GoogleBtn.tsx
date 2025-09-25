import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.hook";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleBtn() {
  const { signInWithGoogle } = useAuth();
  let accessToken = "";
  useEffect(() => {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response: any) => {
        // el JWT de Google
        const credential = response.credential;
        // mandarlo al backend vía tu hook
        accessToken = response;
        signInWithGoogle.mutateAsync(credential);
      },
    });

    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById("googleBtn"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  return <div id="googleBtn"></div>;
}
