import { IoSend } from "react-icons/io5";
import Input from "../ui/Input";
import { useState } from "react";

export default function ReachOutSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, email, message);
  };

  return (
    <div className="flex min-h-[600px] flex-col gap-4 p-4 md:flex-row">
      <div className="flex flex-col gap-4 text-wrap md:w-1/2">
        <p className="text-3xl text-primary">¡Escribinos!</p>
        <p className="text-2xl text-gray-500">
          Si tenés preguntas o necesitás más información, estamos aquí para
          responderte. También tus sugerencias son muy importantes para nosotros
        </p>
        <div className="flex h-full flex-col gap-4 rounded bg-primary text-center text-2xl text-white">
          <img
            src="/fondos/ola-plaza.jpeg"
            className="aspect-video w-full object-cover"
            alt="plaza"
          />
          <p className="p-4">El valor de lo cercano</p>
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
          id="name"
          className="bg-fifth"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          title="Email"
          type="email"
          id="email"
          className="bg-fifth"
          onChange={(e) => setEmail(e.target.value)}
        />
        {/*TODO: border primary */}
        <textarea
          className="rounded border border-primary p-3 placeholder:font-bold placeholder:text-primary focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Mensaje"
          rows={4}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="flex items-center justify-center gap-2 rounded bg-primary p-2 text-white"
          type="submit"
        >
          <IoSend size={16} />
          Enviar
        </button>
      </form>
    </div>
  );
}
