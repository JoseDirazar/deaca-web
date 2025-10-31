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
    <div className="my-4 rounded-md bg-indigo-400 shadow-md">
      <GoogleLogin
        onSuccess={handleSuccess}
        state_cookie_domain="localhost"
        onError={() =>
          isError && toast.error("Error al iniciar sesión con Google")
        }
      />
    </div>
  );
}
