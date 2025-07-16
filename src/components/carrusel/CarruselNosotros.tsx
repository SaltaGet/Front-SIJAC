import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import img1 from "@/assets/fotos/1.jpg";
import img2 from "@/assets/fotos/2.jpg";
import img3 from "@/assets/fotos/3.jpg";
import img4 from "@/assets/fotos/4.jpg";
import img5 from "@/assets/fotos/5.jpg";

const images = [img1, img2, img3, img4, img5];

export default function ImageCarousel() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <Swiper
        modules={[EffectCoverflow, Autoplay, Pagination]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        spaceBetween={30}
        loop={true}
        speed={500}  // transición más rápida
        autoplay={{
          delay: 2000,           // pasa al siguiente slide cada 2 segundos
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="rounded-lg overflow-hidden shadow-lg"
            style={{ width: 900, height: 300 }}  // tamaño fijo igual para todas
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover border-5 border-emerald-900 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
