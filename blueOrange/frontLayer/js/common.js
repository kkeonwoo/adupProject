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
    windowWidth: $(window).width(),
    init : function(){
        BlueOrange.gnb();
        BlueOrange.modal();
        BlueOrange.moveSection();
        BlueOrange.goToTop();
        BlueOrange.aniHistory();
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
            $gnb.append("<div class='clone_footer'></div>");
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
        events: "click,scroll,wheel,touchmove,pointermove".split(","),
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
                onComplete: BlueOrange.scrolling.enable,
                duration: 1,
            });
        }
    },
    moveSection : function() {
        fn.chkDevice();

        gsap.registerPlugin(ScrollTrigger);
        
        const panels = document.querySelectorAll(".motion_panel");

        ScrollTrigger.batch(panels,{
            trigger: panels,
            start: "top bottom-=1",
            end: "bottom top+=1",
            onEnter: (batch) => {
                if ($(batch).attr('id') == "motion02") {
                    BlueOrange.goToSection(batch);
                }
            },
            onEnterBack: (batch) => BlueOrange.goToSection(batch),
            onLeave: () => ScrollTrigger.normalizeScroll(false),
            onUpdate: () => fn.isScrollTop(),
        });

        fnNormlizeScr();
        $(window).scroll(() => {
            fnNormlizeScr();
        });

        function fnNormlizeScr() {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            if (scrollPosition <= 0) {
                ScrollTrigger.normalizeScroll(true);
            }
        }
    },
    goToTop : function() {
        $('.float_area .btn').on('click', function() {
            BlueOrange.goToSection(0);
        } );
    },
    aniHistory: function() {
        let prot = true;
        $(window).on('scroll', function() {
            let st = $(this).scrollTop();
            if ( st >= $('.motion_panel').eq(1).offset().top && prot) {
                init();
                prot = false;
            }
        })

        function init() {
            const path = document.getElementById('path');
            const offset = path.getTotalLength();
            gsap.to('.history_box', { autoAlpha: 1})
    
            const tl = gsap.timeline({
                defaults: {
                    duration: 4,
                    ease:'linear',
                }
            });
    
            tl
            .fromTo(path, 
                { strokeDashoffset: offset},
                { strokeDashoffset: 0}
            )
            // .from('#commerce', { opacity: 0, y: 100, duration: 1 }, '<')
            .to('#bg_overlay', { 
                x: 100,
                motionPath:{
                    path: path,
                    align: path,
                    alignOrigin: [0.2, 0.5]
                }
            }, '<')
            
            const itemTexts = document.querySelectorAll('#history .text');
            const itemDots = document.querySelectorAll('#history .dot');
            const arr = [0.115,0.22,0.27,0.317,0.38,0.52,0.605,0.705,0.8]
            const arrProt = [];
            arr.forEach(t=>arrProt.push(true));

            gsap.set('#section01 .history_cnt', { overflow: 'hidden'});
            gsap.set([itemTexts,itemDots], { scale: 0, transformOrigin: '50% 50%'})
            tl.eventCallback('onUpdate', function() {
                arr.forEach((item,idx) => {
                    if(tl.progress() + 0.05 > arr[idx] && arrProt[idx] === true){
                        arrProt[idx] = false;
                        gsap.to([itemTexts[idx],], { scale: 1, duration: 0.5, ease:'back.out(1.4)'})
                        gsap.to(itemDots[idx], { scale: 1, duration: 0.5, ease:'back.out(1.4)'})
                    }
                })
                handleScrollX();
            })
    
            let wW = $(window).outerWidth();
            let imgWidth = $('.history_box svg').outerWidth();
            let posX = imgWidth - wW;
            let thumbWidth = (wW / imgWidth * 100);
            let track = $('.scrollbar_horizontal');
            let thumb = track.find('.thumb');
    
            function handleScrollX() {
                gsap.set('#section01 .history_box', {
                    x: -(posX * tl.progress().toFixed(2)),
                })
            }
    
            if( wW < 1903 ) {
                tl.eventCallback('onComplete', function() {
                    gsap.set('#section01 .history_box', { overflowX: 'auto', overflowY: 'hidden'})
                    gsap.set('#section01 .history_box', { x: 0})
                    $('#section01 .history_box').scrollLeft(posX);
                    $('.ios_device .scrollbar_horizontal').show();
                    $('.ios_device .scrollbar_horizontal .thumb').show();
                })
            }
    
            $(window).on('resize', function() {
                wW = $(window).outerWidth();
                thumbWidth = (wW / imgWidth * 100);
                if ($('body').hasClass('ios_device')) iosScrollX(wW, thumbWidth);
                if ( wW < 1903 ) {
                    $('#section01 .history_box').css({ overflowX: 'auto', overflowY: 'hidden'})
                } else {
                    $('#section01 .history_box').css({ overflow: 'hidden'})
                }
            })
            
            function iosScrollX(wW, thumbWidth) {
                thumb.css({ width: `${thumbWidth}%`, left: (imgWidth - wW) / wW})
                thumb.draggable({
                    containment: track,
                    "axis": 'x',
                    drag: function(e) {
                        $('#section01 .history_box').off('scroll');
                        $('#section01 .history_box').scrollLeft(thumb.position().left);
                    },
                    stop: function() {
                        boxScroll();
                    }
                });
                
                function boxScroll() {
                    $('#section01 .history_box').on('scroll', function(e) {
                        let posX = ($(this).scrollLeft() * (wW / imgWidth));
        
                        thumb.css({ left: posX })
                    })
                }
                boxScroll();
            }
            if ($('body').hasClass('ios_device')) iosScrollX(wW, thumbWidth);
        }
    }
}
$(function () {
    BlueOrange.init();
});
