import DLink from "../ui/DLink";

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
    <div className="mt-10 mb-2 flex flex-col text-sm">
      {signInLink && (
        <p className="flex items-center justify-between font-thin">
          ¿Ya tienes cuenta?{" "}
          <DLink to="/auth/ingresar" label="Iniciar sesión" />
        </p>
      )}
      {signUpLink && (
        <p className="flex items-center justify-between font-thin">
          ¿No tienes cuenta?{" "}
          <DLink to="/auth/registrarse" label="Registrarse" />
        </p>
      )}
      {sendRecoverLink && (
        <p className="flex items-center justify-between font-thin">
          ¿Olvidaste tu contraseña?{" "}
          <DLink
            to="/auth/recuperar-contraseña"
            label="Restablecer contraseña"
          />
        </p>
      )}
      {resetPasswordLink && (
        <p className="flex items-center justify-between font-thin">
          ¿Tenes un codigo de verificación?{" "}
          <DLink to="/auth/verificar-codigo" label="Verificar codigo" />
        </p>
      )}
    </div>
  );
}
