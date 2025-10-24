// Import Swiper React components
import { Swiper as SwiperComponent } from "swiper/react";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import { useCallback, useEffect, useState } from "react";

export default function Swiper({ children }: { children: React.ReactNode }) {
  const [slidesPerView, setSlidesPerView] = useState<number>(3);
  const handleSlidesPerViewByScreenResolution = useCallback(() => {
    if (window.innerWidth < 768) {
      setSlidesPerView(2);
    } else if (window.innerWidth < 1024) {
      setSlidesPerView(3);
    } else {
      setSlidesPerView(4);
    }
  }, [setSlidesPerView]);
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
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper relative"
      >
        {children}
      </SwiperComponent>
    </>
  );
}
