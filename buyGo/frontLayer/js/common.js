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
        this.modal();
        this.setSwiper();
        this.datepicker();
        this.nav();
        this.button();
        this.scrollTop();
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
            if($(e.target).closest('.form_select').length < 1){
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
                $('body').append(`<div class="fixed_area"><div class="dim"></div></div>`);
                $('.fixed_area').append($optionArea);

                if($formSelect.dataset.index !== undefined) {
                    $formSelect.selectIdx = $formSelect.dataset.index;
                    $formSelect.dataset.index !== '' && $('.fixed_area .option_item').removeClass('active').eq($formSelect.selectIdx).addClass('active');
                }
            }
            optionAreaSize();

            $('.form_select.active').removeClass('active');
            if(!active){
                $(e.currentTarget).closest('.form_select').toggleClass('active');
            } 
            $(e.currentTarget).closest('.form_select').attr('data-fixed-active',"true");
            
        });
        
        $(document).on('click','.option_btn', function() {
            $formSelect.selectIdx = $(this).closest('.option_item').index();
            $formSelect.dataset.index = $(this).closest('.option_item').index();
            let textData = $(this).text();
            $(this).closest('.option_list').find('.option_item').removeClass('active').eq($formSelect.dataset.index).addClass('active');
            $($formSelect).find('.form_btn').text(textData).addClass('active');
            selectComplete($selectComplete);
            $('.form_select').attr('data-fixed-active',"false");
        });
        
        function selectComplete($selectComplete) {
            let $optionArea = $('.fixed_area').find('.option_area');
            $($selectComplete).append($optionArea).removeClass('active');
            $('.fixed_area').remove();
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
    modal: function () {
        var $modal, $modalButton;
        $modalButton = $('.modal_toggle');
        $modalButton.on('click', function () {
            $modal = $($(this).data('target'));
            BuyGo.openModal($modal);
        });
    },
    closeModal: function (
        $modal,
        focusedElementBeforeModal = document.activeElement
    ) {
        fn.removeHidden();
        $('.modal').off('scroll', function () { });
        $('html, body').removeClass('hidden');
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
        $modalCloseButton = $('.modal .close')
    ) {
        fn.addHidden();
        $modal.addClass('active');
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

        $modal.on('keydown', function (e) {
            trapTabKey(e);
        });

        $modal.on('click', function (e) {
            if ($(e.target).closest('.modal_box').length < 1 && $('.modal.active').attr('data-dim-click') !== 'false') {
                BuyGo.closeModal($modal);
            }
        });

        $modalCloseButton.on('click', function () {
            BuyGo.closeModal($modal);
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
    },
    nav: function () {
        $(document).on('mouseover', '.depth1_item', function (e) {
            const $this = e.currentTarget;
            $(this).addClass('active');
        });
        $(document).on('mouseleave', '.depth1_item', function (e) {
            const $this = e.currentTarget;
            $(this).removeClass('active');
        });
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
        $(document).on('focus', '.depth1_item a', function (e) {
            const $this = e.currentTarget;
            if(!($($this).closest('.type2').length)){
                $($this).closest('.depth1_item').siblings().removeClass('active');
                $($this).closest('.depth1_item').addClass('active');
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
    },
    button: function () {
        $(document).on('click', '.category_btn', function () {
            $('.visual').toggleClass('active');
        });
        $(document).on('click', '.aside_tab_btn', function () {
            let index = $(this).closest('.aside_tab_item').index();
            $('.aside_tab_item').removeClass('active').eq(index).addClass('active');
            $('.aside_content_item').removeClass('active').eq(index).addClass('active');
        });
        $(document).on('click', '.header .etc_link', function (e) {
            e.preventDefault();
            const $this = e.currentTarget;
            if ($($this).find('.ico').hasClass('ico_prot')) {
                let tl = gsap.timeline()
                .add(()=>{$('.aside_wrap').addClass('active')})
                .set(".aside_wrap .aside", {autoAlpha: 1,})
                .to(".aside_wrap .aside", {xPercent: -100, autoAlpha: 1, duration: .45, ease: Power1.easeInOuteaseInOut})
                .add(()=>{
                    const x = window.scrollX;
                    const y = window.scrollY;
                    $('.aside_wrap').attr("tabindex", -1).focus().attr("tabindex", null);
                    window.scrollTo(x, y);
                })
            }
        });
        $(document).on('click', '.aside .close_btn, .aside_dim', function () {
            let tl = gsap.timeline()
            .to(".aside_wrap .aside", {xPercent: 0, duration: .45, ease: Power1.easeInOuteaseInOut})
            .set(".aside_wrap .aside", {autoAlpha: 0,})
            .add(()=>{
                $('.aside_wrap').removeClass('active');
                const x = window.scrollX;
                const y = window.scrollY;
                $('.header .ico_prot').closest('.etc_link').attr("tabindex", -1).focus().attr("tabindex", null);
                window.scrollTo(x, y);
            })
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
        $(document).on('input ', '.search_input input', function () {
            $('.search_input .dropdown_area').addClass('active');
        });
        $(document).on('blur  ', '.search_input input', function () {
            $('.search_input .dropdown_area').removeClass('active');
        });
        $(document).on('click','.entry_write .content_ttl', function (e) {
            e.preventDefault();
            $(this).parents('.entry_write').toggleClass('on');
        })
        $(document).on('change','.img_upload_area .upload_file', function (e) {
            let fileName = $(this).val().replace(/.*(\/|\\)/, '');
            $(this).closest('.img_upload_area').find('.txt_box').find('.txt').text(fileName);
            $(this).closest('.img_upload_area').find('.txt_box').addClass('active');
        })
        $(document).on('click','.img_upload_area .btn_close', function (e) {
            let fileName = null;
            $(this).closest('.img_upload_area').find('.txt_box').find('.txt').text(fileName);
            $(this).closest('.img_upload_area').find('.txt_box').removeClass('active');
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
        })
        $(document).on('click', '.confirm_inquiry_tbl .link', function (e) {
            e.preventDefault();
            let $el = e.currentTarget;
            $($el).closest('tr').toggleClass('open').siblings('tr').removeClass('open');
        })
        $(document).on('click', '.confirm_inquiry_tbl .close_btn', function (e) {
            e.preventDefault();
            let $el = e.currentTarget;
            console.log('??')
            $($el).closest('tr').prev('').removeClass('open');
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
        });
    },
    address: function (address1, address2, address3, button) {
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
                document.getElementById(address3).focus();

                if(button === 'y'){
                    document.querySelector('.btn_zipcode').style.display = "none";
                }
            },
        }).open();
    },
    fileUpload: function () {
        $(document).on('change','.img_upload_area .upload_file', function (e) {
            let $this = e.currentTarget;
            let fileList = $($this).closest('.img_upload_area').find('.img_upload_list');
            let fileItem = $($this).closest('.img_upload_area').find('.img_upload_item');
            let fileArr = this.files;
            let fileCount = 0;

            $($this).closest('.img_upload_area').addClass('active');

            if (this.files && this.files[0]) {
                $.each(fileArr, function (idx, item) {
                    if(fileCount >= 4) {
                        return false;
                    }
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        if(isImageFile(item.name)){
                            fileItem.eq(idx).removeClass('add').find('img').attr('src',`${e.target.result}`)
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

        $(document).on('click','.img_upload_area .img_upload_item.add', function (e) {
            let $this = e.currentTarget;
            $($this).closest('.img_upload_area').find('.upload_file').trigger('click');
        })
        
        $(document).on('click', '.img_upload_area .btn', function (e) {
            let fileArr = '';
            let $this = e.currentTarget;
            if ($(this).closest('.img_upload_item')) {
                $(this).closest('.img_upload_item').addClass('add');
            }
            $(this).closest('.img_upload_area').removeClass('active');
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
