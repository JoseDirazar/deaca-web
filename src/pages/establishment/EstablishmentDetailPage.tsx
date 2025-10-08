import EstablishmentGallery from "@/component/establishment/EstablishmentGallery";
import GoogleMaps from "@/component/GoogleMaps";
import Button from "@/component/ui/Button";
import { useUserStore } from "@/context/useUserStore";
import { useEstablishmentApi } from "@/hooks/useEstablishmentApi";
import { useReviewsApi } from "@/hooks/useReviewsApi.hook";
import { generateImageUrl } from "@/lib/generate-image-url";
import type { Image } from "@/types/common/image.interface";
import type { Review } from "@/types/reviews/review.interface";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaWebAwesome } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import ReviewForm from "@/component/establishment/ReviewForm";
import StarRating from "@/component/ui/StarRating";
import UserAvatar from "@/component/ui/user/UserAvatar";
import type { User } from "@/types/user/user.interface";
import type { Establishment } from "@/types/establishment/etablihment.interface";

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
    <div className="relative p-6">
      {establishment.user.id === user?.id && (
        <Button
          onClick={() => navigate(`/user/establishment/${establishment.id}`)}
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
            onClick={() =>
              window.open(
                "https://instagram.com/" + establishment.instagram,
                "_blank",
              )
            }
          />
          <FaFacebook
            className="text-4xl"
            onClick={() =>
              window.open(
                "https://facebook.com/" + establishment.facebook,
                "_blank",
              )
            }
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
          <Reviews establishment={establishment} user={user} />
        </div>
      </div>
      <EstablishmentGallery
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
        handleSelectedImage={handleSelectedImage}
        images={establishment.images || []}
      />
    </div>
  );
}

function Reviews({
  establishment,
  user,
}: {
  establishment: Establishment;
  user?: User | null;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const {
    useGetEstablishmentReviews,
    createReview,
    updateReview,
    deleteReview,
  } = useReviewsApi();
  const { data: reviews } = useGetEstablishmentReviews(establishment.id);

  const handleDelete = async (review: Review) => {
    try {
      await deleteReview.mutateAsync({ reviewId: review.id });
    } catch (e) {
      console.error(e);
    }
  };

  const onEdit = (review: Review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const onSubmit = async (rating: number, comment: string) => {
    try {
      if (editingReview) {
        await updateReview.mutateAsync({
          review: { ...editingReview, rating, comment } as Review,
        });
      } else {
        await createReview.mutateAsync({
          establishmentId: establishment.id,
          review: { rating, comment },
        });
      }
      setIsFormOpen(false);
      setEditingReview(null);
    } catch {
      // Swallow error; UI libs likely handle toasts globally
    }
  };

  if (!reviews) {
    return (
      <div className="text-center text-2xl text-gray-400">
        <p>No hay reseñas</p> <p>Sea el primero en calificar</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarRating
            rating={Math.round(establishment.rating || 0)}
            readonly
            size={22}
          />
          <span className="text-lg">
            {Number(establishment.rating || 0).toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">
            ({reviews?.length || 0} reseñas)
          </span>
        </div>
        {user && (
          <Button
            onClick={() => {
              const myReview =
                (reviews || []).find((r) => r.reviewer.id === user.id) || null;
              setEditingReview(myReview);
              setIsFormOpen(true);
            }}
            label={
              (reviews || []).some((r) => r.reviewer.id === user.id)
                ? "Editar mi reseña"
                : "Escribir reseña"
            }
          />
        )}
      </div>
      {isFormOpen && user && (
        <div className="mb-6 rounded-lg border border-primary/30 p-4">
          <ReviewForm
            initialReview={editingReview || undefined}
            isLoading={createReview.isPending || updateReview.isPending}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingReview(null);
            }}
            onSubmit={onSubmit}
          />
        </div>
      )}

      <div className="flex-grow">
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-4 rounded-lg border border-primary/20 p-4"
            >
              <UserAvatar avatar={review.reviewer.avatar} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-century-gothic-bold text-lg">
                      {review.reviewer.firstName} {review.reviewer.lastName}
                    </p>
                    <StarRating rating={review.rating} readonly size={18} />
                  </div>
                  <p>
                    {user?.id} {review.reviewer.id}
                  </p>
                  {user?.id === review.reviewer.id && (
                    <div className="flex gap-2">
                      <Button
                        label="Editar"
                        onClick={() => onEdit(review)}
                        className="bg-secondary hover:bg-secondary/90"
                      />
                      <Button
                        label="Eliminar"
                        onClick={() => handleDelete(review)}
                        className="bg-red-500 hover:bg-red-600"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-fourth">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
