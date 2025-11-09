import { useState } from "react";
import { toast } from "sonner";
import { IoSend } from "react-icons/io5";
import Input from "../ui/Input";
import api from "@/api/axios-instance";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ReachOutSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);

    // Validación simple
    if (!formData.name || !formData.email || !formData.message) {
      return toast.warning("Todos los campos son obligatorios");
    }

    try {
      setIsSubmitting(true);
      // Aquí iría tu llamada a la API
      await api.post("/contact", formData);
      console.log("Datos a enviar:", formData);
      toast.success("Mensaje enviado con éxito");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error al enviar el mensaje");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[600px] flex-col gap-4 p-4 md:flex-row">
      <div className="flex flex-col gap-4 text-wrap md:w-1/2">
        <p className="text-3xl text-primary">¡Escribinos!</p>
        <p className="text-2xl text-gray-500">
          Si tenés preguntas o necesitás más información, estamos aquí para
          responderte. También tus sugerencias son muy importantes para nosotros
        </p>
        <div className="flex h-full flex-col items-center justify-center gap-4 rounded bg-primary text-center text-2xl text-white">
          <img
            src="/fondos/ola-plaza.jpeg"
            className="aspect-video w-full object-cover"
            alt="plaza"
          />
          <p className="pb-6 font-bold">El valor de lo cercano</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-start gap-4 rounded bg-fifth p-4 md:w-1/2 md:flex-1"
      >
        <p className="w-full text-3xl text-primary">Contacto</p>
        <Input
          title="Nombre"
          type="text"
          id="landing-name"
          name="name"
          className="bg-fifth"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          title="Email"
          type="email"
          id="landing-email"
          name="email"
          className="bg-fifth"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          className="rounded border border-primary p-3 placeholder:font-bold placeholder:text-primary focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Mensaje"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded bg-primary p-2 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          <IoSend size={16} />
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
