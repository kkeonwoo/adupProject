
 // 메인페이지 이벤트

$(function(){
	winResize.init();

        // rolling banner
        var rollingBanner = $('.rolling-banner .slider').bxSlider({
            auto: true,
            controls:false,
            autoControls: true,
            stopAutoOnClick: true,
            pager: true,
            nextSelector: '.rolling-banner .banner-next',
            prevSelector: '.rolling-banner .banner-prev',
            touchEnabled: (navigator.maxTouchPoints > 0), //2021-10-21 링크오류해결 추가
        });
        $('.bx-stop').on('click', function(){
            $('.bx-pager-link.active').addClass('pause');
        });
        $('.bx-start').on('click', function(){
            $('.bx-pager-link').removeClass('pause');
        });
        $('.bx-controls-direction a').on('click', function(){
            $('.bx-pager-link.active').addClass('pause');
        });
        $('.banner-next').click(function(){
            rollingBanner.goToNextSlide();
            rollingBanner.stopAuto();
            rollingBanner.startAuto();
            return false;
        });
        $('.banner-prev').click(function(){
            rollingBanner.goToPrevSlide();
            rollingBanner.stopAuto();
            rollingBanner.startAuto();
            return false;
        });


});
