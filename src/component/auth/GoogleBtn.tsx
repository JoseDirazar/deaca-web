import { useAuthApi } from "@/hooks/useAuthApi.hook";
import { useEffect } from "react";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleBtn() {
  const { signInWithGoogle } = useAuthApi();
  const {
    mutateAsync: signInWithGoogleAsync,
    isPending: isSigningInWithGoogle,
    isError: isSigningInWithGoogleError,
    error: signInWithGoogleError,
  } = signInWithGoogle;
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
        signInWithGoogleAsync(credential);
      },
    });

    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById("googleBtn"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  return (
    <button
      className="my-6 rounded disabled:opacity-50"
      id="googleBtn"
      disabled={isSigningInWithGoogle}
    ></button>
  );
}
