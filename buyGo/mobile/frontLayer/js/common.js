(function ($) {
    jQuery.prototype.extend({
        switchMethod: function () {
            $('.switch li').on('click', function (e) {
                e.preventDefault();

                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
            });
        },
        toggleMethod: function () {
            $(document).on('click', '.toggle', function (event) {
                event.preventDefault();

                $(this).toggleClass('active');
            });
        }
    });
})(jQuery);

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

$.namespace('BuyGo');
BuyGo = {
    init: function () {
        this.tab();
        this.tab2();
        this.select();
        this.select2();
        this.select3();
        this.modal();
        this.setSwiper();
        this.datepicker();
        this.nav();
        this.button();
        this.scrollTop();
        this.resize();
        this.fileUpload();

        //visual 닫기
        if(!$('#container').find('.prot_area').length){
            $('.visual').removeClass('active');
        }
    },
    tab: function () {
        // 탭 컨텐츠 숨기기
        $('.tab_content').hide();

        // 첫번째 탭콘텐츠 보이기
        $('.tab_container').each(function () {
            $(this).find('.tabs li:first').addClass('active'); //Activate first tab
            $(this).children('.tab_content').first().show();
        });
        //탭메뉴 클릭 이벤트
        $('.tabs li button').click(function (e) {
            e.preventDefault();

            var activeTab = $(this).attr('rel');
            $(this).parent().siblings('li').removeClass('active');
            $(this).parent().addClass('active');
            $(this).closest('.tab_container').find('.tab_content').hide();
            $('#' + activeTab).fadeIn();
        });

    },
    tab2: function () {
        $('.initial_btn').on('click', (e) => {
            e.preventDefault();
    
            let clickedValue = $(e.target).text();
            let matchContent = $('.brand_list .initial_ttl:contains("' + clickedValue + '")')
            $('.brand_list').hide();
            matchContent.parent().show().addClass('active').siblings().removeClass('active');
        })
    },
    select : function(){
        let $formSelect;
        let $formSelectPrev;
        let selectPrevProt = true;
        let $selectComplete;

        function optionAreaSize() {
            let selectTop = $($formSelect).offset().top;
            let selectLeft = $($formSelect).offset().left;
            let selectW = $($formSelect).outerWidth();
            let selectH = $($formSelect).outerHeight();
            $('.fixed_area').css({'top': selectTop + selectH, 'left': selectLeft, 'width': selectW});
            $('.fixed_area .dim').css({'height': selectH});
        }
        $('html').click(function (e) {
            if($(e.target).closest('.form_select').length < 1 && $(e.target).closest('.option_area').find('input[type="checkbox"]').length < 1){
                selectComplete($selectComplete);
                $('.form_select').attr('data-fixed-active',"false");
            }
        });
        
        $(document).on('click','.form_select .form_btn', function(e) {
            $formSelect = e.currentTarget.parentNode;

            let fixedActive = $(e.currentTarget).closest('.form_select').attr('data-fixed-active');
            
            if (fixedActive === "true" && $formSelectPrev == $formSelect && selectPrevProt) {
                selectComplete($selectComplete);
                $(e.currentTarget).closest('.form_select').attr('data-fixed-active',"false");
                return
            }

            if ($formSelectPrev !== $formSelect && selectPrevProt) {
                selectComplete($selectComplete);
            }
            
            if($formSelectPrev == $formSelect || selectPrevProt){
                $selectComplete = $formSelect;
            } else {
                $selectComplete = $formSelectPrev ;
            }
            $formSelectPrev = $formSelect;
            selectPrevProt = true;

            let active = false;
            if($(e.currentTarget).closest('.form_select').hasClass('active')){
                active = true;
            } else {
                let $optionArea = $($formSelect).find('.option_area');
                if($($formSelect).closest('.form_select').hasClass('mobile')) {
                    // 모바일 레이아웃
                    $('body').append(`
                    <div class="fixed_area mobile">
                        <button type="button" class="btn btn_close_rounded"></button>
                    </div>
                    <div class="dim"></div>
                    `);
                    $('html').css('overflow', 'hidden');
                    $('.fixed_area').attr("tabindex", -1).focus().attr("tabindex", null);
                } else {
                    $('body').append(`<div class="fixed_area"><div class="dim"></div></div>`);
                }
                $('.fixed_area').append($optionArea);

                if($formSelect.dataset.index !== undefined) {
                    $formSelect.selectIdx = $formSelect.dataset.index;
                    $formSelect.dataset.index !== '' && $('.fixed_area .option_item').removeClass('active').eq($formSelect.selectIdx).addClass('active');
                }
            }

            if(!$($formSelect).closest('.form_select').hasClass('mobile')) optionAreaSize();

            $('.form_select.active').removeClass('active');
            
            if(!active){
                $(e.currentTarget).closest('.form_select').toggleClass('active');
            } 
            $(e.currentTarget).closest('.form_select').attr('data-fixed-active',"true");
            
        });
        
        $(document).on('click','.option_btn, .option_item input[type="radio"]', function(e) {
            let $this = e.currentTarget;
            $formSelect.selectIdx = $(this).closest('.option_item').index();
            $formSelect.dataset.index = $(this).closest('.option_item').index();
            let textData = $($this).attr('type') === 'radio' ? $(this).prev().find('span').text() : $(this).text();
            console.log(textData);
            $(this).closest('.option_list').find('.option_item').removeClass('active').eq($formSelect.dataset.index).addClass('active');
            $($formSelect).find('.form_btn').text(textData).addClass('active');
            selectComplete($selectComplete);
            $('.form_select').attr('data-fixed-active',"false");
        });

        // 전체선택
        $(document).on('change','.option_ttl input', function() {
            if($(this).is(':checked')) {
                $(this).parents('.option_ttl').next().find('input').prop('checked',true);
            } else {
                $(this).parents('.option_ttl').next().find('input').prop('checked',false);
            }
        })

        // mobile selectbox 닫기
        $(document).on('click', '.fixed_area .btn_close_rounded, .dim', function(e) {
            selectComplete($selectComplete);
            $('.form_select').attr('data-fixed-active', "false");
            $('html').css('overflow', 'auto');
        })

        function selectComplete($selectComplete) {
            let $optionArea = $('.fixed_area').find('.option_area');
            $($selectComplete).append($optionArea).removeClass('active');
            $('.fixed_area').remove();
            $('.dim').remove() // mobile layout;
            $('html').css('overflow', 'auto');
        }

        $(document).on('keydown','.form_btn', function(e) {
            $formSelect = $formSelect ? $formSelect : e.currentTarget.parentNode;
            let $optionItem = $($formSelect).hasClass('active') ? $('.fixed_area .option_item') : $(e.currentTarget).closest('.form_select').find('.option_item');
            if($formSelect.dataset.index == undefined) {
                $formSelect.selectIdx = -1;
            }else {
                $formSelect.selectIdx = $formSelect.dataset.index;
            }

            if(e.keyCode == 9 || e.keyCode == 27){
                selectComplete($selectComplete);
            }

            if(e.keyCode == 37 || e.keyCode == 38){
                e.preventDefault();
                if (0 < $formSelect.selectIdx){
                    $formSelect.selectIdx =  Number($formSelect.selectIdx) - 1;
                    optionChange();
                }
            }

            if(e.keyCode == 39 || e.keyCode == 40){
                e.preventDefault();
                let max = $optionItem.length;
                if (max - 1 !== $formSelect.selectIdx && max - 1 > $formSelect.selectIdx){
                    $formSelect.selectIdx = Number($formSelect.selectIdx) + 1;
                    optionChange();
                }
            }

            function optionChange() {
                $formSelect.dataset.index = Number($formSelect.selectIdx);
                $optionItem.removeClass('active').eq($formSelect.selectIdx).addClass('active');
                let textData = $optionItem.eq($formSelect.selectIdx).find('.option_btn').text();
                $(e.currentTarget).text(textData).addClass('active');
                if ($($formSelect).hasClass('active')){
                    let h = 0;
                    for (let i = 0; i < $formSelect.selectIdx; i++) {
                        h += $optionItem.eq(i).outerHeight();
                    }
                    $('.fixed_area .option_area').scrollTop(h);
                }
            }
        });
        $(window).resize(function(){
            $('.form_select').hasClass('active') && optionAreaSize();
        });

        
    },
    select2: function () {
        $(document).on('click', '.search_select_btn', function () {
            let active = false;
            if ($(this).parents('.search_select').hasClass('active')) {
                active = true;
            }
            $('.search_select.active').removeClass('active');
            if (!active) {
                $(this).parents('.search_select').toggleClass('active');
            }
        });
        $('html').click(function (e) {
            if ($(e.target).parents('.search_select').length < 1) {
                $('.search_select').removeClass('active');
                $('.search_select .search_select_btn').removeClass('active');
                $('.search_select .dropdown_area').removeClass('active');
            }
        });
        $(document).on('click', '.dropdown_link', function (e) {
            e.preventDefault();
            let textData = $(this).text();
            $(this).parents('.search_select').find('.dropdown_item').removeClass('active');
            $(this).parents('.search_select').find('.search_select_btn').text(textData).addClass('active');
            $(this).parents('.search_select .search_select_btn').removeClass('active');
            $(this).parents('.search_select .dropdown_area').removeClass('active');

            $(this).parent('.dropdown_item').addClass('active').siblings().removeClass('active');
        });
    },
    select3: function () {
        $formSelect = $('.filter_box .form_select.mobile');
        $selectBtns = $formSelect.find('.form_btn');

        $formSelect.each((idx, select) => {
            const selectBtn = $selectBtns.eq(idx);
            const checkbox = $(select).find('.option_item input[type="checkbox"]');
            checkbox.each((i,option) => {
                const selectBtnText = $(select).find('.form_btn').text();
                $(option).on('change',() => {
                    let selectedArr = [];
                    const selectedOptions = checkbox.filter(':checked').map(function () {
                        let optionVal = $(this).siblings('span').text()
                        return selectedArr.push(optionVal);
                    }).get();
                    const selectedText = selectedOptions.length > 0 ? selectedArr.join(', ') : selectBtnText;;
                    selectBtn.text(selectedText);
                })
            })
        })
    },
    modal: function () {
        var $modal, $modalButton;
        $modalButton = $('.modal_toggle');
        $modalButton.on('click', function () {
            $modal = $($(this).data('target'));
            BuyGo.openModal($modal);
        });

        $('.modal_control').draggable({
            drag: function( event, ui ) {
                $(ui.helper).css({'z-index':200}).siblings('.modal_control').css({'z-index':100});
            }
        });
    },
    closeModal: function (
        $modal,
        focusedElementBeforeModal = document.activeElement
    ) {
        fn.removeHidden()
        $('.modal').off('scroll', function () { });
        $modal.addClass('modal_close');
        $modal.removeClass('active');
        focusedElementBeforeModal.focus();

        //배송지 추가
        // setTimeout(() => {
        //     if (document.querySelector('.btn_zipcode')){
        //         document.querySelector('.btn_zipcode').style.display = 'block';
        //     }
        //     $('.address_field .form_control').val('');
        // });
    },
    openModal: function (
        $modal,
        focusableElementsString = '.modal_centered, a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',
        $modalCloseButton = $('.modal .close'),
    ) {
        fn.addHidden();
        $modal.addClass('active');

        // modal alt position
        if($($modal).hasClass('modal_alt')) {
            let modalTop = $('.tab_header').length > 0?$('.tab_body').offset().top:$('.ttl_box').outerHeight();
            $($modal).css({
                'top': modalTop
            });
        }

        $('.modal').on('scroll', function () {
            if ($('.form_select').hasClass('active')) {
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

        $modal.find('.modal_control').each((i,t)=>{
            let gapX = 10,
            gapY = 10;

            t.querySelector('.modal_box').style.translate = `${gapX*i}px ${gapY*i}px`;
        });

        $modal.on('keydown', function (e) {
            trapTabKey(e);
        });

        $modal.on('click', function (e) {
            if ($(e.target).closest('.modal_box').length < 1 && $('.modal.active').attr('data-dim-click') !== 'false' && !$modal.hasClass('modal_certification')) {
                BuyGo.closeModal($modal);
            }
        });

        $modalCloseButton.off('click').on('click', function (e) {
            if($(e.currentTarget).closest('.modal_control').length){
                if($(e.currentTarget).closest('.modal').find('.modal_control').length === 1){
                    BuyGo.closeModal($modal);
                }else{
                    $(e.currentTarget).closest('.modal_control').remove();
                }
            }else{
                BuyGo.closeModal($modal);
            }
        })

        var focusableElements = $modal.find(focusableElementsString),
            focusableElements = Array.prototype.slice.call(focusableElements),
            firstTabStop = focusableElements[0],
            lastTabStop = focusableElements[focusableElements.length - 1];

        $($modal).removeClass('modal_close');
        if(firstTabStop) firstTabStop.focus();

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
                closeModal();
            }
        }
    },
    setSwiper: function () {
        var swiperArr = [];
        $(".set_swiper").each(function (index, element) {
            var tg = $(this);
            slideView = [5, 4],
                slideTabletView = [4, 3],
                slideMobileView = [1, 1];
            tg.addClass('instance_' + index);

            swiperArr[index] = new Swiper('.instance_' + index + ' .swiper', {
                loop: true,
                slidesPerView: slideMobileView[index],
                speed: 1000,
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
    datepicker: function () {
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
        $('#ui-datepicker-div').append('<button class="datepicker_close_btn"></button>')
        $(document).on('focus','.startDate',function() {
            $(this).parent().addClass('active');
        })
        $(document).on('click','.datepicker_close_btn',function() {
        })
    },
    nav: function () {
        $(document).on('click', '.type2 .depth1_link', function (e) {
            e.preventDefault();
            const $this = e.currentTarget;
            $($this).closest('.depth1_item').toggleClass('active').siblings().removeClass('active');
        });
        $(document).on('click','.depth1_item a',function (e) {
            e.preventDefault();
            $(this).closest('.depth1_item').siblings().removeClass('active');
            $(this).closest('.depth1_item').toggleClass('active');
        })
        $(document).on('focus', '.depth1_item a', function (e) {
            const $this = e.currentTarget;
            $($this).closest('.depth1_item').siblings().removeClass('active');
            $($this).closest('.depth1_item').addClass('active');
        });
        $(document).on('focus', '.depth1_item a', function (e) {
            const $this = e.currentTarget;
            if(!($($this).closest('.type2').length)){
                $(this).closest('.depth1_item').siblings().removeClass('active');
                $(this).closest('.depth1_item').addClass('active');
            }
        });
        $(document).on('blur', '.depth1_item a', function (e) {
            const $this = e.currentTarget;
            if(!($($this).closest('.type2').length)){
                let a_legth = $(this).closest('.depth1_item').find('a').length;
                let $a_last = $(this).closest('.depth1_item').find('a').removeClass('last')[a_legth - 1];
                $($a_last).addClass('last');
                if ($($this).hasClass('last')) {
                    $($this).closest('.depth1_item').removeClass('active');
                }
            }
        });
        $(document).on('mousedown','.visual .depth1_item > a',function (e) {
            e.preventDefault();
            let $el = e.currentTarget;
            let dropdownElement = $($el).closest('.depth1_item').find('.depth2_area');
            if($('html, body').hasClass('dev_mobile')){
                // $($el).toggleClass('on').siblings().removeClass('on');
                dropdownElement.stop().slideToggle().closest('.depth1_item').siblings().find('.depth2_area').stop().slideUp();
            }
        })
    },
    button: function () {
        $(document).on('click', '.category_btn', function (e) {
            const $this = e.currentTarget;
            if($($this).closest('.visual').length) {
                $('.visual').toggleClass('active');
            }
        });
        $(document).on('click', '.aside_tab_btn', function () {
            let index = $(this).closest('.aside_tab_item').index();
            $('.aside_tab_item').removeClass('active').eq(index).addClass('active');
            $('.aside_content_item').removeClass('active').eq(index).addClass('active');
        });
        $(document).on('click', '.header .etc_link', function (e) {
            e.preventDefault();
            const $this = e.currentTarget;
            // 최근 본 상품, 관심상품 열기
            if ($($this).find('.ico').hasClass('ico_prot')) {
                let height =$('html, body').hasClass('dev_mobile')?$('.header').outerHeight():0;

                BuyGo.openTl('.aside_wrap', '.aside', height);
            } 
        });
        $(document).on('click', '.aside .btn_back_circle, .aside .close_btn, .aside_dim', function () {
            // 최근 본 상품, 관심상품 닫기
            BuyGo.closeTl('.aside_wrap', '.aside');
        });
        $(document).on('click', '.banner_area .more_btn', function (e) {
            e.preventDefault();
            $('.banner_all_swiper_wrap').addClass('active');
            if (!$('html, body').hasClass('dev_mobile')) return false;

            // 배너 모두보기 열기
            let y = window.scrollY;
            let height = $('.nav .service_list').hasClass('fixed') ? $('.nav .service_list').outerHeight() : $('.header').outerHeight() - y;
            if ($('.nav .service_list').hasClass('gnb')) {
                height = $('.nav .service_list').outerHeight() + $('.search_wrap.gnb').outerHeight();
            }

            BuyGo.openTl('.banner_area', '.banner_all_swiper_wrap', height);
        });
        $(document).on('click', '.banner_area .btn_back_circle, .banner_all_swiper_dim', function () {
            $('.banner_all_swiper_wrap').removeClass('active');
            if (!$('html, body').hasClass('dev_mobile')) return false;

            // 배너 모두보기 닫기
            BuyGo.closeTl('.banner_area', '.banner_all_swiper_wrap');
        });
        $(document).on('click', '.header .etc_link .ico.ico_order', function (e) {
            // 주문 건 수 열기
            e.preventDefault();
            let y = window.scrollY;
            let height = $('.nav .service_list').hasClass('fixed')?$('.nav .service_list').outerHeight():$('.header').outerHeight() - y;

            if($('.nav .service_list').hasClass('gnb')){
                height = $('.nav .service_list').outerHeight() + $('.search_wrap.gnb').outerHeight();
            }

            BuyGo.openTl('.order_wrap', '.order_area', height);
        })
        $(document).on('click', '.order_header .btn_back_circle, .order_dim', function (e) {
            // 주문 건 수 닫기
            e.preventDefault();
            let $this = e.currentTarget;
            BuyGo.closeTl('.order_wrap', '.order_area');
        });
        $(document).on('click', '.bottom_btn', function (e) {
            // 카테고리 열기
            e.preventDefault();
            let $this = e.currentTarget;
            let index = $($this).index();
            $($this).toggleClass('active').siblings().removeClass('active');

            if (index === 1) {
                if($($this).hasClass('active')) {
                    let y = window.scrollY;
                    let height = $('.nav .service_list').hasClass('fixed')?$('.nav .service_list').outerHeight():$('.header').outerHeight() - y;

                    if($('.nav .service_list').hasClass('gnb')){
                        height = $('.nav .service_list').outerHeight() + $('.search_wrap.gnb').outerHeight();
                    }
                    
                    BuyGo.openTl('.nav .category', '.category_area', height);
                } else {
                    BuyGo.closeTl('.nav .category', '.category_area');
                }
            }
        })
        $(document).on('click', '.category_header .btn_back_circle', function (e) {
            // 카테고리 닫기
            e.preventDefault();
            let $this = e.currentTarget;
            BuyGo.closeTl('.nav .category', '.category_area');
        });
        $(document).on('click', '.prot_area .pagination .num', function (e) {
            $(e.currentTarget).toggleClass('active').siblings().removeClass('active')
        });
        $(document).on('click', '.cart_btn', function (e) {
            let $el = e.currentTarget;
            $($el).toggleClass('active');
            if ($($el).hasClass('active')) {
                if (fn.exists($(this).closest('.aside'))) {
                    fn.showToastCartAdd('aside');
                } else {
                    fn.showToastCartAdd();
                }
            }
        });
        $(document).on('click', '.zzim_btn', function (e) {
            let $el = e.currentTarget;
            $($el).toggleClass('active');
            if ($($el).hasClass('active')) {
                if (fn.exists($(this).closest('.aside'))) {
                    if ($(this).hasClass('active')) {
                        fn.showToastStarRemove('aside');
                    } else {
                        fn.showToastStar('aside');
                    }
                } else {
                    fn.showToastStar();
                }
            }
        });
        $(document).on('click', '.scroll_top_btn', function (e) {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        });
        $(document).on('click', '.toast_card .close_btn', function () {
            $('.toast_card').fadeOut(100).queue(function () { $(this).remove(); });
        });
        $(document).on('click', '.toast_card .remove_btn', function () {
            $('.toast_card').fadeOut(100).queue(function () { $(this).remove(); });
        });
        $(document).on('click', '.search_select_btn', function () {
            $('.search_select_btn').toggleClass('active');
            $('.search_select .dropdown_area').toggleClass('active');
        });
        $(document).on('input ', '.search_input input', function (e) {
            let $this = e.currentTarget;
            if(!($($this).closest('.re_search_area').length)){
                $('.search_input .dropdown_area').addClass('active');
            }
        });
        $(document).on('blur  ', '.search_input input', function (e) {
            let $this = e.currentTarget;
            if(!($($this).closest('.re_search_area').length)){
                $('.search_input .dropdown_area').removeClass('active');
            }
        });
        $(document).on('click','.entry_write .content_ttl', function (e) {
            e.preventDefault();
            $(this).parents('.entry_write').toggleClass('on');
        })
        $(document).on('click','.acc_item .ttl_link, .acc_item .close_btn', function (e) {
            e.preventDefault();
            let $el = e.currentTarget;
            let idx = $($el).closest('.acc_item').index();
            $($el).closest('.acc_list').find('.acc_item').eq(idx).toggleClass('active').siblings('.acc_item').removeClass('active');
        })
        $(document).on('click', '.sort_select_ico .sort_select_btn', function (e) {
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            if($('.sort_big_num').hasClass('active')) {
                $('.prot_link').addClass('prot_small_type');
            } else {
                $('.prot_link').removeClass('prot_small_type');
            }
        })
        $(document).on('click','.sort_select', function (e) {
            let $this = e.currentTarget;
            $($this).toggleClass('active');
        })
        $(document).on('click', '.confirm_inquiry_tbl .link', function (e) {
            e.preventDefault();
            let $el = e.currentTarget;
            $($el).closest('tr').toggleClass('open').siblings('tr').removeClass('open');
        })
        $(document).on('click', '.confirm_inquiry_tbl .close_btn', function (e) {
            e.preventDefault();
            let $el = e.currentTarget;
            $($el).closest('tr').prev('').removeClass('open');
        })
        $(document).on('click', '.footer .company_info_btn', function (e) {
            e.preventDefault();
            $('.footer .md_company_btn').toggleClass('active');
        })
        $(document).on('click','.brand_list',function(e) {
            e.preventDefault();
            let width = $(window).width();
            let $el = e.currentTarget;
            let dropdownElement = $($el).find('.dropdown');
            if (width < 768) {
                $($el).toggleClass('active').siblings().removeClass('active');
                dropdownElement.stop().slideToggle().closest($el).siblings().find('.dropdown').stop().slideUp();
            }
        })
        $(document).on('click', '.zoom', function (e) {
            e.preventDefault();
            let $this = e.currentTarget;
            $($this).toggleClass('in');
            if($($this).hasClass('in')) {
                $('.prot_link').addClass('prot_small_type');
            } else {
                $('.prot_link').removeClass('prot_small_type');
            }
        })
        $(document).on('click', '.md_category_area .category_btn', function (e) {
            e.preventDefault();
            let $this = e.currentTarget;
            $($this).toggleClass('active').siblings().toggleClass('active');
        })
        $(document).on('click','.cart_sec .check_agree .more', function(e) {
            e.preventDefault();
            let $el = e.currentTarget;
            if($('.guide_wrap:hidden').length > 1) {
                if($($el).hasClass('guide_service')) {
                    $('#guideService').show();
                } else {
                    $('#guidePrivacy').show();
                }
            } 
        })
        $(document).on('click','.guide_wrap .btn_back_circle, .guide_wrap .btn_back', function(e) {
            e.preventDefault();
            let $this = e.currentTarget;
            $($this).closest('.guide_wrap').hide();
        })
        $(document).on('click','.buygo_info_header', function(){
            let width = $(window).width();
            if( width < 768) {
                $(this).siblings().toggleClass('active');
                $(this).parent('.buygo_info_item').siblings().children('.buygo_info_body').removeClass('active');
            }
        })
        $(document).on('click','.mypage_search_header .depth1_item',function(e) {
            let idx = $(this).index();
            let last = $('.mypage_search_header .depth1_item').length - 1;
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            if(idx === last) {
                $(this).parent().siblings('.datepicker_wrap').addClass('active');
            }
        })
        $(document).on('click', '.obj_cart_tbl_box .remove_btn', function (e) {
            let $this = e.currentTarget;
            let width = $(window).width();
            let modalPosTarget = width < 768?$($this).closest('.obj_cart_tbl_box_cont'):$($this).closest('.obj_cart_tbl');
            console.log($(modalPosTarget).offset());
            let modalTop = modalPosTarget.offset().top + (modalPosTarget.outerHeight() / 2);
            let modalLeft = modalPosTarget.offset().left + (modalPosTarget.outerWidth() / 2);
            BuyGo.openModal($('.modal_prd_remove'));
            $('.modal_box').unwrap('.modal_centered');
            $('.modal_prd_remove').css({
                'position':'absolute',
                'top': modalTop,
                'left': modalLeft,
                'transform': 'translate(-50%, -50%)',
                'width': 'auto',
                'height': 'auto',
            })
        })
        $(document).on('click', '.check_control .check_remove', function (e) {
            BuyGo.openModal($('.modal_prd_remove'));
            $('.modal_box').wrap('<div class="modal_centered"></div>');
            $('.modal_prd_remove').css({
                'position':'fixed',
                'top': 0,
                'left': 0,
                'transform': 'none',
                'width': '100%',
                'height': '100%',
            })
        })
        $(document).on('focus','.sign_up_wrap .form_box .form_label', function(e) {
            e.preventDefault();
            let $this = e.currentTarget;
            let $parentTarget = $($this).closest('tr');
            $($this).closest('.form_box').addClass('active');
            $($this).closest('.form_box').find('.form_control').eq(0).focus();
            $($this).closest('tr').find('.guide_txt').show();
            $($this).closest('tr').find('.check_item').show();
            $($this).closest('tr').find('.btn_add_address').show().css({display:'block'});
            if($($parentTarget).find('.form_inc_btn').length || $($parentTarget).find('.form_select').length) {
                $($parentTarget).find('.guide_txt').hide();
            }
        })
        $(document).on('click','.modify_wrap .btn_more', function (e) {
            e.preventDefault();
            let $this = e.currentTarget;
            $($this).closest('.form_box').addClass('active');
            $($this).closest('.form_box').siblings('.more_input_area').show();
            if(!$($this).closest('.form_box').length) {
                $($this).siblings('.more_input_area').show();
            }
            if($($this).closest('.form_box').siblings('.check_item').length > 0 && $($this).closest('.form_box').hasClass('active')) {
                $($this).closest('.form_box').siblings('.check_item').hide();
            }
        })
        $(document).on('click','.form_box .btn_delete_address', function (e) {
            e.preventDefault();
            let $this = e.currentTarget;
            let modalPosTarget = $($this).closest('.form_box');
            let modalTop = modalPosTarget.offset().top + (modalPosTarget.outerHeight() / 2);
            let modalLeft = modalPosTarget.offset().left + (modalPosTarget.outerWidth() / 2);
            BuyGo.openModal($('.modal_delete_address'));
            $('.modal_delete_address').css({
                'position':'absolute',
                'top': modalTop,
                'left': modalLeft
            })
        })
        $(document).on('click','.more_input_area .btn', function (e) {
            e.preventDefault();
            let $this = e.currentTarget;
            $($this).closest('.more_input_area').hide();
            $($this).closest('.more_input_area').siblings('.form_box').removeClass('active');
            $($this).closest('.more_input_area').siblings('.form_box').find('.form_inc_btn.btn_more').show();
            $($this).closest('.more_input_area').siblings('.check_item').show();
        })
    },
    colorTheme: function () {
        let isUserColorTheme = localStorage.getItem('color-theme');
        const isOsColorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        const getUserTheme = () => isUserColorTheme ? isUserColorTheme : isOsColorTheme;

        if (getUserTheme() === 'dark') {
            localStorage.setItem('color-theme', 'dark');
            document.documentElement.setAttribute('color-theme', 'dark');
        } else {
            localStorage.setItem('color-theme', 'light');
            document.documentElement.setAttribute('color-theme', 'light');
        }

        $(document).on('click', '.dark_mode_btn', function () {
            isUserColorTheme = localStorage.getItem('color-theme');
            if (getUserTheme() === 'dark') {
                localStorage.setItem('color-theme', 'light');
                document.documentElement.setAttribute('color-theme', 'light');
            } else {
                localStorage.setItem('color-theme', 'dark');
                document.documentElement.setAttribute('color-theme', 'dark');
            }
        });
    },
    scrollTop: function () {
        $(window).scroll(function () {
            let windowTop = $(window).scrollTop();
            if (windowTop > 0) {
                $("body").addClass('scroll_down');
            } else {
                $("body").removeClass('scroll_down');
            }
            return windowTop;
        });
    },
    address: function (address1, address2, address3) {
        new daum.Postcode({
            oncomplete: function (data) {
                var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
                var extraRoadAddr = ""; // 도로명 조합형 주소 변수
                if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== "" && data.apartment === "Y") {
                    extraRoadAddr += extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
                }
                // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraRoadAddr !== "") {
                    extraRoadAddr = " (" + extraRoadAddr + ")";
                }
                // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
                if (fullRoadAddr !== "") {
                    fullRoadAddr += extraRoadAddr;
                }

                // 우편번호를 해당 필드에 넣는다.
                document.getElementById(address1).value = data.zonecode;
                document.getElementById(address2).value = fullRoadAddr;
                // 커서를 상세주소 필드로 이동한다.
                if(document.getElementById(address3)) document.getElementById(address3).focus();
            },
        }).open();
    },
    openTl: function (target, children, height) {
        if($('body').hasClass('openTl')) {
            if($(target).hasClass('active')) {
                BuyGo.closeTl('.target', '.children');
            } else {
                BuyGo.closeTl('.target', '.children');
    
                gsap.timeline()
                .set(children, {autoAlpha: 1, top: height})
                .add(()=>{
                    $(target).addClass('active target');
                    $(children).addClass('children');
                })
                .to(children, {xPercent: -100, autoAlpha: 1, duration: .45, ease: Power1.easeInOuteaseInOut})
                .add(()=>{
                    $('body').addClass('openTl');
                    $(target).addClass('target');
                    $(children).addClass('children');
                    $(children).find(':hidden').blur();
                    $(children).attr("tabindex", -1).focus().attr("tabindex", null);
                })
            }
            fn.addHidden();
        } else {
            gsap.timeline()
            .set(children, {autoAlpha: 1, top: height})
            .add(()=>{
                $(target).addClass('active target');
                $(children).addClass('children');
            })
            .to(children, {xPercent: -100, autoAlpha: 1, duration: .45, ease: Power1.easeInOuteaseInOut})
            .add(()=>{
                $('body').addClass('openTl');
                $(children).find(':hidden').blur();
                $(children).attr("tabindex", -1).focus().attr("tabindex", null);
            })
            fn.addHidden();
        }
    },
    closeTl: function (target, children) {
        if($('.bottom_btn.category').hasClass('active'))$('.bottom_btn.category').removeClass('active');
        
        gsap.timeline()
        .add(()=>{
            $('body').removeClass('openTl');
            $('html, body').removeClass('hidden');
            $(target).removeClass('active target');
            $(children).removeClass('children');
            $(children).attr("tabindex", -1).focus().attr("tabindex", null);
        })
        .to(children, {xPercent: 0, duration: .45, ease: Power1.easeInOuteaseInOut})
        .set(children, {autoAlpha: 0,})
        
    },
    resize: function () {
        const breakpoint = window.matchMedia('(max-width:767px)');
        let resizeMo = breakpoint.matches;

        const resizeFunc = function () {
            if(resizeMo) {
                $('html,body').addClass('dev_mobile');
                // 모바일 헤더 sticky
                BuyGo.stickyHeader();
                // .depth1_item PC 이벤트 제거
                $('.depth1_item').off('mouseover mouseleave');
                // brand_list focus
                $('.brand_list').attr('tabindex', 0);
                $('.brand_list').on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        let $el = e.currentTarget;
                        let dropdownElement = $($el).find('.dropdown');
                        $($el).toggleClass('active').siblings().removeClass('active');
                        dropdownElement.stop().slideToggle().closest($el).siblings().find('.dropdown').stop().slideUp();
                    }
                })
                // 모달 alt
                $(document).on('click', '.btn_alt', (e) => {
                    e.preventDefault();
                    BuyGo.openModal($('#modalAlt'));
                });
                // 모달
                $(document).on('click', '.inc_btn button', (e) => {
                    e.preventDefault();
                    BuyGo.openModal($('#modalCertification'));
                });
            } else {
                $('html,body').removeClass('dev_mobile');
                // .depth1_item 모바일 이벤트 제거
                $('.depth1_item').off('mousedown');
                // 사이드 영역 닫기
                if ($('[class*="area"]').closest().hasClass('active')) {
                    // BuyGo.closeTl('.order_wrap');
                    // BuyGo.closeTl('.category');
                }
                // brand_list 이벤트 제거
                $('.brand_list').off('keydown');
                // 모달 이벤트 제거
                $(document).off('click','.btn_alt');
                $(document).off('click','.inc_btn button');
                // gsap event set
                $('.order_area').css({ 'visibility':'visible', 'opacity': 1 });
                $('.category_area').css({ 'visibility':'visible', 'opacity': 1 });
                $('.banner_all_swiper_wrap').css({ 'visibility':'visible', 'opacity': 1, 'top': 0 });
            }
        }

        const breakpointChecker = function () {
            resizeMo = breakpoint.matches;
            return resizeFunc();
        };
        breakpoint.addListener(breakpointChecker);
        breakpointChecker()
    },
    stickyHeader: function () {
        let navbarTop = $('.nav').offset().top,
        navbarBottom = $('.nav').offset().top + $('.nav').outerHeight(), // 이벤트 종료점,
        navbarHeight = $('.nav').outerHeight(),
        lastScrollTop = 0;
        
        $(window).scroll(function(){
            sticky();
        })

        function sticky() {
            let st = $(this).scrollTop();
            
            if(st > lastScrollTop && st >= navbarTop) {
                $('.nav .service_list').addClass('fixed');
                $('.header').css('padding-bottom', navbarHeight);
                $('.nav .service_list').removeClass('gnb');
                $('.search_wrap').removeClass('gnb');
            } else {
                if(st >= navbarBottom + navbarHeight && st + $(window).height() < $(document).height()){
                        $('.nav .service_list').addClass('gnb');
                        $('.search_wrap').addClass('gnb');
                    }
                if(st < navbarBottom) {
                    $('.header').css('padding-bottom', 0);
                    $('.nav .service_list').removeClass('fixed gnb');
                    $('.search_wrap').removeClass('gnb');
                }
            }
            lastScrollTop = st;
        }
    },
    fileUpload: function () {
        $(document).on('change','.img_upload_area .upload_file', function (e) {
            let $this = e.currentTarget;
            let fileList = $($this).closest('.img_upload_area').find('.img_upload_list');
            let fileItem = $($this).closest('.img_upload_area').find('.img_upload_item');
            let fileArr = this.files;

            $($this).closest('.img_upload_area').addClass('active');

            if (this.files && this.files[0]) {
                $.each(fileArr, function (idx, item) {
                    if(idx >= 4) {
                        return false;
                    }
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        if(isImageFile(item.name)){
                            fileItem.eq(idx).addClass('active').find('img').attr('src',`${e.target.result}`)
                        } else {
                            let fileName = getFilenameFromPath(item.name);
                            const $txt = `
                                <li class="txt_box">
                                    <span class="txt" data-placeholder="">${fileName}</span>
                                    <button type="button" class="btn btn_close_rounded"></button>
                                </li>
                            `;
                            fileList.append($txt);
                        }
                    }
                    reader.readAsDataURL(fileArr[idx]);
                })
            } 

        })
        
        $(document).on('click', '.img_upload_area .btn', function (e) {
            $(this).closest('.img_upload_item').removeClass('active');
            $(this).closest('.img_upload_item').find('.img').attr('src','');
            $(this).closest('.img_upload_item').find('.upload_file').val('');
            $(this).closest('.txt_box').remove();
        })

        function isImageFile(filename) {
            let extension = filename.split('.').pop().toLowerCase();
            let imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
            return imageExtensions.indexOf(extension) > -1;
        }

        function getFilenameFromPath(path) {
            return path.replace(/.*(\/|\\)/, '');
        }
    }
}

BuyGo.colorTheme();
$(function () {
    BuyGo.init();
});
