import PageContainer from "@/component/ui/PageContainer";
import { publicBackground } from "@/lib/constants/public-backgrounds";

const aboutUsData = [
  {
    title: "deacá",
    description:
      "Lo integramos un grupo independiente de olavarrienses, unidos por el deseo de brindar una guía de productos y servicios amplia y personalizada para quienes habitamos el partido de Olavarría y para sus visitantes",
    img: publicBackground[0],
  },
  {
    title: "Cercano",
    description:
      "En este mundo globalizado, donde con un click tenemos en nuestras manos un producto de un lugar remoto, apostamos a regionalizar la oferta, buscando fortalecer lo local.",
    img: publicBackground[1],
  },
  {
    title: "Tendencia",
    description:
      "En nuestro sitio, encontrarás centralizado lo que necesitas relacionado con un modo de vida respetuoso, derivado de un hacer sustentable y promoviendo una vida sana.",
    img: publicBackground[2],
  },
  {
    title: "Experiencias",
    description:
      "Te invitamos a sorprendernos juntos ante la diversidad y cantidad de productos y servicios de los emprendedores, los profesionales, de quienes ejercen oficios, artesanos y artistas olavarrienses. Descubrí con nosotros el Valor de lo Cercano",
    img: publicBackground[3],
  },
  {
    title: "Valores",
    description:
      "Estamos comprometidos con todas las personas. Sin edad, sin tiempo, sin adjetivos. La empatía y la solidaridad son la esencia en la guía deacá.",
    img: publicBackground[4],
  },
  {
    title: "De corazón a corazón",
    description:
      "Creemos que estar cerca permite crear vínculos que mejoran la convivencia y fortalecen a las comunidades.",
    img: publicBackground[5],
  },
];

export default function AboutUsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col">
        <div className="relative z-10">
          <div className="absolute inset-0 z-0 bg-black/10 backdrop-blur-[2px]"></div>
          <img
            src={publicBackground[0]}
            alt="sobre nosotros deacá"
            className="h-110 w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
            <p className="font-nueva text-7xl font-bold tracking-wide text-white">
              deacá
            </p>
            <p className="text-2xl font-bold tracking-wide text-white">
              sobre nosotros
            </p>
          </div>
        </div>
        {aboutUsData.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-center py-16 md:py-24 ${index % 2 !== 0 ? "bg-white" : "bg-primary"}`}
          >
            <div
              className={`flex flex-col gap-4 p-2 px-4 ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} items-center md:gap-12`}
            >
              <div
                className={`flex flex-col gap-8 text-wrap ${index % 2 !== 0 ? "text-gray-500" : "text-gray-100"} items-center justify-center text-center`}
              >
                <h2 className="text-4xl font-bold tracking-wide">
                  {item.title}
                </h2>
                <p className="text-xl">{item.description}</p>
              </div>
              <img
                src={item.img}
                alt={item.title}
                className="rounded-xl object-cover md:max-w-1/2"
              />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
