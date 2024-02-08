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

$.namespace('dentistrySNU');
let $header, $depth2Area, $depth2List, $bgOverlay, resizeStatus;
dentistrySNU = {
    init : function(){
        this.tab();
        this.select.init();
        this.swiper.init();
        this.gnb.init();
        this.fullpage();
        this.history();
        this.aosSetting();
        this.floatingBtn();
    },
    tab: function() {
        let tabLink, tabItem, tabPanel, activeIdx;
        tabLink = $('.tab_link');
        tabPanel = $('.tab_panel');

        tabLink.on({
            click: (e) => {
                init(e);
                handleTab(tabItem, tabPanel, activeIdx);
            },
            keydown: (e) => {
                if (!e.shiftKey) init(e);
                if (e.keyCode === 37 || e.keyCode === 38) {
                    if (activeIdx > 0) handleTab(tabItem, tabPanel, activeIdx - 1);
                } else if (e.keyCode === 39 || e.keyCode === 40) {
                    if (activeIdx < tabItem.length - 1) handleTab(tabItem, tabPanel, activeIdx + 1);
                } else if (e.keyCode === 9) {
                    if (!e.shiftKey) {
                        tabPanel.eq(activeIdx).focus();
                    }
                }
            }
        })

        function init(e) {
            e.preventDefault();
            let $t = $(e.currentTarget);
            tabItem = $t.closest('.tab_container').find('.tab_item');
            tabPanel = $t.closest('.tab_container').find('.tab_panel');
            activeIdx = $t.closest('.tab_item').index();
        }

        function handleTab(tabItem, tabPanel, activeIdx) {
            tabItem.find('.tab_link').removeClass('active').attr({'aria-selected': false, 'tabindex': -1});
            tabItem.eq(activeIdx).find('.tab_link').addClass('active').focus().attr({'aria-selected': false, 'tabindex': null});
            tabPanel.attr({'tabindex': -1, 'hidden': true});
            tabPanel.eq(activeIdx).attr({'tabindex': 0, 'hidden': false});
        }
    },
    select : {
        init() {
            let selectBox = $('.form_select'),
                selectBtn = selectBox.find('.form_btn');

            /**
             * selectBox 모달 내부 위치 시
             */
            selectBox.each((i, t) => {
                let firstOption = $(t).find('.option_item').eq(0),
                    tParents = $(t).parents();

                // dentistrySNU.select.handleBtnText(firstOption);
                // 부모 요소에 스크롤 이벤트 발생 시
                if (tParents.css('overflow') === 'visible' || tParents.css('overflow') === 'auto') {
                    tParents.on('scroll', function() { setTimeout(() => dentistrySNU.select.closeOption()); })
                }
            })

            /**
             * selectBox open 시, 위치 및 형제 요소 닫기
             */
            selectBtn.on({
                click: (e) => {
                    let t = e.currentTarget,
                        formSelect = $(t).closest('.form_select'),
                        optionArea = formSelect.find('.option_area');

                    if (!fn.hasClass(formSelect, 'show')) {
                        $(t).addClass('active');
                        formSelect.addClass('show');
                        $('body > .option_area').remove();
                        $('body').append(`${optionArea.prop('outerHTML')}`);

                        optionArea = $('body > .option_area');
                        optionItem = optionArea.find('.option_item');
                        
                        this.handlePosOption(t);
                    } else {
                        this.closeOption();
                    }
                },
                keydown: (e) => {
                    let t = e.currentTarget,
                        tOptionItem = $(t).siblings().find('.option_item'),
                        tActiveItem = $(t).siblings().find('.selected'),
                        optionItem = $(document).find('body > .option_area .option_item'),
                        activeIdx = tActiveItem.index();

                    if (e.keyCode === 38 && activeIdx <= 0) return;
                    if (e.keyCode === 40 && activeIdx >= tOptionItem.length - 1) return;
                    if (e.keyCode === 38 || e.keyCode === 40) {
                        e.preventDefault();
                        $(t).addClass('active');
                        $(t).closest('.form_select').addClass('active');
                        this.handleSelectOption(tOptionItem, tOptionItem.eq(e.keyCode === 38 ? activeIdx - 1 : activeIdx + 1));
                        this.handleSelectOption(optionItem, optionItem.eq(e.keyCode === 38 ? activeIdx - 1 : activeIdx + 1));
                        this.handleBtnText(tOptionItem.eq(e.keyCode === 38 ? activeIdx - 1 : activeIdx + 1));
                    } else if (e.keyCode === 9 || e.keyCode === 27) {
                        // escape
                        this.closeOption();
                    }
                }
            });

            /**
             * option 선택 시
             */
            $(document).on('click', 'body > .option_area .option_btn', (e) => {
                let t = e.currentTarget,
                    optionItem = $('.form_select.show').find('.option_item'),
                    activeIdx = $(t).closest('.option_item').index(),
                    selectBtn = $('.form_select').find('.form_btn.active');

                selectBtn.addClass('selected');
                this.handleSelectOption(optionItem, optionItem.eq(activeIdx));
                this.handleBtnText(optionItem.eq(activeIdx));
                this.closeOption();
            });

            /**
             * 화면 컨트롤 시, select box 닫기
             */
            $(window).on({
                click: function(e) {
                    !$(e.target).closest('.form_select').length && dentistrySNU.select.closeOption();
                },
                touchmove: function(e) {
                    !$(e.target).closest('.form_select').length && dentistrySNU.select.closeOption();
                },
                resize: function() {
                    let formSelect = $('.form_select.show'),
                        formSelectWdh = fn.hasClass(formSelect, 'show') && formSelect.outerWidth(),
                        posXSelectBtn = fn.hasClass(formSelect, 'show') && formSelect.offset().left,
                        optionArea = $('body > .option_area');

                        if (fn.hasClass(optionArea, 'show')) optionArea.css({'width' : formSelectWdh, 'left': posXSelectBtn})
                },
                scroll: function() {
                    fn.hasClass('.form_select', 'show') && dentistrySNU.select.closeOption();
                }
            })
        },
        /**
         * option 위치 설정
         * @param {t} target
         */
        handlePosOption(t) {
            let windowHt = $(window).outerHeight() + $(window).scrollTop(), // 화면 하단 높이
                posXSelectBtn = $(t).offset().left,
                posYSelectBtn = $(t).outerHeight() + $(t).offset().top, // select 버튼 하단 높이
                selectBtnWdh = $(t).outerWidth(),
                selectBtnHt = $(t).outerHeight(),
                gap = windowHt - posYSelectBtn,
                optionArea = $('body > .option_area'),
                optionAreaHt = optionArea.outerHeight(),
                posYOptionArea = posYSelectBtn - (optionAreaHt + selectBtnHt);

            // option 열기
            if (gap < optionAreaHt) { // 화면과 select 하단의 차이가 optionArea 높이보다 작다면
                optionArea.addClass('top');
                optionArea.addClass('show').css({'top': posYOptionArea, 'left': posXSelectBtn, 'width': selectBtnWdh});
            } else {
                optionArea.removeClass('top');
                optionArea.addClass('show').css({'top': posYSelectBtn, 'left': posXSelectBtn, 'width': selectBtnWdh});
            }
        },
        /**
         * selectBtn 텍스트 값 변경
         * @param {t} target
         */
        handleBtnText(t) {
            let selectedText = $(t).find('.option_btn').text(),
                selectedIdx = $(t).closest('.option_item').index(),
                selectBtn = $(t).closest('.form_select').find('.form_btn');

            selectBtn.text(selectedText).attr('selected-idx', selectedIdx);
        },
        /**
         * 선택된 option class, attr 변경
         * @param {initObj}  변경 전
         * @param {activeObj}  변경 후
         */
        handleSelectOption(initObj, activeObj) {
            $(initObj).removeClass('selected').attr('aria-selected', false);
            $(activeObj).addClass('selected').attr('aria-selected', true);
        },
        /**
         * select option list 닫기
         */
        closeOption() {
            $('.form_select').removeClass('show');
            $('.form_select').find('.option_area').removeClass('show top');
            $('body > .option_area').remove();
        },
    },
    swiper : {
        init() {
            this.spotSwiper();
            this.exhbnSwiper();
            this.collectSwiper();
            this.videoSwiper();
            this.dataSwiper();
        },
        spotSwiper() {
            if(!fn.exists('.swiper_spot')) return;

            const swiperExhbn = new Swiper('.swiper_spot', {
                slidesPerView: 1,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: ".swiper_spot .swiper-pagination",
                    clickable: true,
                },
            })
        },
        exhbnSwiper() {
            if(!fn.exists('.swiper_exhbn')) return;

            const swiperExhbn = new Swiper('.swiper_exhbn', {
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 8,
                observer : true,
                observeParents : true,
                navigation: {
                    nextEl: '.swiper_exhbn_wrap .swiper-button-next',
                    prevEl: '.swiper_exhbn_wrap .swiper-button-prev'
                },
                pagination: {
                    el: ".section02 .swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 32,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                    }
                },
                on: {
                    init: function(){
                        dentistrySNU.swiper.posBtnTop(document.querySelector('.swiper_exhbn_wrap'));
                    },
                    resize: function() {
                        dentistrySNU.swiper.posBtnTop(document.querySelector('.swiper_exhbn_wrap'));
                    }
                }
            })
        },
        collectSwiper() {
            if(!fn.exists('.swiper_col') || !fn.exists('.swiper_col_sub')) return;

            const swiperCol = new Swiper('.swiper_col', {
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 32,
            })
            
            const swiperColSub = new Swiper('.swiper_col_sub', {
                loop:true,
                slidesPerView: 'auto',
                // spaceBetween: 32,
                navigation: {
                    prevEl: '.cnt_right .swiper-button-prev',
                    nextEl: '.cnt_right .swiper-button-next'
                },
            })

            swiperCol.controller.control = swiperColSub;
            swiperColSub.controller.control = swiperCol;
        },
        videoSwiper() {
            if(!fn.exists('.swiper_video') || !fn.exists('.swiper_video_sub')) return;

            const swiperVideo = new Swiper('.swiper_video', {
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 8,
                navigation: {
                    nextEl: '.swiper_video_cnt .swiper-button-next',
                    prevEl: '.swiper_video_cnt .swiper-button-prev'
                },
                breakpoints: {
                    1024: {
                        spaceBetween: 32,
                    },
                },
            })

            const siwperVideoSub = new Swiper('.swiper_video_sub', {
                loop:true,
                slidesPerView: 'auto',
                spaceBetween: 32,
            })
            swiperVideo.controller.control = siwperVideoSub;
            siwperVideoSub.controller.control = swiperVideo;
        },
        dataSwiper() {
            if(!fn.exists('.data_swiper')) return;

            const swiperVideo = new Swiper('.data_swiper', {
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 8,
                navigation: {
                    nextEl: '.swiper_data_wrap .swiper-button-next',
                    prevEl: '.swiper_data_wrap .swiper-button-prev'
                },
                pagination: {
                    el: ".swiper_data_wrap .swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 32,
                    },
                },
            })
        },
        posBtnTop(t) {
            let $t = $(t);
            let swiperBtn = $t.find('.btn_ico');
            let swiperBtnHt = $t.find('.btn_ico').outerHeight();
            let imgHt = $t.find('.img').map((i, el) => {
                return $(el).outerHeight();
            })
            let maxHt = Math.max(...imgHt);

            swiperBtn.css({'top': (maxHt - swiperBtnHt) / 2});
        },
    },
    modal : {
        /**
         * 모달 열기
         * @param {$modal} init의 data-target
         * 초점 이동, 키보드 조작
         */
        openModal ($modal) {
            let $modalCloseButton = $('.modal .close');

            fn.addHidden();
            $modal.addClass('active').removeClass('modal_close');
            $modal.on({
                click: (e) => {
                    if ($(e.target).closest('.modal_box').length < 1 && $('.modal.active').attr('data-dim-click') !== 'false') {
                        dentistrySNU.modal.closeModal($modal);
                    }
                },
                keydown: (e) => trapTabKey(e),
            });
            $modalCloseButton.on('click', () => dentistrySNU.modal.closeModal($modal));

            var focusableElements = $modal.find(':focusable'),
                firstTabStop = focusableElements[0],
                lastTabStop = focusableElements[focusableElements.length - 1];

            firstTabStop.focus();

            function trapTabKey(e) {
                if (e.keyCode === 9) {
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
                if (e.keyCode === 27) dentistrySNU.modal.closeModal($modal);
            }
        },
        /**
         * 모달 닫기
         * @param {$modal} init의 data-target
         */
        closeModal ($modal) {
            fn.removeHidden();
            $modal.addClass('modal_close').removeClass('active');
        },
    },
    gnb : {
        init: function() {
            this.type4();
            this.fixed();
            this.gnbMob(); 

            $(window).on('resize', function() {
                let windowWidth = $(window).outerWidth();
                if (windowWidth <= 1024) {
                    $header.css('height', 72);
                } else {
                    $header.css('height', 140);
                }
            });
        },
        type4: function() {
            if(!$('#header').hasClass('type4') || $('#header').hasClass('header_mob')) return;

            let $gnb = $('.gnb'),
                $depth1List = $gnb.find('.depth1_list'),
                $depth1Item = $gnb.find('.depth1_item'),
                $depth1Link = $depth1Item.children('a');
                $firstItem = $gnb.find('a').first(),
                $LastItem = $gnb.find('a').last();

            this.resize('.depth2_list');

            // open event
            $depth1List.on('mouseenter.type4 focusin.type4', this.openMenu);

            // close event
            $header.on('mouseleave.type4', this.closeMenu);
            $firstItem.on('keydown.type4', (e) => { if(e.keyCode === 9 && e.shiftKey) closeMenu(); })
            $LastItem.on('focusout.type4', this.closeMenu);

            // focus event
            $depth1Link.on('keydown.type4', function (e) {
                let dep1Idx = $(this).closest('.depth1_item').index();
                
                if ( e.keyCode === 9 ) {
                    if ( e.shiftKey ) {
                        if (dep1Idx <= 0) return;
                        e.preventDefault();
                        $depth2List.eq(dep1Idx - 1).find('li').last().find('.depth2_link').get(0).focus();
                    } else {
                        e.preventDefault();
                        $depth2List.eq(dep1Idx).find('.depth2_link').get(0).focus();
                    }
                }
            })
            $depth2List.each((idx, item) => {
                let $depth2Item = $(item).find('li');
                
                $depth2Item.first().find('a').on('keydown.type4', function(e) {
                    if ( e.keyCode === 9 && e.shiftKey ) {
                        e.preventDefault();
                        $('.depth1_item').eq(idx).find('.depth1_link').focus();
                    }
                })
                $depth2Item.last().find('a').on('keydown.type4', function(e) {
                    if ( e.keyCode === 9 && idx < $depth2List.length - 1 && !e.shiftKey) {
                        e.preventDefault();
                        $('.depth1_item').eq(idx + 1).find('.depth1_link').focus();
                    }
                })
            })
        },
        openMenu() { 
            if(!$('#header').hasClass('type4') || $('#header').hasClass('header_mob')) return;
            depth2Ht = dentistrySNU.gnb.maxHeight($depth2List);
            $header.addClass('color').stop().animate({ height : depth2Ht + $header.outerHeight() })
        },
        closeMenu() { 
            if(!$('#header').hasClass('type4') || $('#header').hasClass('header_mob')) return;
            $header.stop().animate({ height : 140 }, function() {
                if (fn.exists('#fullpage')) $header.removeClass('color');
                if (fn.hasClass('.spot', 'active') || !fn.exists('#fullpage') || fn.exists('.mobile')) return;
                $header.addClass('up');
            })
        },
        maxHeight(obj) {
            const heightArray = $(obj).map(function () {
                return $(this).outerHeight(true);
            });
            const maxHeight = Math.max(...heightArray);

            return maxHeight;
        },
        resize: function(obj) {
            let box_observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const cr = entry.contentRect;
                    depth2Ht = this.maxHeight(obj);
                }
            });

            const box = document.querySelectorAll(obj);

            box.forEach((t, _) => {
                box_observer.observe(t);
            })
        },
        fixed: function() {
            $(window).scroll(_.throttle(() => {
                let st = $(document).scrollTop();

                if (st > 0) {
                    $header.addClass('fixed');
                } else {
                    $header.removeClass('fixed');
                }
            }, 300))
        },
        gnbMob: function() {
            if ($('#header').hasClass('header_pc')) return;
            let hamburger = $('.btn_hamburger');
            let $depth01Link = $('.depth1_link');

            hamburger.on('click', () => {
                if($('#header').hasClass('open')) {
                    // 닫기
                    $('.depth2_area').stop().hide();
                    $depth01Link.removeClass('open');
                    $header.removeClass('open');
                    fn.removeHidden();
                } else {
                    // 열기
                    $header.addClass('open');
                    fn.addHidden();
                }
            })
            
            $depth01Link.on('click.gnbMob', function(e) {
                e.preventDefault();
                $(this).toggleClass('open');
                $depth2Area = $(this).siblings();
                $depth2Area.stop().slideToggle();
            })
        }
    },
    fullpage : function() {
        if (!fn.exists('#fullpage')) return;

        $(document).ready(function() {
            $('#fullpage').fullpage({
                css3: true,
                responsiveWidth: 1024,
                keyboardScrolling: true,
                'onLeave': function(origin, destination, direction, trigger) {
                    if (direction === 'down') {
                        dentistrySNU.gnb.closeMenu();
                        handleHdr();
                    } else {
                        $header.removeClass('up');
                    }
                    
                    if (destination !== 1) {
                        $header.addClass('fixed');
                    } else {
                        $header.removeClass('fixed');
                    }
                },
            });
        });

        function handleHdr() {
            if (fn.exists('.mobile')) return;

            $(window).on('mousemove', function(e) {
                if (!fn.exists('.up')) return;

                let posY = e.clientY;
                if (posY < $header.outerHeight()) {
                    $header.removeClass('up');
                }
            })
        }
    },
    history : function() {
        if(!fn.exists('.history_page')) return;

        gsap.registerPlugin(ScrollTrigger);
        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", function() {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".history",
                    pin: '.cnt_left',
                    pinSpacing: false,
                    scrub: .125,
                    start: "top +=40%",
                    markers: true,
                    end: 'bottom-=10% +=60%',
                }
            });
            
            $('.history_box').each(function(index) {
                let __self = this;
                gsap.timeline({
                    scrollTrigger: {
                        trigger: __self,
                        scrub: true,
                        ease: "linear",
                        start: 'top center',
                        end: 'bottom center',
                        id: 'history_box',
                        // markers: true,
                        invalidateOnRefresh: true,
                        onEnter: function() {
                            $('.cnt_left .img_area:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
                            $('.history_box:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
                            gsap.to($('.cnt_left .img_area'), { duration: .6, y: index * -100 + '%' })
                        },
                        onEnterBack: function() {
                            $('.cnt_left .img_area:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
                            $('.history_box:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
                            gsap.to($('.cnt_left .img_area'), { duration: .6, y: index * -100 + '%' })
                        },
                    }
                })
            });
        })

        // mm.add("(max-width: 768px)", function() {
        //     let tl02 = gsap.timeline({
        //         scrollTrigger: {
        //             trigger: ".cnt_left",
        //             pin: '.cnt_left',
        //             // pinSpacing: false,
        //             scrub: .125,
        //             start: "bottom center",
        //             markers: true,
        //             end: 'bottom',
        //         }
        //     });
            
        //     // $('.history_box').each(function(index) {
        //     //     let __self = this;
        //     //     gsap.timeline({
        //     //         scrollTrigger: {
        //     //             trigger: __self,
        //     //             scrub: true,
        //     //             ease: "linear",
        //     //             start: 'top center',
        //     //             end: 'bottom center',
        //     //             id: 'history_box',
        //     //             // markers: true,
        //     //             invalidateOnRefresh: true,
        //     //             onEnter: function() {
        //     //                 $('.cnt_left .img_area:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
        //     //                 $('.history_box:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
        //     //                 gsap.to($('.cnt_left .img_area'), { duration: .6, y: index * -100 + '%' })
        //     //             },
        //     //             onEnterBack: function() {
        //     //                 $('.cnt_left .img_area:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
        //     //                 $('.history_box:nth-child(' + (index + 1) + ')').addClass('active').siblings().removeClass('active');
        //     //                 gsap.to($('.cnt_left .img_area'), { duration: .6, y: index * -100 + '%' })
        //     //             },
        //     //         }
        //     //     })
        //     // });
        // })

    },
    aosSetting : function() {
        if ($('[data-aos]').length === 0) return;
        $(document).ready(function() {
            AOS.init({
                duration: 1000,
                delay: 100,
                easing: 'ease',
            });
        })
        let scrollRef = 0;
        
        window.addEventListener('scroll', function () {
            scrollRef <= 10 ? scrollRef++ : AOS.refresh();
        });
    },
    floatingBtn : function() {
        if (fn.exists('.mobile')) return;
        $(document).ready(function () {
            let floatBtn = $('.float_area');
            if (resizeStatus) {
                resizeStatus = false;
                $(window).scroll(function () {
                    let st = $(window).scrollTop();
    
                    floatBtn.css('top', 'calc(50% + ' + st + 'px)');
                });
            }
        });
    },
    windowSize() {
        let windowWidth = window.outerWidth;
        let $body = $('body');
    
        if (windowWidth <= 1024) {
            console.log('mobile');
            $('.depth2_area').css('display', 'none');
            $header.addClass('header_mob').removeClass('header_pc');
            $body.removeClass('pc').addClass('mobile');
        } else {
            console.log('pc');
            fn.removeHidden();
            $header.removeClass('open');
            $('.depth2_area').css('display', 'block');
            $header.addClass('header_pc').removeClass('header_mob')
            $body.removeClass('mobile').addClass('pc');
        }
    }
}
$(() => {
    $header = $('#header');
    $depth2Area = $('.depth2_area');
    $depth2List = $depth2Area.find('.depth2_list');
    $bgOverlay = $('.gnb_overlay_bg');
    
    $(document).ready(function() {
        resizeStatus = false;
        dentistrySNU.windowSize();
        
        $(window).resize(function() {
            resizeStatus = true;
            dentistrySNU.windowSize();
        });
    });

    dentistrySNU.init();
});
