import { useAuthApi } from "@/hooks/useAuthApi.hook";
import { googleClientId } from "@/lib/constants/enviroment-variables";
import { useEffect } from "react";

export default function GoogleBtn() {
  const { signInWithGoogle } = useAuthApi();
  const {
    mutateAsync: signInWithGoogleAsync,
    isPending: isSigningInWithGoogle,
  } = signInWithGoogle;

  useEffect(() => {
    // @ts-expect-error google.accounts.id.initialize
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response: { credential: string }) => {
        // el JWT de Google
        const credential = response.credential;
        // TODO?: mandarlo al backend vía tu hook

        signInWithGoogleAsync(credential);
      },
    });

    // @ts-expect-error google.accounts.id.renderButton
    google.accounts.id.renderButton(document.getElementById("googleBtn"), {
      theme: "filled_green",
      size: "expanded",
    });
  }, [signInWithGoogleAsync]);

  return (
    <button
      className="my-6 mt-3 w-full rounded disabled:opacity-50"
      id="googleBtn"
      disabled={isSigningInWithGoogle}
    ></button>
  );
}
