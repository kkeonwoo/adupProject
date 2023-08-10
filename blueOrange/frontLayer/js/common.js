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
        // BlueOrange.gnb();
        // BlueOrange.tab();
        // BlueOrange.select();
        // BlueOrange.modal();
        // BlueOrange.setSwiper();
        // BlueOrange.moveSection();
        BlueOrange.moveHorizon();
        // BlueOrange.goToTop();
        // BlueOrange.handleScrollX();
        // BlueOrange.resize();
    },
    gnb : function() {
        const $gnb = $('#gnb'),
        $depth01Item = $gnb.find('.depth1_item'),
        $sections = $('.sec');

        $depth01Item.on('click', function() {
            let depth1Text = $(this).text();
            
            if (depth1Text === 'works') BlueOrange.goToSection($sections[3]);
        });
    },
    tab : function(){
        // 탭 컨텐츠 숨기기
        $('.works_content').hide();

        $('.works_list li').data('idx');
        $('.works_list li').each((idx, item) => {
            $(item).attr('idx', `work_${idx}`);
            $(item).closest('.works_container').find('.works_content').eq(idx).attr('id', `work_${idx}`)
        })

        //탭메뉴 클릭 이벤트
        let inProgress = false;
        $('.works_list li').click(function(e) {
            e.preventDefault();

            var activeTab = $(this).attr('idx');
            if(!inProgress) {
                inProgress = true;
                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
                $(this).closest('.works_container').find('.works_content').hide();
                $('#' + activeTab).show();
                BlueOrange.goToSection($('#' + activeTab));
                inProgress = false;
            }
        });
    },
    select : function(){
        let $formSelect;

        function optionAreaSize() {
            let selectTop = $($formSelect).offset().top;
            let selectLeft = $($formSelect).offset().left;
            let selectW = $($formSelect).outerWidth();
            let selectH = $($formSelect).outerHeight();
            $('.option_area').css({'top':selectTop+ selectH, 'left': selectLeft, 'width': selectW});
        }
        
        $(document).on('click','.form_select .form_btn', function(e) {
            $formSelect = e.currentTarget.parentNode;
            const arr = $formSelect.dataset.items.split(', ');
            $formSelect.selectArr = arr;
            
            let active = false;
            $('.option_area').remove();
            if($(this).parents('.form_select').hasClass('active')){
                active = true;
            } else {
                $('body').append(`
                    <div class="option_area" tabIndex='0'>
                        <ul class="option_list"></ul>
                    </div>
                `);
                $formSelect.selectArr.forEach((val, idx)=>{
                    $('.option_list').append(`
                        <li class="option_item">
                            <button class="option_btn" type="button">${val}</button>
                        </li>
                    `);
                });
                if($formSelect.dataset.index !== undefined) {
                    $formSelect.selectIdx = $formSelect.dataset.index;
                    $formSelect.dataset.index !== '' && $('.option_item').eq($formSelect.selectIdx).addClass('active');
                }
            }
            optionAreaSize();

            $('.form_select.active').removeClass('active');
            if(!active){
                $(this).parents('.form_select').toggleClass('active');
            } 
            
        });
        $('html').click(function (e) {
            if ($(e.target).parents('.option_area').length < 1 && $(e.target).parents('.form_select').length < 1) {
                $('.option_area').remove();
                $($formSelect).removeClass('active');
            }
        });
        $(document).on('click','.option_btn', function() {
            $formSelect.selectIdx = $(this).closest('.option_item').index();
            $formSelect.dataset.index = $(this).closest('.option_item').index();
            let textData = $formSelect.selectArr[$formSelect.selectIdx];
            $($formSelect).find('.option_item').removeClass('active');
            $(this).closest('.option_item').addClass('active');
            $($formSelect).find('.form_btn').text(textData).addClass('active');
            $($formSelect).removeClass('active');
            $('.option_area').remove();
        });
        $(document).on('keydown','.form_btn', function(e) {
            $formSelect = e.currentTarget.parentNode;
            const arr = $formSelect.dataset.items.split(', ');
            $formSelect.selectArr = arr;
            if($formSelect.dataset.index == undefined) {
                $formSelect.selectIdx = -1;
            }
            if(e.keyCode == 9 || e.keyCode == 27){
                $('.option_area').remove();
                $($formSelect).removeClass('active');
            }

            if(e.keyCode == 37 || e.keyCode == 38){
                e.preventDefault();
                if (0 < $formSelect.selectIdx){
                    $formSelect.selectIdx = $formSelect.selectIdx - 1;
                    $formSelect.dataset.index = $formSelect.selectIdx ;
                    $('.option_list').find('.option_item').removeClass('active');
                    $('.option_list').find('.option_item').eq($formSelect.selectIdx).addClass('active');
                    let textData = $formSelect.selectArr[$formSelect.selectIdx];
                    $(this).text(textData).addClass('active');
                    if ($($formSelect).hasClass('active')){
                        $('.option_area').animate({
                            scrollTop: $('.option_item').eq($formSelect.selectIdx).position().top
                        }, 0);
                    }
                }
            }

            if(e.keyCode == 39 || e.keyCode == 40){
                e.preventDefault();
                let max = e.currentTarget.parentNode.selectArr.length;
                if (max - 1 !== $formSelect.selectIdx){
                    $formSelect.selectIdx = $formSelect.selectIdx + 1;
                    $formSelect.dataset.index = $formSelect.selectIdx;
                    $('.option_list').find('.option_item').removeClass('active');
                    $('.option_list').find('.option_item').eq($formSelect.selectIdx).addClass('active');
                    
                    let textData = $formSelect.selectArr[$formSelect.selectIdx];
                    $(this).text(textData).addClass('active');
                    if ($($formSelect).hasClass('active')){
                        $('.option_area').animate({
                            scrollTop: $('.option_item').eq($formSelect.selectIdx).position().top
                        }, 0);
                    }
                }
            }
        });
        $(window).resize(function(){
            $('.form_select').hasClass('active') && optionAreaSize();
        });
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
    setSwiper : function(){
        $(".set_swiper").each(function(index, element){
            var tg = $(this);
                slideView = [5,4],
                slideTabletView = [4,3],
                slideMobileView = [1,1];
            tg.addClass('instance_' + index);

            var swiper = new Swiper('.instance_' + index + ' .swiper', {
                loop:true,
                slidesPerView: slideMobileView[index],
                speed:1000,
                autoplay: {
                    delay: 3500,
                },
                navigation: {
                    prevEl: "".concat(".instance_" + index + " .swiper-button-prev"),
                    nextEl: "".concat(".instance_" + index + " .swiper-button-next"),
                },
                breakpoints: {
                    769: {
                        slidesPerView: slideTabletView[index],
                    },
                    1200: {
                        slidesPerView: slideView[index],
                    },
                },
            });
        });
    },
    scrolling : {
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
        }
    },
    goToSection : function(section) {
        console.log(section);
        console.log(BlueOrange.scrolling.enabled);
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
                // markers: true,
                onEnter: () => BlueOrange.goToSection(panel),
                onEnterBack: () => BlueOrange.goToSection(panel),
                onUpdate: () => fn.isScrollTop(),
            });
        });
    },
    moveHorizon : function () {
        if(!fn.exists('.people')) return;

        gsap.registerPlugin(ScrollTrigger);
            
            let pinBoxes = document.querySelectorAll(".img_item");
            let pinWrap = document.querySelector(".img_list");
            let pinWrapWidth = pinWrap.offsetWidth;
            let horizontalScrollLength = pinWrapWidth - pinBoxes[0].offsetWidth;

            gsap.to(".img_list", {
                scrollTrigger: {
                    scrub: true,
                    trigger: ".gsap_area",
                    pin: true,
                    start: "top top",
                    markers: true,
                    end: pinWrapWidth,
                    onUpdate(){
                        moveVer();
                    }
                },
                x: -horizontalScrollLength,
                ease: "none"
            });

            function moveVer(){
                const wdwHghHalf = $(window).outerWidth()/2;
                const boxHghHalf = $(pinBoxes[0]).outerWidth()/2;
                const half = wdwHghHalf - boxHghHalf;
                pinBoxes.forEach((t,i)=>{
                    let y;
                    y = Math.abs($(t).offset().left - half) / 10;
                    $(t).css({'transform':`translateY(${y}px)`});
                })
            }
        
        $('.main_visual .btn_round').on('click', function(e) {
            let $target = $(e.target);
            let scrollTop = window.scrollY;
            let motionLength = (scrollXLength + center) / pinBoxesLength;
            // let motionLength = (pinBoxWidth + 30);
            let posY = $target.hasClass('btn_next') ? scrollTop + motionLength : scrollTop - motionLength;

            if ($target.hasClass('btn_prev') && scrollTop >= 0) {
                BlueOrange.goToSection(posY);
                return;
            } else if ($target.hasClass('btn_next') && scrollTop < scrollXLength) {
                BlueOrange.goToSection(posY);
                return;
            }
        })
    },
    goToTop : function() {
        $('.float_area .btn').on('click', function() {
            BlueOrange.goToSection(0);
        } );
    },
    handleScrollX : function () {
        let imgBoxWidth = $('#section01 .img').outerWidth(),
            windowWidth = $(window).outerWidth();

        $('#section01 .img_box').scrollLeft(imgBoxWidth - windowWidth);
    },
    resize : function () {
        $(window).resize(() => BlueOrange.handleScrollX());
    }
}
$(function () {
    BlueOrange.init();
});
