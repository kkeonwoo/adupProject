import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import banner01 from 'assets/images/@/@banner01.jpg'
import banner02 from 'assets/images/@/@banner02.jpg'
import banner03 from 'assets/images/@/@banner03.jpg'
import banner04 from 'assets/images/@/@banner04.jpg'

import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper styles
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";

export default function SwiperBanner() {
    const [ swiperRef, setSwiperRef ] = useState(null);
    const [ swiperControl, setSwiperControl ] = useState(true);

    const controlSwiper = () => {
        setSwiperControl((prev) => !prev)
        console.log(swiperControl);
        swiperControl ? playSwiper() : pauseSwiper();
    }
    function playSwiper () {
        console.log('aaa');
        swiperRef.autoplay.start()
    }
    
    function pauseSwiper () {
        console.log('bbb');
        swiperRef.autoplay.stop()
    } 

    const handleAllBanner = () => {
        console.log('open all banner');
    }
    return (
        <BannerSwiperWrap>
            <BannerSwiperBtn className='swiper-prev' />
            <BannerSwiper
                onSwiper={setSwiperRef}
                slidesPerView={"auto"}
                loop={true}
                centeredSlides={true}
                autoplay={{
                    delay:2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    el: '.swiper_pagination',
                    type: "fraction",
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
            <BottomArea>
                <BannerSwiperController className="swiper_controller">
                    <BannerSwiperPagination className="swiper_pagination"></BannerSwiperPagination>
                    <BannerSwiperPlay type='button' onClick={controlSwiper} className={swiperControl ? 'swiper_play' : 'swiper_play pause'}></BannerSwiperPlay>
                </BannerSwiperController>
                <button type='button' onClick={handleAllBanner}></button>
            </BottomArea>
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

const BannerSwiperController = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 25px;
    background-color: rgba(0, 0, 0, .25);
    border-radius: 50px;
    z-index: 20;
`

const BannerSwiperPagination = styled.div`
    color: ${({theme}) => theme.lightMode.white };
`

const BottomArea = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    position: absolute;
    bottom: 15px;
    right: 15px;
`

const BannerSwiperPlay = styled.button`
    min-width: 35px;
    height: 35px;
    border-radius: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: rgba(0, 0, 0, .45);
    background-image: url(${require('assets/images/icons/ico_pause_white.svg').default});
    
    &.pause {
        background-image: url(${require('assets/images/icons/ico_play_white.svg').default});
    }
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