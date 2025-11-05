import NightLifeListItem from "@/component/establishment/NightLifeListItem";
import EventListItem from "@/component/event/EventListItem";
import NatureSpotListItem from "@/component/nature-spot/NatureSpotListItem";
import PageContainer from "@/component/ui/PageContainer";
import SectionContainer from "@/component/ui/section/SectionContainer";
import SectionHeader from "@/component/ui/section/SectionHeader";
import Swiper from "@/context/swiper";
import { useCategoryApi } from "@/hooks/useCategoryApi.hook";
import { useEventApi } from "@/hooks/useEventApi.hook";
import { useNatureSpotApi } from "@/hooks/useNatureSpotApi.hook";
import { SwiperSlide } from "swiper/react";

export default function WhatToDoPage() {
  const { data, isPending, isError, error } = useCategoryApi().useGetCategories(
    {
      select: ["Vida Nocturna"],
    },
  );

  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEventApi().useGetEvents();

  const {
    data: natureSpots,
    isLoading: natureSpotsLoading,
    error: natureSpotsError,
  } = useNatureSpotApi().useGetNatureSpots();

  const nightLifeList = data?.data?.[0].establishments;
  return (
    <PageContainer>
      <SectionContainer className="flex flex-col items-center gap-4">
        <SectionHeader
          title="Proximos Eventos"
          separator
          separatorClassName="w-44"
          className="text-5xl"
        />
        <div className="container">
          {events?.data?.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))}
        </div>
      </SectionContainer>
      <SectionContainer className="rounded-none bg-primary">
        <SectionHeader
          title="Vida Nocturna"
          className="text-4xl text-white"
          separatorClassName="bg-white w-44"
          separator
        />
        <div className="p-4">
          {nightLifeList?.length ? (
            <Swiper>
              {nightLifeList?.map((establishment) => (
                <SwiperSlide key={establishment.id}>
                  <NightLifeListItem establishment={establishment} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center font-century-gothic text-4xl font-bold text-gray-200">
              No hay eventos
            </p>
          )}
        </div>
      </SectionContainer>
      <SectionContainer>
        <SectionHeader
          title="Paseos Naturales"
          separator
          separatorClassName="w-44"
          className="text-4xl"
        />
        <div className="p-4">
          <Swiper>
            {natureSpots?.data?.map((natureSpot) => (
              <SwiperSlide>
                <NatureSpotListItem
                  key={natureSpot.id}
                  natureSpot={natureSpot}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
