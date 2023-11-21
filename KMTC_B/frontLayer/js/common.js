let $window = $(window);
let $html = $('html');
let $body = $('body');

$.namespace = function () {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split('.');
        o = window;
        for (j = 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};

$.namespace('gv');
gv = {
    init: function () {
        this.fullpage.init();
        this.swiper.init();
        this.gnb.init();
    },
    fullpage:{
        init(){
            this.main();
        },
        main(){
            gsap.registerPlugin(MotionPathPlugin);
            
            $('#fullpage').fullpage({
                // sectionsColor: ['#C63D0F', '#1BBC9B', '#7E8F7C','#333'],
                responsiveWidth: 1025,
                // responsiveHeight : 800,
                // navigation: true,
                // navigationPosition: 'right',
                anchors: ['sec1', 'sec2', 'sec3', 'sec4'],
                // scrollOverflow: true,
                autoScrolling:true,
                keyboardScrolling: true,
                css3: true,
                'onLeave': function (origin, destination, direction, trigger) {
                    let tl = gsap.timeline({defaults: {duration: 4,ease:'linear'}});
                    // tl.progress(0);
                    tl.paused(true);
                    if (destination == 3) {
                        let path01 = document.getElementById('path01');
                        let path02 = document.getElementById('path02');
                        let offset01 = path01.getTotalLength();
                        let offset02 = path02.getTotalLength();
                        let coord = document.querySelectorAll('.ico_map');
                        
                        tl.restart();
                        tl.fromTo(path01, 
                            { strokeDashoffset: -offset01},
                            { strokeDashoffset: 0}
                        )
                        .fromTo(path02, 
                            { strokeDashoffset: offset02},
                            { strokeDashoffset: 0}
                        ,'<')
                        .fromTo(coord, 
                            { autoAlpha: 0, scale: 0.5, duration: 1, ease: 'back.inOut(1.5)'},
                            { autoAlpha: 1, scale: 1, duration: 1, ease: 'back.inOut(1.5)', stagger: { each: 0.3 }},
                        '<')
                        .fromTo(coord,
                            { y: -10, duration: 1.5, ease: 'none', yoyo: true, repeat: -1,},
                            { y: 10, duration: 1.5, ease: 'none', stagger: { each: 0.3, yoyo: true, repeat: -1, repeatRefresh: true, }},
                        '<')
                    }
                },
            });
        },
    },
    swiper:{
        init(){
            this.swiperVisual();
            this.swiperBiz();
            // this.swiperBizSub();
        },
        swiperVisual(){
            let swiper = new Swiper(".swiper_visual", {
                slidesPerView: 'auto',
                loop: true,
                centeredSlides: true,
                speed: 1500,
                navigation: {
                    nextEl: ".swiper_visual .swiper-button-next",
                    prevEl: ".swiper_visual .swiper-button-prev",
                },
                pagination: {
                    el: ".swiper_visual .swiper-pagination",
                    clickable: true,
                },
                on: {
                    slideChangeTransitionStart : function(t) {
                        const $active = $('.swiper_visual .swiper-slide-active');
                        const $txtBox = $active.find('.txt_box').clone();
                        $('.swiper_visual .view_area').html($txtBox);
                    },
                },
            });
        },
        swiperBiz(){
            let swiperBizSub = new Swiper(".swiper_biz_sub", {
                slidesPerView: 4,
                loop: true,
                loopedSlides: 10,
                on: {
                    setTransition : function(t) {
                        const $active = $('.swiper_biz_sub .swiper-slide-active');
                        const $txtBox = $active.find('.biz_txt_box').clone();
                        $('.biz_txt_box_wrap').html($txtBox);
                    },
                },
            });
            let swiperBiz = new Swiper(".swiper_biz", {
                slidesPerView: 3,
                slidesPerView: 'auto',
                centeredSlides: true,
                loop: true,
                navigation: {
                    nextEl: ".swiper_biz_area .swiper-button-next",
                    prevEl: ".swiper_biz_area .swiper-button-prev",
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 'auto',
                    },
                },
            });

            swiperBiz.controller.control = swiperBizSub;
            swiperBizSub.controller.control = swiperBiz;

            var slides = document.querySelectorAll('.swiper_biz_sub .swiper-slide');
            slides.forEach(function (slide, index) {
                slide.addEventListener('click', function () {
                    swiperBizSub.slideTo(index);
                });
            });
        }, 
        swiperBizSub(){
            let swiper = new Swiper(".swiper_biz_sub", {
                slidesPerView: 4,
                loop: true,
            });
        },
    },
    closeModal: function (
        $modal
    ) {
        fn.removeHidden();
        $('.modal').off('scroll', function () { });
        $('html, body').removeClass('hidden');
        $modal.addClass('modal_close');
        $modal.removeClass('active');
        $('.activeModal').focus();
        setTimeout(() => {
            $('.btn.activeModal').removeClass('activeModal')
        },100)
    },
    openModal: function (
        $modal,
        focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',
        $modalCloseButton = $modal.find('.close'),
        focusedElementBeforeModal = document.activeElement
    ) {
        $(focusedElementBeforeModal).addClass('activeModal');
        fn.addHidden();
        $modal.addClass('active');

        $modal.on('keydown', function (e) {
            trapTabKey(e);
        });

        $modal.on('click', function (e) {
            if ($(e.target).closest('.modal_box').length < 1 && $modal.attr('data-dim-click') !== 'false' && !$modal.hasClass('modal_certification') && $(e.target).closest('.fixed_option_area').length === 0) {
                EasyCharger.closeModal($modal);
            }
        });

        $modalCloseButton.on('click', function () {
            if($modal.closest('.modal_notice').length){ //Notice Popup
                if($modal.find('.modal_box.hide').length !== $modal.find('.modal_box').length){
                    $(this).closest('.modal_box').addClass('hide');
                    if($modal.find('.modal_box.hide').length === $modal.find('.modal_box').length){
                        EasyCharger.closeModal($modal);    
                    }
                }
            }else{
                EasyCharger.closeModal($modal);
            }
        })

        var focusableElements = $modal.find(focusableElementsString),
            focusableElements = Array.prototype.slice.call(focusableElements),
            firstTabStop = focusableElements[0],
            lastTabStop = focusableElements[focusableElements.length - 1];

        $($modal).removeClass('modal_close');
        firstTabStop?.focus();

        function trapTabKey(e) {
            // Check for TAB key press
            if (e.keyCode === 9) {
                // SHIFT + TAB
                if (e.shiftKey) {
                    if (document.activeElement === firstTabStop) {
                        e.preventDefault();
                        lastTabStop.focus();
                    }
                } else {
                    if (document.activeElement === lastTabStop) {
                        e.preventDefault();
                        firstTabStop.focus();
                    }
                }
            }
            // ESCAPE
            if (e.keyCode === 27) {
                EasyCharger.closeModal($modal);
            }
        }
    },
    gnb: {
        init() {
            this.open();
            this.site();
            this.mob();
        },
        open() {
            let $header = $('.header');
            let $depth1_list = $('.depth1_list');

            $depth1_list.on('mouseover', function(e) {
                $header.addClass('open');
            });
            $header.on('mouseleave', function(e) {
                $header.removeClass('open');
            });
        },
        site() {
            let $btnMenu = $('.menu_btn');
            let $header = $('.header');

            $btnMenu.on('click', function() {
                if ($(this).closest('.header').hasClass('sitemap')) {
                    $('.sitemap').remove();
                    $('.header').find('.depth1_list').on('mouseover', function(e) {
                        $header.addClass('open');
                    });
                    fn.removeHidden();
                } else {
                    $header.clone(true, true).addClass('sitemap').appendTo('.sec1');
                    $('.header').removeClass('open');
                    $('.header').find('.depth1_list').off('mouseover')
                    fn.addHidden();
                }
            })
        },
        mob() {
            if ($(window).innerWidth() > 719) return;
            $('html, body').addClass('mob');

            let timer, delay = 300;
            $(window).on('resize', function() {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if ($(window).innerWidth() < 720) {
                        $('html, body').addClass('mob');
                    } else {
                        $('html, body').removeClass('mob');
                    }
                }, delay);
            })

            if ($('html, body').hasClass('mob')) {
                let $depth1_link = $('.depth1_link');

                $depth1_link.on('click', function(e) {
                    let t = e.currentTarget;
                    if ($(t).siblings('.depth2_area').hasClass('open')) {
                        $(t).siblings('.depth2_area').slideUp(400);
                        $(t).siblings('.depth2_area').removeClass('open')
                    } else {
                        if ($(t).closest('.depth1_item').siblings().find('.depth2_area').hasClass('open')) {
                            $(t).closest('.depth1_item').siblings().find('.depth2_area').slideUp(400);
                            $(t).closest('.depth1_item').siblings().find('.depth2_area').removeClass('open');
                        }
                        $(t).siblings('.depth2_area').slideDown(400);
                        $(t).siblings('.depth2_area').addClass('open')
                    }
                })
            }
        }
    }
}
$(()=>{
    $window = $(window);
    $html = $('html');
    $body = $('body');
    gv.init();
});
