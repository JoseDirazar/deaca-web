import DLink from "../ui/DLink";

export default function RegisterSection() {
  return (
    <div className="flex h-[600px] flex-col bg-primary text-center text-white md:flex-row md:items-center">
      <img
        src="/fondos/ola-afueras-aereo.jpg"
        alt=""
        className="h-1/2 object-cover md:h-full md:w-1/2"
      />
      <div className="flex flex-1 flex-col items-center justify-around px-8 md:h-1/2">
        <h2 className="text-center text-xl text-wrap md:text-2xl">
          En{" "}
          <span className="font-nueva text-2xl font-bold md:text-3xl">
            deacá
          </span>{" "}
          podés llegar a mas gente con tu emprendimiento, ingresa en un solo
          paso y registra tu emprendimiento facilmente.
        </h2>
        <p className="text-center text-lg md:text-xl">
          Ingresa en un solo paso!
        </p>
        <DLink
          label="Conoce Más" // TODO: al redireccionar subir el scroll
          className="bg-white text-primary"
          to="/auth/registrarse"
        />
      </div>
    </div>
  );
}
