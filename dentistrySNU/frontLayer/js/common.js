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
let $header;
dentistrySNU = {
    init : function(){
        this.tab();
        this.select.init();
        this.swiper.init();
        this.gnb.init();
        this.fullpage();
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

                dentistrySNU.select.handleBtnText(firstOption);
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
                    selectBtn = $('.form_select.active').find('.form_btn');

                selectBtn.addClass('active');
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
            this.exhbnSwiper();
            this.collectSwiper();
            this.videoSwiper();
            this.dataSwiper();
        },
        exhbnSwiper() {
            if(!fn.exists('.swiper_exhbn')) return;

            const swiperExhbn = new Swiper('.swiper_exhbn', {
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 20,
                observer : true,
                observeParents : true,
                navigation: {
                    nextEl: '.swiper_exhbn_wrap .swiper-button-next',
                    prevEl: '.swiper_exhbn_wrap .swiper-button-prev'
                },
                breakpoints: {
                    1081: {
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
                        dentistrySNU.swiper.posBtnTop('.swiper_exhbn_wrap');
                    },
                    resize: function() {
                        dentistrySNU.swiper.posBtnTop('.swiper_exhbn_wrap');
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

            const siwperColSub = new Swiper('.swiper_col_sub', {
                loop:true,
                slidesPerView: 'auto',
                spaceBetween: 32,
                navigation: {
                    nextEl: '.swiper_col_sub .swiper-button-next'
                }
            })
            swiperCol.controller.control = siwperColSub;
            siwperColSub.controller.control = swiperCol;
        },
        videoSwiper() {
            if(!fn.exists('.swiper_video') || !fn.exists('.swiper_video_sub')) return;

            const swiperVideo = new Swiper('.swiper_video', {
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 32,
                navigation: {
                    nextEl: '.swiper_video_cnt .swiper-button-next',
                    prevEl: '.swiper_video_cnt .swiper-button-prev'
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
                slidesPerView: 4,
                spaceBetween: 32,
                navigation: {
                    nextEl: '.swiper_data_wrap .swiper-button-next',
                    prevEl: '.swiper_data_wrap .swiper-button-prev'
                },
            })
        },
        posBtnTop(t) {
            let $t = $(t);
            let swiperBtn = $t.find('.btn_ico');
            let imgHt = $t.find('.img').outerHeight();
            let swiperBtnHt = $t.find('.btn_ico').outerHeight();

            swiperBtn.css({'top': (imgHt - swiperBtnHt) / 2});
        }
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
                        ProjectName.modal.closeModal($modal);
                    }
                },
                keydown: (e) => trapTabKey(e),
            });
            $modalCloseButton.on('click', () => ProjectName.modal.closeModal($modal));

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
                if (e.keyCode === 27) ProjectName.modal.closeModal($modal);
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
        },
        type4: function() {
            if (!fn.hasClass('#header', 'type4')) return;
            let $bgOverlay = $('.gnb_overlay_bg'),
                $gnb = $('.gnb'),
                $depth1List = $gnb.find('.depth1_list'),
                $depth1Item = $gnb.find('.depth1_item'),
                $depth1Link = $depth1Item.children('a');
                $firstItem = $gnb.find('a').first(),
                $LastItem = $gnb.find('a').last(),
                $depth2Area = $('.depth2_area'),
                $depth2List = $depth2Area.find('.depth2_list'),
                headerHt = $header.outerHeight(),
                depth2Ht = this.maxHeight($depth2List);

            this.resize('.depth2_list');

            const openMenu = () => { 
                $bgOverlay.stop().animate({ height : depth2Ht })
                $header.stop().animate({ height : headerHt + depth2Ht })
            }
            const closeMenu = () => { 
                $bgOverlay.stop().animate({ height : 0 })
                $header.stop().animate({ height : headerHt })
            }

            // open event
            $depth1List.on('mouseenter focusin', openMenu);

            // close event
            $header.on('mouseleave', closeMenu);
            $firstItem.on('keydown', (e) => { if(e.keyCode === 9 && e.shiftKey) closeMenu(); })
            $LastItem.on('focusout', closeMenu);

            // focus event
            $depth1Link.on('keydown', function (e) {
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
                
                $depth2Item.first().find('a').on('keydown', function(e) {
                    if ( e.keyCode === 9 && e.shiftKey ) {
                        e.preventDefault();
                        $('.depth1_item').eq(idx).find('.depth1_link').focus();
                    }
                })
                $depth2Item.last().find('a').on('keydown', function(e) {
                    if ( e.keyCode === 9 && idx < $depth2List.length - 1 && !e.shiftKey) {
                        e.preventDefault();
                        $('.depth1_item').eq(idx + 1).find('.depth1_link').focus();
                    }
                })
            })
        },
        maxHeight: function(obj) {
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
        }
    },
    fullpage : function() {
        if (!fn.exists('#fullpage')) return;
        $(document).ready(function() {
            $('#fullpage').fullpage({
                css3: true,
                scrollOverflow: true,
                scrollOverflowOptions: {
                    scrollbars: false,
                },
                onLeave: function(origin, destination, direction, trigger) {
                    if (destination !== 1) {
                        $header.addClass('fixed');
                    } else {
                        $header.removeClass('fixed');
                    }
                },
            });
        });
    }
}
$(() => {
    $header = $('#header');
    dentistrySNU.init();
});
