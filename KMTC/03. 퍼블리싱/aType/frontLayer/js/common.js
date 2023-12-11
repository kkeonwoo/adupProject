let $window = $(window);
let $html = $('html');
let $body = $('body');

$.namespace = function() {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = window;
        for (j = 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};

$.namespace("App");
App = {
    init : function(){
        fn.init();
        this.fullpage.init();
        App.gnb();
        App.setSwiper();
        App.sectionNetwork();
        App.sectionService();
        App.tab();

        $("#wrap").addClass("loaded");
    },
    fullpage:{
        init(){
            this.main();
        },
        main(){
            let mapPointK = $('.point.k'),
                mapPointC = $('.point.c'),
                mapPointH = $('.point.h'),
                mapPointV = $('.point.v'),
                mapPointU = $('.point.u'),
                line01 = $('.line01 .ovf'),
                line02 = $('.line02 .ovf'),
                line03 = $('.line03 .ovf'),
                tlAsia = gsap.timeline({paused:true, duration:.25}),
                tlAmerica = gsap.timeline({paused:true, duration:.25});

            $('#fullpage').fullpage({
                responsiveWidth: 1025,
                // responsiveHeight : 800,
                // navigation: true,
                // navigationPosition: 'right',
                anchors: ['sec1', 'sec2', 'sec3', 'sec4', 'section_footer'],
                // scrollOverflow: true,
                autoScrolling:true,
                keyboardScrolling: true,
                css3: true,
                'afterLoad': function (anchorLink, index) {
                    
                },
                'onLeave': function (origin, destination, direction, trigger) {
                    
                    if (destination == 1) {
                        $("#header").removeClass("fixed");
                    }else{
                        $("#header").addClass("fixed");
                    }
                    
                    if (destination == 3) {
                        tlAsia.restart();
                        $('#mapBgAmerica').hide();
                        $('#mapBgAsia').show();
                        $('#btnAsia').addClass('active');
                        $('#btnAmerica').removeClass('active');
                    }
                }
            });

            tlAsia.fromTo(mapPointK,
                    { autoAlpha: 0, scale: 0.5,  ease: `back.inOut(1.5)`},
                    { autoAlpha: 1, scale: 1,  ease: `back.inOut(1.5)`}
                )
                .to(mapPointK, {
                    y: 10,  ease: `linear`, yoyo: true, repeat: -1,
                })
                .addLabel('point')
                .fromTo(mapPointC,
                    { autoAlpha: 0, scale: 0.5,  ease: `back.inOut(1.5)`},
                    { autoAlpha: 1, scale: 1,  ease: `back.inOut(1.5)`},
                    'point'
                )
                .to(mapPointC, {
                    y: 10,  ease: `linear`, yoyo: true, repeat: -1,
                })
                .fromTo(mapPointH,
                    { autoAlpha: 0, scale: 0.5,  ease: `back.inOut(1.5)`},
                    { autoAlpha: 1, scale: 1,  ease: `back.inOut(1.5)`},
                    'point'
                )
                .to(mapPointH, {
                    y: 10,  ease: `linear`, yoyo: true, repeat: -1,
                })
                .fromTo(mapPointV,
                    { autoAlpha: 0, scale: 0.5,  ease: `back.inOut(1.5)`},
                    { autoAlpha: 1, scale: 1,  ease: `back.inOut(1.5)`},
                    'point'
                )
                .to(mapPointV, {
                    y: 10,  ease: `linear`, yoyo: true, repeat: -1,
                })
                .to(line01, {
                    width:'100%'
                }, '+=.5')
                .to(line02, {
                    height:'100%'
                }, '+=.5')
                .to(line03, {
                    width:'100%'
                }, '+=.5')

                tlAmerica.fromTo(mapPointU,
                    { autoAlpha: 0, scale: 0.5,  ease: `back.inOut(1.5)`},
                    { autoAlpha: 1, scale: 1,  ease: `back.inOut(1.5)`}
                )
                .to(mapPointU, {
                    y: 10,  ease: `linear`, yoyo: true, repeat: -1,
                })

            $('#btnAsia').on('click',function(){
                $('#mapBgAsia').show();
                $('#mapBgAmerica').hide();
                $('#btnAmerica').removeClass('active');
                $(this).addClass('active');
                tlAsia.restart();
            })
            $('#btnAmerica').on('click',function(){
                $('#mapBgAmerica').show();
                $('#mapBgAsia').hide();
                $('#btnAsia').removeClass('active');
                $(this).addClass('active');
                tlAmerica.restart();
            })
        }

    },
    gnb : function(){
        var header, mNav, btnMenu, mDepth1;

        header = $("#header");
        mNav = $("#mNav");
        mDepth1 = mNav.find("> ul > li");
        btnMenu = $(".btn_menu");
        nav = $("#nav");
        subMenu = $(".sub_menu");

        nav.on({
            mouseenter: function () {
                header.addClass('active');
                subMenu.stop().slideDown();
            },
            mouseleave: function () {
                subMenu.stop().slideUp(function(){
                    header.removeClass('active');
                });
            },
        });

        btnMenu.on("click",function(e){
            e.preventDefault();
            if($(this).hasClass("open")){
                $(this).removeClass('open').addClass('close');
                header.addClass("active");
                $('#sitemap').show();
            }else{
                $(this).removeClass('close').addClass('open');
                header.removeClass("active");
                $('#sitemap').hide();
            }
        });
    },
    setSwiper : function(){
        var settings, visualSwiper;

        settings = {
            effect:'fade',
            loop:true,
            speed:1000,
            autoplay: {
                delay: 4900,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".main_visual .swiper-button-next",
                prevEl: ".main_visual .swiper-button-prev",
            },
            pagination: {
                el: '.main_visual .swiper-pagination',
                clickable: false,
                type:"bullets",
                renderBullet: function (index, className) {
                    return '<span class="' + className + '"><em>' + (index+1) + '</em></span>';
                },
            },
            on: {
                autoplayTimeLeft(s, time, progress) {
                    $('.progress_bar').css({width:((1 - progress) * 100) + '%'})
                }
            }
        }

        visualSwiper = new Swiper('.main_visual .swiper', settings)

        $(document).on("click",".main_visual .swiper-pagination-bullet",function(e){
            e.preventDefault();
            var idx = $(this).text();
            visualSwiper.slideTo(idx);
        });
    },
    tab : function(){
        const tabGroups = document.querySelectorAll('[data-role="tab"]');
        if (tabGroups) {
          let currentTarget, targetTabWrap, targetTabListWrap, targetPanelWrap;
          // 이벤트 타겟 변수 설정
          const init = (e) => {
            currentTarget = e.target.tagName;
            currentTarget === 'BUTTON' || 'A'
              ? (currentTarget = e.target)
              : (currentTarget = e.target.closest('button') || e.target.closest('a'));
            targetTabWrap = currentTarget.closest('[data-role="tab"]');
            targetTabListWrap = targetTabWrap.querySelector('[role="tablist"]');
            targetPanelWrap = targetTabWrap.querySelector('.tab_contents');
          };
          // 클릭 이벤트
          const tabClickEvt = (e) => {
            init(e);
            if (currentTarget.ariaSelected === 'false') {
              // 미선택된 탭 속성 false 상태로 만들기
              tabRemoveEvt(targetTabListWrap, targetPanelWrap);
              // 선택 된 탭 속성 true 상태로 만들기
              tabAddEvt(currentTarget, targetTabWrap);
            }
          };
          // 키보드 접근 이벤트
          const tabKeyUpEvt = (e) => {
            init(e);
            const targetBtnWrap = currentTarget.parentElement;
            if (e.key == 'ArrowRight') {
              // 키보드 -> 화살표를 눌렀을 때
              if (targetBtnWrap.nextElementSibling) {
                targetBtnWrap.nextElementSibling.children[0].focus();
                tabRemoveEvt(targetTabListWrap, targetPanelWrap);
                tabAddEvt(targetBtnWrap.nextElementSibling.children[0], targetTabWrap);
              } else homeKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
            } else if (e.key == 'ArrowLeft') {
              // 키보드 <- 화살표를 눌렀을 때
              if (targetBtnWrap.previousElementSibling) {
                targetBtnWrap.previousElementSibling.children[0].focus();
                tabRemoveEvt(targetTabListWrap, targetPanelWrap);
                tabAddEvt(targetBtnWrap.previousElementSibling.children[0], targetTabWrap);
              } else endKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
            }
            // 키보드 End 키 눌렀을 때
            else if (e.key == 'End') endKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
            // 키보드 Home 키 눌렀을 때
            else if (e.key == 'Home')
              homeKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
          };
          // tab active event
          const tabAddEvt = (currentTarget, targetPanelWrap) => {
            // 선택 된 탭 속성 true 로 변경
            currentTarget.setAttribute('aria-selected', 'true');
            currentTarget.removeAttribute('tabindex');
            currentTarget.parentElement.classList.add('active');
            // 연결 된 tabpanel 숨김 해제
            targetPanelWrap
              .querySelector(`[aria-labelledby="${currentTarget.id}"]`)
              .removeAttribute('hidden');
            targetPanelWrap
              .querySelector(`[aria-labelledby="${currentTarget.id}"]`)
              .setAttribute('tabindex', '0');
          };
          // tab active remove event
          const tabRemoveEvt = (tabListWrap, tabPanelWrap) => {
            targetTabListWrap.querySelectorAll('li').forEach((tabBtnWrap) => {
              // 기존에 선택 된 탭 속성 false 로 변경
              if (tabBtnWrap.classList.contains('active')) {
                tabBtnWrap.classList.remove('active');
                tabBtnWrap.querySelector('[role="tab"]').setAttribute('aria-selected', 'false');
                tabBtnWrap.querySelector('[role="tab"]').setAttribute('tabindex', '-1');
              }
            });
            // 기존에 선택 된 tabpanel 숨김
            for (let tabPanel of targetPanelWrap.children) {
              tabPanel.setAttribute('hidden', 'false');
              tabPanel.setAttribute('tabindex', '-1');
            }
          };
          // 키보드 Home key Event (선택된 탭 리스트 중 첫 번째 리스트로 포커스 이동)
          const homeKeyEvt = (targetTabListWrap, targetTabWrap, targetPanelWrap) => {
            targetTabListWrap.children[0].children[0].focus();
            tabRemoveEvt(targetTabListWrap, targetPanelWrap);
            tabAddEvt(targetTabListWrap.children[0].children[0], targetTabWrap);
          };
          // 키보드 End key Event (선택된 탭 리스트 중 마지막 리스트로 포커스 이동)
          const endKeyEvt = (targetTabListWrap, targetTabWrap, targetPanelWrap) => {
            const targetTabLists = targetTabListWrap.querySelectorAll('li');
            targetTabLists[targetTabLists.length - 1].children[0].focus();
            tabRemoveEvt(targetTabListWrap, targetPanelWrap);
            tabAddEvt(targetTabLists[targetTabLists.length - 1].children[0], targetTabWrap);
          };
          // 클릭/키보드 탭 이벤트 제거/할당
          tabGroups.forEach((tabWrapper) => {
            const tabBtns = tabWrapper.querySelectorAll('[role="tab"]');
            tabBtns.forEach((tabBtn) => {
              tabBtn.removeEventListener('click', tabClickEvt);
              tabBtn.addEventListener('click', tabClickEvt);
              tabBtn.removeEventListener('keyup', tabKeyUpEvt);
              tabBtn.addEventListener('keyup', tabKeyUpEvt);
            });
          });
        }
    },
    sectionNetwork : function(){
        $('.line').each(function(index, item){
            $(this).find('svg').css({
                width: $(this).outerWidth(true),
                height: $(this).outerHeight(true)
            });
            if($(item).hasClass('line02')){
                $(this).find('.ovf').css({
                    width: $(this).outerHeight(true)
                })
            }else{
                $(this).find('.ovf').css({
                    height: $(this).outerHeight(true)
                })
            }
        });
        
        $(window).on('resize',function(){
            $('.line').each(function(index, item){
                $(this).find('svg').css({
                    width: $(this).outerWidth(true),
                    height: $(this).outerHeight(true)
                });
                $(this).find('.ovf').css({
                    height: $(this).outerHeight(true) 
                })
            });
        });
    },
    sectionService : function(){
        const accordionItem = $(".accordion_item");

        accordionItem.on("click",function(){
            accordionItem.not($(this)).removeClass("active");
            $(this).addClass("active");
        });

        var serviceSettings, serviceSwiper;
        
        serviceSettings = {
            loop:true,
            speed:1000,
            // centeredSlides: true,
            spaceBetween: 8,
            slidesPerView:'auto',
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        }

        serviceSwiper = new Swiper('#serviceMb .swiper', serviceSettings)
    },
}

$(function(){ 
    App.init();
});