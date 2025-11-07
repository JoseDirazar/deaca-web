import NightLifeListItem from "@/component/establishment/NightLifeListItem";
import EventListItem from "@/component/event/EventListItem";
import NatureSpotListItem from "@/component/nature-spot/NatureSpotListItem";
import CardsLoader from "@/component/ui/CardsLoader";
import CarouselSkeleton from "@/component/ui/CarouselSkeleton";
import Loader from "@/component/ui/Loader";
import PageContainer from "@/component/ui/PageContainer";
import SectionContainer from "@/component/ui/section/SectionContainer";
import SectionHeader from "@/component/ui/section/SectionHeader";
import Swiper from "@/context/swiper";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { useEventApi } from "@/hooks/useEventApi.hook";
import { useNatureSpotApi } from "@/hooks/useNatureSpotApi.hook";
import { Suspense } from "react";
import { SwiperSlide } from "swiper/react";

export default function WhatToDoPage() {
  return (
    <PageContainer>
      <Suspense fallback={<Loader />}>
        <EventsContainer />
        <NightLifeSection />
        <NatureSpotsContainer />
      </Suspense>
    </PageContainer>
  );
}

function NatureSpotsContainer() {
  const { data: natureSpots, isPending } =
    useNatureSpotApi().useGetNatureSpots();
  return (
    <SectionContainer>
      <SectionHeader
        title="Paseos Naturales"
        separator
        separatorClassName="w-44"
        className="text-4xl"
      />
      <div className="p-4">
        <Swiper>
          {isPending ? (
            <CarouselSkeleton bgColor="bg-gray-300" />
          ) : (
            natureSpots?.data?.map((natureSpot) => (
              <SwiperSlide>
                <NatureSpotListItem
                  key={natureSpot.id}
                  natureSpot={natureSpot}
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </SectionContainer>
  );
}

function EventsContainer() {
  const { data: events, isPending } = useEventApi().useGetEvents();
  return (
    <SectionContainer className="flex flex-col items-center gap-4">
      <SectionHeader
        title="Proximos Eventos"
        separator
        separatorClassName="w-44"
        className="text-5xl"
      />
      <div className="container">
        {isPending ? (
          <CardsLoader />
        ) : (
          events?.data?.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))
        )}
      </div>
    </SectionContainer>
  );
}

function NightLifeSection() {
  const { data, isPending } = useCategoryApi().useGetCategories({
    select: ["Vida Nocturna"],
  });
  return (
    <Suspense fallback={<div className="loader invert"></div>}>
      <SectionContainer className="rounded-none bg-primary">
        <SectionHeader
          title="Vida Nocturna"
          className="text-4xl text-white"
          separatorClassName="bg-white w-44"
          separator
        />
        <div className="p-4">
          {isPending ? (
            <CarouselSkeleton />
          ) : data?.data?.[0].establishments?.length ? (
            <Swiper>
              {data?.data?.[0].establishments?.map((establishment) => (
                <SwiperSlide key={establishment.id}>
                  <NightLifeListItem establishment={establishment} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="my-10 text-center font-century-gothic text-4xl font-bold text-gray-200">
              No se encontraron resultados
            </p>
          )}
        </div>
      </SectionContainer>
    </Suspense>
  );
}
