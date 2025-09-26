import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-primary py-6 pt-10 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 flex flex-col items-center justify-center gap-4 text-center md:mb-0">
            <img
              src="/logos/logo-horizontal-blanco.png"
              alt="logo"
              width={240}
              height={240}
              className="object-cover"
            />{" "}
            <div className="mt-8 mb-4 ml-8 flex w-full items-center justify-start gap-4 lg:mb-10">
              <a
                target="_blank"
                href=""
                className="flex flex-col items-center justify-center text-center"
              >
                <FaFacebook size={24} />
              </a>
              <a
                target="_blank"
                href=""
                className="flex flex-col items-center justify-center text-center"
              >
                <FaInstagram size={24} />
              </a>
              <a
                target="_blank"
                href=""
                className="flex flex-col items-center justify-center text-center"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
          <div className="mb-8 flex flex-col gap-8 md:mb-0 md:flex-row">
            <div className="flex flex-col items-start justify-start gap-3">
              <a className="flex items-center justify-self-center-safe" href="">
                {" "}
                <MdOutlineArrowForwardIos className="opacity-50" />
                <p className="font-bold">Farmacias hoy</p>
              </a>
              <a className="flex items-center justify-self-center-safe" href="">
                {" "}
                <MdOutlineArrowForwardIos className="opacity-50" />
                <p className="font-bold">Organizaciones</p>
              </a>
              <a className="flex items-center justify-self-center-safe" href="">
                {" "}
                <MdOutlineArrowForwardIos className="opacity-50" />
                <p className="font-bold">deacá solidaria</p>
              </a>
              <a className="flex items-center justify-self-center-safe" href="">
                {" "}
                <MdOutlineArrowForwardIos className="opacity-50" />
                <p className="font-bold">Novedades</p>
              </a>
            </div>
            <div className="flex flex-col items-start justify-start gap-3">
              <p className="font-serif text-xl font-extrabold">Legal</p>
              <a
                className="flex items-center justify-self-center-safe font-bold"
                href=""
              >
                <MdOutlineArrowForwardIos className="opacity-50" />
                <p className="">Términos y condiciones</p>
              </a>
              <a
                className="flex items-center justify-self-center-safe font-bold"
                href=""
              >
                <MdOutlineArrowForwardIos className="opacity-50" />
                <p>Política de privacidad</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full">
        <p className="text-center font-extrabold opacity-50">
          © {new Date().getFullYear()}. Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
