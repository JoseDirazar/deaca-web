import { useAuthApi } from "@/hooks/useAuthApi.hook";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export default function GoogleBtn() {
  const { signInWithGoogle } = useAuthApi();
  const {
    mutateAsync: signInWithGoogleAsync,
    isPending: isSigningInWithGoogle,
    isError,
  } = signInWithGoogle;

  const handleSuccess = async (credentialResponse: any) => {
    // credentialResponse.credential contiene el JWT de Google
    const token = credentialResponse.credential;
    signInWithGoogleAsync(token);
  };

  return (
    <div
      className="my-4 rounded-md shadow-md aria-disabled:opacity-50"
      aria-disabled={isSigningInWithGoogle}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() =>
          isError && toast.error("Error al iniciar sesión con Google")
        }
      />
    </div>
  );
}
