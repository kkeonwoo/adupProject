(function($){
    jQuery.prototype.extend({
        switchMethod: function(){
            $('.switch li').on('click',function(e){
                e.preventDefault();

                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
            });
        },
        toggleMethod: function(){
            $(document).on('click','.toggle',function(event){
                event.preventDefault();
                
                $(this).toggleClass('active');
            });
        }
    });
})(jQuery);

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

$.namespace('ProjectName');
BlueOrange = {
    init : function(){
        BlueOrange.gnb();
        BlueOrange.modal();
        BlueOrange.moveSection();
        // BlueOrange.moveSection02();
        BlueOrange.goToTop();
        BlueOrange.aniHistory();
        if ( $('body').hasClass('kakao') ) BlueOrange.handleUnit();
    },
    gnb : function() {
        const $gnb = $('#gnb'),
        $depth01Item = $gnb.find('.depth1_item'),
        $sections = $('.sec'),
        $gnbBtn = $('.nav_open'),
        $header = $('#header');

        $depth01Item.on('click', function() {
            let depth1Text = $(this).text();
            
            if (fn.exists('.about') && depth1Text === 'works') BlueOrange.goToSection($sections[3]);
            if ($header.hasClass('mob_open')) closeMobGnb();
        });

        $gnbBtn.on('click', () => $header.hasClass('mob_open') ? closeMobGnb() : openMobGnb())

        function openMobGnb () {
            const $footerRight = $('.footer_right');

            fn.addHidden();
            $header.addClass('mob_open');
            $gnb.append("<div class='clone_footer mob'></div>");
            $footerRight.clone().appendTo('.clone_footer');

            const $depth1Link = $('#gnb').find('.depth1_link');
            const $gnbBtnPrimary = $('#gnb').find('.btn_primary');
            const $footerLink = $('#gnb').find('.footer_link');
            
            focusEl($gnbBtn, $depth1Link.first());
            focusEl($depth1Link.last(), $footerLink.first());
            focusEl($footerLink.last(), $gnbBtnPrimary);
            focusEl($gnbBtnPrimary, $gnbBtn);
        }

        function closeMobGnb () {
            fn.removeHidden();
            $header.removeClass('mob_open');
            $('.clone_footer').remove();
        }

        function focusEl (t, f) {
            t.on('blur', function() {
                f.focus();
            });
        }
    },
    modal : function(){
        var $modal, $modalButton;
        $modalButton = $('.modal_toggle');
        $modalButton.on('click',function(){
            $modal = $($(this).data('target'));
            ProjectName.openModal($modal);
        });
    },
    closeModal : function(
        $modal, 
        focusedElementBeforeModal = document.activeElement
    ){
        fn.removeHidden();
        $('.modal').off('scroll',function(){});
        $('html, body').removeClass('hidden');
        $modal.addClass('modal_close');
        $modal.removeClass('active');
        focusedElementBeforeModal.focus();
        $('.modal .img_box .img').attr('src', '');
        $('.modal .img_box .img').attr('alt', '');
    },
    openModal : function(
        $modal, 
        focusableElementsString = '.modal_centered, a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], button', 
        $modalCloseButton = $('.modal .close')
    ){
        fn.addHidden();
        $modal.addClass('active');
        $('.modal').on('scroll',function(){
            if ($('.form_select').hasClass('active')){
                let $formSelect = $('.form_select.active');
                let selectTop = $($formSelect).offset().top;
                let selectLeft = $($formSelect).offset().left;
                let selectW = $($formSelect).outerWidth();
                let selectH = $($formSelect).outerHeight();
                $('.option_area').css({
                    'top': selectTop + selectH, 
                    'left': selectLeft, 
                    'width': selectW
                });
            }
        })

        $modal.on('keydown',function(e){
            trapTabKey(e);
        });

        $modal.on('click',function(e){
            if ($(e.target).closest('.modal_box').length < 1 && $('.modal.active').attr('data-dim-click') !== 'false') {
                BlueOrange.closeModal($modal);
            }
        });

        $modalCloseButton.on('click',function(){
            BlueOrange.closeModal($modal);
        })

        var focusableElements = $modal.find(focusableElementsString),
            focusableElements = Array.prototype.slice.call(focusableElements),
            firstTabStop = focusableElements[0],
            lastTabStop = focusableElements[focusableElements.length - 1];

        $($modal).removeClass('modal_close');
        firstTabStop.focus();

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
                BlueOrange.closeModal($modal);
            }
        }
    },
    scrolling : {
        enabled: true,
        prevent: e => e.preventDefault(),
        disable() { if (BlueOrange.scrolling.enabled) BlueOrange.scrolling.enabled = false; },
        enable() { if (!BlueOrange.scrolling.enabled) BlueOrange.scrolling.enabled = true; },
    },
    goToSection : function(section) {
        if (BlueOrange.scrolling.enabled) {
            BlueOrange.scrolling.disable();
            gsap.to(window, {
                scrollTo: {y: section, autoKill: false},
                overwrite: "auto",
                onComplete() {
                    BlueOrange.scrolling.enable();
                },
                duration: 1,
            });
        }
    },
    moveSection : function() {
        fn.chkDevice();

        gsap.registerPlugin(ScrollTrigger);
        
        const panels = document.querySelectorAll(".motion_panel");
        let prot = true;
        let newProt = false;

        ScrollTrigger.batch(panels,{
            trigger: panels,
            start: "top bottom-=1",
            end: "bottom top+=1",
            onEnter: (batch) => {
                if ($(batch).attr('id') == "motion02") {
                    if ( $('body').hasClass('kakao') ) return;
                    BlueOrange.goToSection(batch);
                }
            },
            onEnterBack: (batch) => {
                if ( $('body').hasClass('kakao') ) {
                    if(!prot) return;
                    prot = false;
                    newProt = true;
                    gsap.to(window, {duration:1, scrollTo: $('#motion01').offset().top, overwrite: "auto", onComplete: () => {prot = true; newProt = false; $('body').removeClass('hidden');}})
                } else {
                    BlueOrange.goToSection(batch);
                }
            },
            onUpdate: () => {
                fn.isScrollTop();
            },
        });

        if (!fn.exists('.about')) return;
        
        if (navigator.userAgent.indexOf("KAKAO") > -1) {
            $('body').addClass('kakao');
        }

        fnNormlizeScr();
        function fnNormlizeScr() {
            if ( $('html, body').hasClass('scroll_down') ) {
                ScrollTrigger.normalizeScroll(false);
            } else {
                if ( $('body').hasClass('kakao') ) {
                    ScrollTrigger.normalizeScroll(false);
                } else {
                    ScrollTrigger.normalizeScroll(true);
                }
            }
        }

        if ( !$('body').hasClass('kakao')) return;
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 0 && $(window).scrollTop() < $(window).outerHeight() / 2 && !newProt && prot) {
                $('body').addClass('hidden');
                prot = false;
                newProt = true;
                gsap.to(window, {duration:1, scrollTo: $('#motion02').offset().top, overwrite: "auto", onComplete: () => {prot = true; newProt = false; $('body').removeClass('hidden');}})
            }
        })
    },
    moveSection02 : function() {
        const wheel = {
            stop() {
                let scroller = document.scrollingElement,
                    overflow = scroller.style.overflowY;
                scroller.style.overflowY = 'hidden';
                if ($('body').hasClass('pc_device')) scroller.style.paddingRight = '16px';
                setTimeout(() => {
                    overflow ? (scroller.style.overflowY = overflow) : scroller.style.removeProperty('overflow-y')
                    if ($('body').hasClass('pc_device')) scroller.style.paddingRight = 0;
                }, 1);

                window.addEventListener('wheel', wheel._prevent, {
                    passive: false,
                    capture: true,
                });
            },
            start() {
                window.removeEventListener('wheel', wheel._prevent, true);
            },
            _prevent: (e) => e.preventDefault(),
        };

        fn.chkDevice();

        gsap.registerPlugin(ScrollTrigger);
        
        const panels = document.querySelectorAll(".motion_panel");
        let prot = true;
        let newProt = false;
        
        if (!fn.exists('.about')) return;
        
        if (navigator.userAgent.indexOf("KAKAO") > -1) {
            $('body').addClass('kakao');
        }

        if ( $('body').hasClass('kakao') ) {
            ScrollTrigger.normalizeScroll(false);
        } else {
            ScrollTrigger.normalizeScroll(true);
        }

        ScrollTrigger.batch(panels,{
            trigger: panels,
            start: "top bottom-=1",
            end: "bottom top+=1",
            onEnter: (batch) => {
                if ($(batch).attr('id') == "motion02") {
                    setTimeout(() => {
                        if ( $('body').hasClass('kakao') ) return;
                        if(!prot) return;
                        prot = false;
                        newProt = true;
                        ScrollTrigger.normalizeScroll(false);
                        wheel.stop();
                        gsap.to(window, {duration:1, scrollTo: $('#motion02').offset().top, overwrite: "auto", onComplete: () => {prot = true;newProt = false;wheel.start();}})
                    }, 0);
                }
            },
            onEnterBack: () => {
                setTimeout(() => {
                    if(!prot) return;
                    prot = false;
                    newProt = true;
                    wheel.stop();
                    ScrollTrigger.normalizeScroll(true);
                    gsap.to(window, {duration:1, scrollTo: 0, overwrite: "auto", onComplete: () => {prot = true; newProt = false;wheel.start();}})
                }, 0);
            },
            onUpdate: () => {
                fn.isScrollTop();
            },
        });

        if ( !$('body').hasClass('kakao')) return;
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 0 && $(window).scrollTop() < $(window).outerHeight() / 2 && !newProt && prot) {
                $('body').addClass('hidden');
                prot = false;
                newProt = true;
                gsap.to(window, {duration:1, scrollTo: $('#motion02').offset().top, overwrite: "auto", onComplete: () => {prot = true; newProt = false; $('body').removeClass('hidden');}})
            }
        })
    },
    goToTop : function() {
        $('.float_area .btn').on('click', function() {
            BlueOrange.goToSection(0);
        } );
    },
    aniHistory: function() {
        if (!fn.exists('.about')) return;

        let prot = true;

        $(window).on('scroll', function() {
            let st = $('body').hasClass('kakao') ? $(this).scrollTop() + 100  : $(this).scrollTop();
            if ( st >= $('.motion_panel').eq(1).offset().top && prot) {
                prot = false;
                init();
            }
        })
        
        function init() {
            const path = document.getElementById('path'),
            offset = path.getTotalLength();

            gsap.to('.history_box', { autoAlpha: 1})

            const tl = gsap.timeline({defaults: {duration: 4,ease:'linear'}});
    
            tl
            .fromTo(path, 
                { strokeDashoffset: offset},
                { strokeDashoffset: 0}
            )
            .from('#commerce', { opacity: 0, y: 100, duration: 1 }, '<')
            .to('#bg_overlay', { 
                x: 100,
                motionPath:{
                    path: path,
                    align: path,
                    alignOrigin: [0.2, 0.5]
                }
            }, '<')
            
            const itemTexts = document.querySelectorAll('#history .text'),
            itemDots = document.querySelectorAll('#history .dot'),
            arr = [0.115,0.22,0.27,0.317,0.38,0.52,0.605,0.705,0.8],
            arrProt = [];
            
            arr.forEach(t=>arrProt.push(true));
            gsap.set([itemTexts,itemDots], { scale: 0, transformOrigin: '50% 50%'})
            tl.eventCallback('onUpdate', function() {
                arr.forEach((item,idx) => {
                    if(tl.progress() + 0.05 > arr[idx] && arrProt[idx] === true){
                        arrProt[idx] = false;
                        gsap.to(itemTexts[idx], { scale: 1, duration: 0.5, ease:'back.out(1.4)'})
                        gsap.to(itemDots[idx], { scale: 1, duration: 0.5, ease:'back.out(1.4)'})
                    }
                })
            })
    
            let wW = $(window).outerWidth(),
                imgWidth = $('.history_box svg').outerWidth(),
                posX = imgWidth - wW,
                thumbWidth = (wW / imgWidth * 100);
                track = $('.scrollbar_horizontal'),
                thumb = track.find('.thumb');
    
            function handleScrollX() {
                if ( wW < 1903 ) {
                    gsap.to('#section01 .history_box', {
                        x: -posX,
                        duration: 4,
                        ease: CustomEase.create("custom", "M0,0,C0.504,0.078,0.63,0.798,1,1"),
                        onComplete() {
                            $('#section01 .history_cnt').addClass('scroll_x');
                            gsap.set('#section01 .history_box', { x: 0 })
                            $('#section01 .history_cnt').scrollLeft(posX);
                            $('.ios_device .scrollbar_horizontal').show();
                            $('.ios_device .scrollbar_horizontal .thumb').show();
                        }
                    })
                }
            }
            handleScrollX();
    
            $(window).on('resize', function() {
                wW = $(window).outerWidth();
                thumbWidth = (wW / imgWidth * 100);
                posX = imgWidth - wW;
                if ($('body').hasClass('ios_device')) iosScrollX(wW, thumbWidth, posX);
                if ( wW < 1903 ) {
                    $('#section01 .history_cnt').addClass('scroll_x');
                } else {
                    $('#section01 .history_cnt').removeClass('scroll_x');
                }
            })

            function iosScrollX(wW, thumbWidth, posX) {
                thumb.css({ width: `${thumbWidth}%`})

                Draggable.create(thumb, {
                    type: "x",
                    bounds: track,
                    inertia: true,
                    onDrag() {
                        let progress = gsap.utils.normalize(this.minX, this.maxX, this.x);
                        
                        $('#section01 .history_cnt').scrollLeft((posX - thumbWidth) * progress);
                    },
                })[0];

                $('#section01 .history_cnt').on('scroll', function() {
                    gsap.set(thumb, {x: $(this).scrollLeft() * (wW / imgWidth), overwrite: 'auto'});
                })
            }
            if ($('body').hasClass('ios_device')) iosScrollX(wW, thumbWidth, posX);
        }
    },
    handleUnit: function() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
}
$(document).ready(function() {
    BlueOrange.init();
})
