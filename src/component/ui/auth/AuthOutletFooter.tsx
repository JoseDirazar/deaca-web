import DLink from "../DLink";

export default function AuthOutletFooter({
  signInLink = false,
  signUpLink = false,
  resetPasswordLink = false,
  sendRecoverLink = false,
}: {
  signInLink?: boolean;
  signUpLink?: boolean;
  resetPasswordLink?: boolean;
  sendRecoverLink?: boolean;
}) {
  return (
    <div className="mb-2 flex flex-col text-sm">
      {signInLink && (
        <p className="flex items-center justify-between font-bold text-fourth">
          ¿Ya tienes cuenta? <DLink to="/auth/sign-in" label="Inicia sesión" />
        </p>
      )}
      {signUpLink && (
        <p className="flex items-center justify-between font-bold text-fourth">
          ¿No tienes cuenta? <DLink to="/auth/sign-up" label="Registrate" />
        </p>
      )}
      {sendRecoverLink && (
        <p className="flex items-center justify-between font-bold text-fourth">
          ¿Olvidaste tu contraseña?{" "}
          <DLink to="/auth/forgot-password" label="Verifica tu correo" />
        </p>
      )}
      {resetPasswordLink && (
        <p className="flex items-center justify-between font-bold text-fourth">
          ¿Tenes un codigo de verificación?{" "}
          <DLink to="/auth/reset-password" label="Restablece contraseña" />
        </p>
      )}
    </div>
  );
}
