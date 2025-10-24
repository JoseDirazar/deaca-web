// Import Swiper React components
import { Swiper as SwiperComponent } from "swiper/react";

// import required modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { useCallback, useEffect, useState } from "react";

export default function Swiper({ children }: { children: React.ReactNode }) {
  const [slidesPerView, setSlidesPerView] = useState<number>(3);
  const [spaceBetween, setSpaceBetween] = useState<number>(30);

  const handleSlidesPerViewByScreenResolution = useCallback(() => {
    if (window.innerWidth < 768) {
      setSlidesPerView(2);
      setSpaceBetween(20);
    } else if (window.innerWidth < 1024) {
      setSlidesPerView(3);
      setSpaceBetween(30);
    } else {
      setSlidesPerView(4);
      setSpaceBetween(40);
    }
  }, [setSlidesPerView, setSpaceBetween]);

  useEffect(() => {
    handleSlidesPerViewByScreenResolution();
    window.addEventListener("resize", handleSlidesPerViewByScreenResolution);
    return () => {
      window.removeEventListener(
        "resize",
        handleSlidesPerViewByScreenResolution,
      );
    };
  }, [handleSlidesPerViewByScreenResolution]);

  return (
    <>
      <SwiperComponent
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        pagination={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper relative"
      >
        {children}
      </SwiperComponent>
    </>
  );
}
