export default function Navbar() {
  return (
    <nav className="bg-fifth text-white shadow-lg">
      <h1 className="hidden">Farmacias de turno hoy Olavarría</h1>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center text-2xl">
            <img
              src="/deaca-fondo-gris.png"
              alt="logo"
              width={170}
              height={170}
              className=""
            />{" "}
          </div>
          <p className="hidden items-center pt-1 text-center font-century-gothic-bold text-base text-primary transform-content xs:flex sm:text-2xl md:justify-center">
            De Turno
          </p>
          <a
            href="#"
            className="flex animate-pulse flex-col items-center justify-center rounded-lg bg-primary p-2 font-extrabold text-fifth shadow-md transition-all hover:bg-third hover:ring-2 hover:ring-fourth"
          >
            Guia de Olavarría
          </a>
        </div>
      </div>
    </nav>
  );
}
