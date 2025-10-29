import EstablishmentGallery from "@/component/establishment/EstablishmentGallery";
import GoogleMaps from "@/component/GoogleMaps";
import Button from "@/component/ui/Button";
import { useUserStore } from "@/context/useUserStore";
import { generateImageUrl } from "@/lib/generate-image-url";
import type { Image } from "@/types/common/image.interface";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaWebAwesome } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";

import PageContainer from "@/component/ui/PageContainer";
import EstablishmentReviews from "@/component/review/EstablishmentReviews";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";

export default function EstablishmentDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const { data: establishment } =
    useEstablishmentApi().useGetEstablishmentBySlug(slug as string);

  const [imageSelected, setImageSelected] = useState<Image | null>(null);

  const handleSelectedImage = (imageId: string, motion: "r" | "l") => {
    if (!establishment?.images) return;

    const currentIndex = establishment.images.findIndex(
      (image) => image.id === imageId,
    );
    if (currentIndex === -1) return;

    let newIndex;
    if (motion === "l") {
      newIndex =
        currentIndex === 0 ? establishment.images.length - 1 : currentIndex - 1;
    } else {
      newIndex =
        currentIndex === establishment.images.length - 1 ? 0 : currentIndex + 1;
    }

    setImageSelected(establishment.images[newIndex]);
  };

  if (!establishment)
    return (
      <PageContainer className="text-4xl text-gray-400">
        No se encontro la informacion
      </PageContainer>
    );

  return (
    <PageContainer className="relative p-6">
      {user && establishment?.user?.id === user?.id && (
        <Button
          onClick={() =>
            navigate(`/usuario/emprendimientos/${establishment.id}`)
          }
          icon={<FaEdit />}
          label="Editar"
          className="absolute top-2 right-2 z-30 text-xs"
        />
      )}
      <div className="flex flex-col gap-8 md:flex-1 md:flex-row">
        <div className="flex flex-col gap-8 md:max-w-2/3">
          <div className="relative grid h-112 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {establishment?.images?.slice(0, 6).map((image, index) => (
              <button
                onClick={() => setImageSelected(image)}
                key={image.id + image.fileName}
                className={`relative overflow-hidden rounded-lg ${
                  index === 0
                    ? "col-span-2 row-span-2 md:col-span-3 md:row-span-2"
                    : index === 1
                      ? "col-span-1 row-span-2 md:col-span-1 md:row-span-2"
                      : index === 4
                        ? "hidden md:col-span-1 md:row-span-1 md:block"
                        : index === 5
                          ? "hidden md:col-span-1 md:row-span-1 md:block"
                          : ""
                }`}
              >
                <img
                  src={generateImageUrl("establishment", image.fileName)}
                  alt={`Imagen ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
            <img
              src={generateImageUrl(
                "establishment-logo",
                establishment?.avatar,
              )}
              alt={`${establishment?.name} avatar`}
              className="absolute -bottom-7 left-5 h-36 w-36 rounded-full bg-white object-cover p-2"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <p className="font-century-gothic text-3xl font-bold tracking-wide md:text-5xl">
              {establishment?.name}
            </p>
            <div className="flex items-center gap-4 text-2xl md:text-4xl">
              <FaInstagram
                onClick={() => window.open(establishment?.instagram, "_blank")}
              />
              <FaFacebook
                onClick={() => window.open(establishment?.facebook, "_blank")}
              />
              <FaWebAwesome
                onClick={() => window.open(establishment?.website, "_blank")}
              />
            </div>
          </div>
        </div>
        {establishment?.latitude && establishment?.longitude && (
          <GoogleMaps
            className="h-44 md:h-auto md:flex-grow"
            markers={[
              {
                lat: Number(establishment.latitude),
                lng: Number(establishment.longitude),
              },
            ]}
          />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-8 md:flex-1 md:flex-row">
        <p className="text-justify font-century-gothic text-lg text-wrap md:max-w-2/3">
          {establishment?.description}
        </p>
        <div className="font-century-gothic md:flex-grow">
          <EstablishmentReviews establishment={establishment} user={user} />
        </div>
      </div>
      <EstablishmentGallery
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
        handleSelectedImage={handleSelectedImage}
        images={establishment?.images || []}
      />
    </PageContainer>
  );
}
