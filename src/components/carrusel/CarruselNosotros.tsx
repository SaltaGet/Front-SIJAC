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
    <section className="w-full py-6 sm:py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Carousel */}
        <div className="relative">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            speed={600}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 150,
              modifier: 1.2,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 30,
                coverflowEffect: {
                  rotate: 40,
                  stretch: 0,
                  depth: 180,
                  modifier: 1.1,
                  slideShadows: true,
                },
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
                coverflowEffect: {
                  rotate: 45,
                  stretch: 0,
                  depth: 200,
                  modifier: 1,
                  slideShadows: true,
                },
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
                coverflowEffect: {
                  rotate: 50,
                  stretch: 0,
                  depth: 250,
                  modifier: 1,
                  slideShadows: true,
                },
              },
            }}
            className="w-full pb-12 sm:pb-16"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-white p-2 shadow-xl transition-all duration-500 group-hover:shadow-2xl">
                  {/* Contenedor de imagen con aspect ratio fijo */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                    <img
                      src={src}
                      alt={`Imagen ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay gradient sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    
                    {/* Número de slide opcional */}
                    <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-sm">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Border decorativo */}
                  <div className="absolute inset-2 rounded-xl border-2 border-emerald-200/50 transition-colors duration-300 group-hover:border-emerald-400/70"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* Indicador de navegación adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Desliza para ver más imágenes • {images.length} fotos
          </p>
        </div>
      </div>
      
      {/* CSS personalizado para la paginación */}
      <style>
        {`
          .swiper-pagination-bullet {
            width: 12px !important;
            height: 12px !important;
            background: #e2e8f0 !important;
            opacity: 0.7 !important;
            transition: all 0.3s ease !important;
          }
          
          .swiper-pagination-bullet-active {
            background: #059669 !important;
            opacity: 1 !important;
            transform: scale(1.2) !important;
          }
          
          .swiper-slide-shadow-left,
          .swiper-slide-shadow-right {
            background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.2),
              transparent
            ) !important;
          }
          
          @media (max-width: 640px) {
            .swiper-pagination-bullet {
              width: 10px !important;
              height: 10px !important;
            }
          }
        `}
      </style>
    </section>
  );
}