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
    },
    gnb : function() {
        const $gnb = $('#gnb'),
        $depth01Item = $gnb.find('.depth1_item'),
        $sections = $('.sec'),
        $gnbBtn = $('.nav_open'),
        $header = $('#header');

        $depth01Item.on('click', function() {
            let depth1Text = $(this).text();
            
            if (depth1Text === 'works') BlueOrange.goToSection($sections[3]);
            if ($header.hasClass('mob_open')) closeMobGnb();
        });

        $gnbBtn.on('click', () => $header.hasClass('mob_open') ? closeMobGnb() : openMobGnb())

        function openMobGnb () {
            const $footerRight = $('.footer_right');

            fn.addHidden();
            $header.addClass('mob_open');
            $gnb.append("<div class='clone_footer'></div>");
            $footerRight.clone().appendTo('.clone_footer');
        }

        function closeMobGnb () {
            fn.removeHidden();
            $header.removeClass('mob_open');
            $('.clone_footer').remove();
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
    },
    openModal : function(
        $modal, 
        focusableElementsString = '.modal_centered, a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]', 
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
        firstRun: true,
        enabled: true,
        events: "click,scroll,wheel,touchmove,pointermove".split(","),
        prevent: e => e.preventDefault(),
        disable() {
            if (BlueOrange.scrolling.enabled) {
                BlueOrange.scrolling.enabled = false;
                window.addEventListener("scroll", gsap.ticker.tick, {passive: true});
                BlueOrange.scrolling.events.forEach((e, idx) => (idx ? document : window).addEventListener(e, BlueOrange.scrolling.prevent, {passive: false}));
            }
        },
        enable() {
            if (!BlueOrange.scrolling.enabled) {
                BlueOrange.scrolling.enabled = true;
                window.removeEventListener("scroll", gsap.ticker.tick);
                BlueOrange.scrolling.events.forEach((e, idx) => (idx ? document : window).removeEventListener(e, BlueOrange.scrolling.prevent));
            }
        },
        onFirstRun() {
            ScrollTrigger.removeEventListener("refresh", BlueOrange.scrolling.onFirstRun);
            BlueOrange.scrolling.firstRun = false;
        }
    },
    goToSection : function(section) {
        if (BlueOrange.scrolling.enabled) {
            BlueOrange.scrolling.disable();
            gsap.to(window, {
                scrollTo: {y: section, autoKill: false},
                onComplete: BlueOrange.scrolling.enable,
                duration: !fn.exists('.people') ? 1 : 0.5,
            });
        }
    },
    moveSection : function() {
        if(fn.exists('.people')) return;

        const panels = document.querySelectorAll(".motion_panel");

        panels.forEach((panel) => {

            ScrollTrigger.create({
                trigger: panel,
                start: "top bottom-=1",
                end: "bottom top+=1",
                onEnter: (e) => {
                    if (!BlueOrange.scrolling.firstRun) {
                        BlueOrange.goToSection(panel);
                    }
                },
                onEnterBack: () => BlueOrange.goToSection(panel),
                onUpdate: () => fn.isScrollTop(),
            });
        });
        
        ScrollTrigger.addEventListener("refresh", BlueOrange.scrolling.onFirstRun);
    },
    goToTop : function() {
        $('.float_area .btn').on('click', function() {
            BlueOrange.goToSection(0);
        } );
    },
}
$(function () {
    BlueOrange.init();
});
