import { useEffect } from "react";

export default function GoogleOneTapButton() {
  useEffect(() => {
    /* global google */
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        console.log("Credential:", response.credential);
      },
    });

    // Renderiza el botón “Ingresar como [nombre]”
    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById("googleButton"), {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with", // usa “continue_with” para que muestre el nombre
      shape: "rectangular",
    });

    // Si querés mostrar automáticamente el “One Tap” (popup arriba)
    // @ts-ignore
    google.accounts.id.prompt();
  }, []);

  return <div id="googleButton"></div>;
}
