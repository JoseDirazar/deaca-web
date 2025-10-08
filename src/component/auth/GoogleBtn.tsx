import { useAuthApi } from "@/hooks/useAuthApi.hook";
import { googleClientId } from "@/lib/constants/enviroment-variables";
import { useEffect } from "react";

export default function GoogleBtn() {
  const { signInWithGoogle } = useAuthApi();
  const {
    mutateAsync: signInWithGoogleAsync,
    isPending: isSigningInWithGoogle,
    isError: isSigningInWithGoogleError,
    error: signInWithGoogleError,
  } = signInWithGoogle;

  useEffect(() => {
    let accessToken = "";
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
      theme: "filled_green",
      size: "expanded",
    });
  }, []);

  return (
    <button
      className="my-6 mt-3 w-full rounded disabled:opacity-50"
      id="googleBtn"
      disabled={isSigningInWithGoogle}
    ></button>
  );
}
