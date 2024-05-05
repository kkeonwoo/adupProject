/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */

$(function(){

    // swipe
    var swiper = new Swiper(".main-swiper", {
        slidesPerView: "auto",
        spaceBetween: 10,
        observer: true,
        observeParents: true,
        pagination: {
            el: ".main-swiper + .swiper-pagination",
            type: "progressbar",
        },
    });

    // bottom banner
    $('.slider > .page-btns > .page-btn').click(function(){
        var $clicked = $(this);
        var $slider = $(this).closest('.slider');

        var index = $(this).index();
        var isLeft = index == 0;

        var $current = $slider.find(' > .slides > .bn.active');
        var $post;

        if ( isLeft ){
            $post = $current.prev();
        }
        else {
            $post = $current.next();
        }

        if ( $post.length == 0 ){
            if ( isLeft ){
                $post = $slider.find(' > .slides > .bn:last-child');
            }
            else {
                $post = $slider.find(' > .slides > .bn:first-child');
            }
        }

        $current.removeClass('active');
        $post.addClass('active');

        updateCurrentPageNumber();
    });

    /* google analytics click �대깽�� 罹먯튂�뚮Ц�� �먮룞 �대�吏� 援먯껜�� 以묒� �쒗궡!
    setInterval(function(){
        $('.slider > .page-btns > .n-btn').click();
    }, 2500);
    */

    // �щ씪�대뜑 �섏씠吏� 踰덊샇 吏���
    function pageNumber__Init(){
        var totalSlideNo = $('.slider > .slides > .bn').length;

        $('.slider').attr('data-slide-total', totalSlideNo);

        $('.slider > .slides > .bn').each(function(index, node){
            $(node).attr('data-slide-no', index + 1);
        });
    };

    pageNumber__Init();

    // �щ씪�대뜑 �대룞�� �섏씠吏� 踰덊샇 蹂�寃�
    function updateCurrentPageNumber(){
        var totalSlideNo = $('.slider').attr('data-slide-total');
        var currentSlideNo = $('.slider > .slides > .bn.active').attr('data-slide-no');

        $('.slider > .page-btns > .page-no > .total-slide-no').html(totalSlideNo);
        $('.slider > .page-btns > .page-no > .current-slide-no').html(currentSlideNo);
    };

    updateCurrentPageNumber();


    /* *******************************************
    * 硫붿씤�섏씠吏� 理쒖긽�� 濡ㅻ쭅諛곕꼫 �ㅽ겕由쏀듃 :: 2021-12-03 �쎌엯
    ******************************************* */
    // rolling banner
    var rollingBanner = $('.rolling-banner .slider').bxSlider({
        auto: true,
        controls:false,
        autoControls: true,
        stopAutoOnClick: true,
        pager: true,
        nextSelector: '.rolling-banner .banner-next',
        prevSelector: '.rolling-banner .banner-prev',
        touchEnabled: (navigator.maxTouchPoints > 0), //2021-10-21 留곹겕�ㅻ쪟�닿껐 異붽�
        // �뱀젒洹쇱꽦 異붽�
        onSliderLoad: function(){
            $(".bx-clone").find("a").prop("tabIndex","-1");
        }
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