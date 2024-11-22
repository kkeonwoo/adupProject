let $window = $(window);
let $html = $('html');
let $body = $('body');

$.namespace = function() {
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
    init : function(){
        gsap.registerPlugin(ScrollToPlugin);

        this.datepicker();
        this.button();
        this.modal.init();
        this.scrollTop();
        this.tab();
        this.swiper.init();
        this.visualSVG();
    },
    modal: {
        /**
         * modal 로드시 초기화
         */
        init(){
            this.update();
        },
        /**
         * 새로운 modal 버튼 요소 생성시 기본값 세팅
         */
        update(){
            const $modalButtonAll = $('.modal_toggle');
            $modalButtonAll.off('click').on('click',(e)=>{
                const $this = $(e.currentTarget);
                const $modal = $($this.data('target'));
                this.open($modal,$this);
            });
        },
        /**
         * 모달 오픈시 이벤트
         * @param {HTMLDivElement} $modal - 오픈한 모달 요소
         * @param {HTMLDivElement} $openBtn - 현재 누른 버튼
         * @param {HTMLDivElement[]} addFocusEls - 모달내부 포커스 요소들
         * @param {HTMLDivElement[]} addCloseEls - 모달내부 닫기 요소들
         */
        open($modal,$openBtn,addFocusEls = [],addCloseEls = []){
            const defaultFocusEls = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
            const defaultCloseEls = '.close';
            const focusableEls = Array.prototype.slice.call($modal.find(defaultFocusEls, addFocusEls));
            const closeableEls = Array.prototype.slice.call($modal.find(defaultCloseEls, addCloseEls));
            const firstTabEl = focusableEls[0];
            const lastTabSEl = focusableEls[focusableEls.length - 1];
            fn.addHidden();
            $modal.addClass('active');
            $modal.off('keydown').on('keydown',e=>this.trapTabKey(e,firstTabEl,lastTabSEl));
            $modal.on('click',(e)=>{
                const $target = $(e.target);
                const $modalActive = $('.modal.active');
                if ($target.closest('.modal_dialog').length < 1 && $modalActive.attr('data-dim-click') !== 'false') {
                    this.close($modal,$openBtn);
                }
            });
            closeableEls.forEach((el)=>{
                $(el).on('click',e=>this.close($modal,$openBtn));
            });

            $modal.removeClass('modal_close').focus();
        },
        /**
         * 모달 닫기시 이벤트
         * @param {HTMLDivElement} $modal - 오픈한 모달 요소
         * @param {HTMLDivElement} $openBtn - 현재 누른 버튼
         */
        close($modal,$openBtn){
            fn.removeHidden();
            $('.modal').off('scroll',()=>{});
            $('html, body').removeClass('hidden');
            $modal.addClass('modal_close');
            $modal.removeClass('active');
            if(!$openBtn.length) return; 
            $openBtn.focus().blur();
        },
        /**
         * 키보드 이벤트 제어
         * - Tab 버튼 포커스 제어
         * @param {Event}} e - 이벤트 객체
         * @param {HTMLDivElement} firstTabEl - 모달 내부 첫번째 포커스 요소
         * @param {HTMLDivElement} lastTabSEl - 모달 내부 마지막 포커스 요소
         */
        trapTabKey(e,firstTabEl,lastTabSEl){
            // Check for TAB key press
            if (e.keyCode === 9) {
                // SHIFT + TAB
                if (e.shiftKey) {
                    if (document.activeElement === firstTabEl) {
                        e.preventDefault();
                        lastTabSEl.focus();
                    }
                } else {
                    if (document.activeElement === lastTabSEl) {
                        e.preventDefault();
                        firstTabEl.focus();
                    }
                }
            }
            // ESCAPE
            if (e.keyCode === 27) {
                closeModal();
            }
        }
    },
    datepicker : function(){
        if (fn.exists('.form_datepicker')) {
            $('.form_datepicker').datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'yy-mm-dd',
                prevText: '이전 달',
                nextText: '다음 달',
                monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                dayNames: ['일', '월', '화', '수', '목', '금', '토'],
                dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
                dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                showMonthAfterYear: true,
                yearSuffix: '년',
                ignoreReadonly: true,
                minDate: '-100y',
                yearRange: "-100:+10",
                beforeShow: function (i) { if ($(i).attr('readonly')) { return false; } }
            }).attr('autocomplete','off');
        }
    },
    button: function () {
        $(document).on('click','#header .more_btn',(e)=>{
            $('#header').toggleClass('active');
            if($('#header').hasClass('active')){
                fn.addHidden();
                this.dummy.show();
            }else {
                fn.removeHidden();
                this.dummy.hide();
            }
        });
        $(document).on('click','.dummy',(e)=>{
            $('#header').removeClass('active');
            fn.removeHidden();
            this.dummy.hide();
        });
        $(document).on('click','.counsel_area .show_btn',(e)=>{
            $('.counsel_modal').addClass('active');
        });
        $(document).on('click','.counsel_area .close_btn',(e)=>{
            $('.counsel_modal').removeClass('active');
        });
    },
    scrollTop: function () {
        let windowTop = $(window).scrollTop();
        if (windowTop > 0) {
            $("body").addClass('scroll_down');
            $("#header").addClass('fixed');
        } else {
            $("body").removeClass('scroll_down');
            $("#header").removeClass('fixed');
        }
        $(window).scroll(function () {
            let windowTop = $(window).scrollTop();
            if (windowTop > 0) {
                $("body").addClass('scroll_down');
                $("#header").addClass('fixed');
            } else {
                $("body").removeClass('scroll_down');
                $("#header").removeClass('fixed');
            }
        });
    },
    tab: function() {
        $('.tab-item').click(function (e) {
            e.preventDefault();
            let tabName = $(this).data('tab');
            $(this).addClass('active').siblings().removeClass('active');
            $(tabName).addClass('active').siblings().removeClass('active');
        });

        if ($(document).find('.sub-nav-item').length < 1) return;
        const btns = document.querySelectorAll('.btn-sub-nav');
        const historyEl = document.querySelectorAll('.history-list')
        const hdrHt = document.getElementById('header').offsetHeight;
        const subNavHt = document.querySelector('.group-sub-nav').offsetHeight;

        btns.forEach((btn,idx) => {
            btn.addEventListener('click', function() {
                const targetId = btn.getAttribute('data-year'); 
                const targetElement = document.querySelector(targetId);
                let height = targetElement.offsetTop - hdrHt - subNavHt;
                gsap.to(window, { duration: 1, scrollTo: height})
                btns.forEach(t=>{t.parentNode.classList.remove('active')});
                this.parentNode.classList.add('active');
            })

            ScrollTrigger.create({
                trigger: historyEl[idx],
                start: `top +=${hdrHt + subNavHt + 1}`,
                end: `bottom +=${hdrHt + subNavHt + 1}`,
                // markers: true,
                onEnter: () => btnToggleClass(idx),
                onEnterBack: () => btnToggleClass(idx),
            })
        })

        function btnToggleClass(activeIdx) {
            btns.forEach((btn, i) => {
                btn.parentNode.classList.toggle("active", i === activeIdx);
            });
        }

    },
    swiper: {
        init: function() {
            this.gallerySwiper();
            this.mainSwiper();
            this.productSwiper();
            this.introSwiper();
        },
        gallerySwiper: function() {
            const gallery = $(document).find('.group-gallery .gallery-swiper');
            if (gallery.length < 1) return;
            gallery.each((idx, el) => {
                const btnNext = $(el).closest('.group-gallery').find('.swiper-button-next')[0];
                const btnPrev = $(el).closest('.group-gallery').find('.swiper-button-prev')[0];
                const thumbItem = $(el).closest('.group-gallery').find('.thumb-item');
                const thumbBtn = thumbItem.find('a')
                
                let swiperGallery = new Swiper(el, {
                    spaceBetween: 10,
                    navigation: {
                        nextEl: btnNext,
                        prevEl: btnPrev,
                    },
                    on: {
                        slideChange: (swiper) => {
                            let idx = swiper.realIndex;
                            $(el).siblings().find('.thumb-item').eq(idx).addClass('active').siblings().removeClass('active');
                        }
                    }
                });

                thumbBtn.on('click', function(e) {
                    e.preventDefault();
                    let parent = $(this).closest('.thumb-item');
                    let idx = parent.index();
            
                    swiperGallery.slideTo(idx);
                    parent.addClass('active').siblings().removeClass('active');
                })
            })
        },
        mainSwiper: function() {
            if ($('.main-swiper') < 1) return;
            let swiperMain = new Swiper('.main-swiper', {
                spaceBetween: 0,
                loop:true,
                navigation: {
                    nextEl: '.main-swiper .swiper-button-next',
                    prevEl: '.main-swiper .swiper-button-prev',
                },
            });
        },
        productSwiper: function() {
            if ($('.prd-swiper') < 1) return;
            let swiperPrd = new Swiper('.prd-swiper', {
                slidesPerView: 1.8,
                spaceBetween: 20,
                pagination: {
                    el: ".prd-swiper .swiper-pagination",
                    type: "progressbar",
                },
            });
        },
        introSwiper: function() {
            if ($('.intro-swiper') < 1) return;
            let swiperIntro = new Swiper('.intro-swiper', {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                // effect: "fade",
                pagination: {
                    el: ".intro-swiper .swiper-pagination",
                    clickable: true,
                },
            });
        },
    },
    dummy: {
        show(){
            if(!$('.dummy').length){
                $('body').append('<div class="dummy"></div>');
            }
            $('.dummy').addClass('active');
        },
        hide(){
            $('.dummy').removeClass('active');
        }
    },
    visualSVG: function() {
        const visualEl = $('.sub-visual');
        const color = visualEl.data('color');
        const filter = visualEl.data('filter');
        const opacity = visualEl.data('opacity');

        let html = `
        <div class="svg">
            <svg viewBox="0 0 720 242" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M720 0V242H0V221H175C469 205.4 660.833 67.1667 720 0Z" fill="${color}" style="mix-blend-mode: ${filter ? filter : 'unset'}; opacity: ${opacity ? opacity : 1}"/>
            </svg>
        </div>
        `

        visualEl.append(html);
    }
}
$(function () {
    $window = $(window);
    $html = $('html');
    $body = $('body');
    gv.init();
});
