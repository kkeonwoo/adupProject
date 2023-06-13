import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import banner01 from 'assets/images/@/@banner01.jpg'
import banner02 from 'assets/images/@/@banner02.jpg'
import banner03 from 'assets/images/@/@banner03.jpg'
import banner04 from 'assets/images/@/@banner04.jpg'

// import Swiper styles
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export default function SwiperBanner() {
    return (
        <BannerSwiperWrap>
            <BannerSwiperBtn className='swiper-prev' />
            <BannerSwiper
                slidesPerView={"auto"}
                loop={true}
                loopedSlides={2}
                autoplay={{
                    delay:2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={{
                    nextEl: ".swiper-next",
                    prevEl: ".swiper-prev",
                }}
                modules={[Autoplay,Pagination, Navigation]}
            >
                <BannerSwiperSlide>
                    <Link>
                        <BannerSwiperImg src={banner01} alt="오뚜기 X 사자고 톡톡 김치알밥 신상품 특가 22.10.4 ~ 10.25" />
                    </Link>
                </BannerSwiperSlide>
                <BannerSwiperSlide>
                    <Link>
                        <BannerSwiperImg src={banner02} alt="애경 더마앤모어 두피 딥클렌징 샴푸 특가 이벤트 22.10.4 ~ 10.25" />
                    </Link>
                </BannerSwiperSlide>
                <BannerSwiperSlide>
                    <Link>
                        <BannerSwiperImg src={banner03} alt="" />
                    </Link>
                </BannerSwiperSlide>
                <BannerSwiperSlide>
                    <Link>
                        <BannerSwiperImg src={banner04} alt="" />
                    </Link>
                </BannerSwiperSlide>
            </BannerSwiper>
            <BannerSwiperBtn className='swiper-next' />
        </BannerSwiperWrap>
    );
}

const BannerSwiperWrap = styled.div`
    position: relative;
    margin-left: 225px;
`

const BannerSwiper = styled(Swiper)`
    overflow: visible;
`

const BannerSwiperSlide = styled(SwiperSlide)`
    height: 380px;
    &.swiper-slide-active {
        width: calc(1200px - 225px);
    }
`

const BannerSwiperImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const BannerSwiperBtn = styled.button`
    position: absolute;
    width: 40px;
    height: 60px;
    top: 50%;
    transform: translateY(-50%);
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 10;

    &.swiper-prev {
        left: 25px;
        background-image:  url(${require('assets/images/icons/arw_prev_white.svg').default});
    }

    &.swiper-next {
        right: 25px;
        background-image:  url(${require('assets/images/icons/arw_next_white.svg').default});
    }
`