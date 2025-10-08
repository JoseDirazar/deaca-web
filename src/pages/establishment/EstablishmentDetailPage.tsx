import EstablishmentGallery from "@/component/establishment/EstablishmentGallery";
import GoogleMaps from "@/component/GoogleMaps";
import Button from "@/component/ui/Button";
import { useUserStore } from "@/context/useUserStore";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { generateImageUrl } from "@/lib/generate-image-url";
import type { Image } from "@/types/common/image.interface";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaWebAwesome } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";

import PageContainer from "@/component/ui/PageContainer";
import EstablishmentReviews from "@/component/review/EstablishmentReviews";

export default function EstablishmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { getEstablishment } = useEstablishmentApi();

  const {
    data: establishment,
    isPending,
    isError,
  } = getEstablishment(id as string);

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

  if (isPending) return <div>Cargando...</div>;
  if (isError) return <div>Ocurrio un error al cargar el establecimiento</div>;

  return (
    <PageContainer className="relative p-6">
      {establishment.user.id === user?.id && (
        <Button
          onClick={() =>
            navigate(`/usuario/emprendimientos/${establishment.id}`)
          }
          icon={<FaEdit />}
          label="Editar"
          className="absolute top-2 right-2 z-30"
        />
      )}
      <div className="relative flex flex-1 gap-6">
        <div className="grid h-112 max-w-2/3 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {establishment?.images?.slice(0, 5).map((image, index) => (
            <button
              onClick={() => setImageSelected(image)}
              key={image.id + image.fileName}
              className={`relative overflow-hidden rounded-lg ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={generateImageUrl("establishment", image.fileName)}
                alt={`Gallery image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        <img
          src={generateImageUrl("establishment", establishment.avatar)}
          alt={`${establishment.name} avatar`}
          className="absolute -bottom-5 left-5 h-36 w-36 rounded-full bg-white object-cover p-2"
        />
        {establishment?.latitude && establishment?.longitude && (
          <GoogleMaps
            markers={[
              {
                lat: Number(establishment.latitude),
                lng: Number(establishment.longitude),
              },
            ]}
          />
        )}
      </div>
      <div className="mt-6 flex w-full max-w-2/3 items-center justify-between">
        <p className="font-century-gothic-bold text-5xl">
          {establishment.name}
        </p>
        <div className="flex items-center gap-4">
          <FaInstagram
            className="text-4xl"
            onClick={() => window.open(establishment.instagram, "_blank")}
          />
          <FaFacebook
            className="text-4xl"
            onClick={() => window.open(establishment.facebook, "_blank")}
          />
          <FaWebAwesome
            className="text-4xl"
            onClick={() => window.open(establishment.website, "_blank")}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-1">
        <p className="max-w-2/3 text-justify font-century-gothic text-lg text-wrap">
          {establishment.description}
        </p>
        <div className="flex-grow font-century-gothic">
          <EstablishmentReviews establishment={establishment} user={user} />
        </div>
      </div>
      <EstablishmentGallery
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
        handleSelectedImage={handleSelectedImage}
        images={establishment.images || []}
      />
    </PageContainer>
  );
}
