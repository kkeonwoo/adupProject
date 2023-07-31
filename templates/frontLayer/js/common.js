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
ProjectName = {
    init : function(){
        ProjectName.tab();
        ProjectName.select();
        ProjectName.modal();
        ProjectName.setSwiper();
        ProjectName.datepicker();
    },
    tab : function(){
        // 탭 컨텐츠 숨기기
        $('.tab_content').hide();

        // 첫번째 탭콘텐츠 보이기
        $('.tab_container').each(function () {
            $(this).children('.tabs li:first').addClass('active'); //Activate first tab
            $(this).children('.tab_content').first().show();
        });
        
        //탭메뉴 클릭 이벤트
        let inProgress = false;
        $('.tabs li button').click(function(e) {
            e.preventDefault();

            var activeTab = $(this).attr('rel');
            if(!inProgress) {
                inProgress = true;
                $(this).parent().siblings('li').removeClass('active');
                $(this).parent().addClass('active');
                $(this).closest('.tab_container').find('.tab_content').hide();
                $('#' + activeTab).fadeIn(() => inProgress = false);
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
                ProjectName.closeModal($modal);
            }
        });

        $modalCloseButton.on('click',function(){
            ProjectName.closeModal($modal);
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
                ProjectName.closeModal($modal);
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
            });
        }
    },
}
$(function () {
    ProjectName.init();
});
