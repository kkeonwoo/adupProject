import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function MainSwiper() {
  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={50}
      loop={true}
      autoplay={{ delay: 2500, disableOnInteraction: false, }}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      <SwiperSlide>
        <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
      </SwiperSlide>
    </Swiper>
  );
}

