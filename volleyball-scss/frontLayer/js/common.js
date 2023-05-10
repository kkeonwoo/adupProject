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

$.namespace('Federation');
Federation = {
    init: function () {
        Federation.gnb();
        Federation.tab();
        Federation.select();
        Federation.modal();
        Federation.button();
        Federation.setSwiper();
        Federation.datepicker();
        Federation.scrollTop();
        Federation.resize();
    },
    gnb: function () {
        const header = $('#header'),
            gnbItem = $('.nav__item'),
            gnbBg = $(".nav__bg"),
            subMenu = $(".nav.pc .nav__submenu"),
            adArea = $('.nav.pc .nav__ad'),
            hamburger = $('.btn--hamburger'),
            mGnb = $('.mGnb'),
            mGnbItem = $('.mGnb > ul > li > a'),
            mGnbDepth02 = $('.mGnb > ul > li > .nav__submenu > ul > li > a'),
            mGnbDepth03 = $('.mGnb > ul > li > .nav__submenu > ul > li > .nav-depth03')

        gnbItem.on('mouseenter focusin', function () {
            gnbItem.removeClass('on');
            $(this).addClass('on');
            gnbBg.stop().slideDown();
            subMenu.stop().slideDown();
            adArea.stop().slideDown();
        });
        gnbItem.on('mouseleave focusout', function () {
            gnbItem.removeClass('on');
        });
        header.find('a').last().on('focusout', function () {
            gnbItem.removeClass('on');
            gnbBg.stop().slideUp();
            subMenu.stop().slideUp();
            adArea.stop().slideUp();
        });
        header.on('mouseleave', function () {
            gnbItem.removeClass('on');
            gnbBg.stop().slideUp();
            subMenu.stop().slideUp();
            adArea.stop().slideUp();
        });
        hamburger.on('click', function (e) {
            e.preventDefault();

            header.toggleClass('on');
            mGnb.attr('tabindex', 0);
            if (header.hasClass('on')) {
                mGnb.stop().slideDown().focus();
                fn.addHidden();
            } else {
                mGnb.stop().slideUp();
                mGnbItem.closest('li').find('.nav__submenu').stop().slideUp();
                mGnbItem.closest('li').removeClass('nav__item--active');
                mGnbDepth03.stop().slideUp();
                fn.removeHidden();
            }
        })
        // mobile
        mGnbItem.parent('li').last().on('keydown', function (e) {
            if (e.keyCode === 9) {
                if (!e.shiftKey) {
                    mGnb.stop().slideUp();
                    mGnbDepth03.stop().slideUp();
                    header.removeClass('on');
                    fn.removeHidden();
                }
            }
        })
        mGnbItem.on('click', function (e) {

            if ($(this).next('.nav__submenu').find('.nav-submenu').length) {
                e.preventDefault();
            }

            let last = mGnbItem.parents('li').length - 1;
            let targetParent = $(this).closest('li');

            if (targetParent.index() === last) {
                return;
            } else {
                targetParent.stop().toggleClass('nav__item--active').siblings().removeClass('nav__item--active');
                mGnbDepth03.removeClass('nav__item--active').find('ul').stop().slideUp();
                if (targetParent.hasClass('nav__item--active')) {
                    targetParent.find('.nav__submenu').stop().slideDown();
                    targetParent.siblings().find('.nav__submenu').stop().slideUp();
                } else {
                    targetParent.find('.nav__submenu').stop().slideUp();
                }
            }
        })
        mGnbDepth02.on('keydown', function (e) {
            let last = $(this).closest('ul').children('li').length - 1;

            if ($(this).closest('li').index() === last && e.keyCode === 9) {
                if (!e.shiftKey) {
                    mGnbItem.closest('li').find('.nav__submenu').stop().slideUp();
                    mGnbItem.closest('li').removeClass('nav__item--active');
                }
            }
        })
        mGnbDepth02.on('click', function (e) {
            if ($(this).next('.nav-depth03').length > 0) {
                e.preventDefault();
            }

            mGnbDepth03.prev('.nav-submenu__link--arrow').toggleClass('nav-submenu__link--arrow--active');
            mGnbDepth03.toggleClass('nav__depth03--active').siblings().removeClass('nav__depth03--active');
            if (mGnbDepth03.hasClass('nav__depth03--active')) {
                mGnbDepth03.stop().slideDown();
            } else {
                mGnbDepth03.stop().slideUp();
            }
        })
        mGnbDepth03.find('li').last().find('a').on('blur', function (e) {
            e.preventDefault();

            mGnbDepth03.removeClass('nav__depth03--active');
            mGnbDepth03.stop().slideUp();
        })

    },
    tab: function () {
        // 탭 컨텐츠 숨기기
        $('.tab_content').hide();

        // 첫번째 탭콘텐츠 보이기
        $('.tab_container').each(function () {
            $(this).children('.tabs li:first').addClass('active'); //Activate first tab
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
    select: function () {
        let $formSelect;
        let $formSelectPrev;
        let selectPrevProt = true;
        let $selectComplete;

        function optionAreaSize() {
            let selectTop = $($formSelect).offset().top;
            let selectLeft = $($formSelect).offset().left;
            let selectW = $($formSelect).outerWidth();
            let selectH = $($formSelect).outerHeight();
            $('.fixed_area').css({ 'top': selectTop + selectH, 'left': selectLeft, 'width': selectW });
            $('.fixed_area .dim').css({ 'height': selectH });
        }
        $('html').click(function (e) {
            if ($(e.target).closest('.form_select').length < 1) {
                selectComplete($selectComplete);
                $('.form_select').attr('data-fixed-active', "false");
            }
        });
        $(document).on('click', '.form_select .form_btn', function (e) {
            $formSelect = e.currentTarget.parentNode;

            let fixedActive = $(e.currentTarget).closest('.form_select').attr('data-fixed-active');

            if (fixedActive === "true" && $formSelectPrev == $formSelect && selectPrevProt) {
                selectComplete($selectComplete);
                $(e.currentTarget).closest('.form_select').attr('data-fixed-active', "false");
                return
            }

            if ($formSelectPrev !== $formSelect && selectPrevProt) {
                selectComplete($selectComplete);
            }

            if ($formSelectPrev == $formSelect || selectPrevProt) {
                $selectComplete = $formSelect;
            } else {
                $selectComplete = $formSelectPrev;
            }
            $formSelectPrev = $formSelect;
            selectPrevProt = true;

            let active = false;
            if ($(e.currentTarget).closest('.form_select').hasClass('active')) {
                active = true;
            } else {
                let $optionArea = $($formSelect).find('.option_area');
                $('body').append(`<div class="fixed_area"><div class="dim"></div></div>`);
                $('.fixed_area').append($optionArea);

                if ($formSelect.dataset.index !== undefined) {
                    $formSelect.selectIdx = $formSelect.dataset.index;
                    $formSelect.dataset.index !== '' && $('.fixed_area .option_item').removeClass('active').eq($formSelect.selectIdx).addClass('active');
                }
            }
            optionAreaSize();

            $('.form_select.active').removeClass('active');
            if (!active) {
                $(e.currentTarget).closest('.form_select').toggleClass('active');
            }
            $(e.currentTarget).closest('.form_select').attr('data-fixed-active', "true");

        });

        $(document).on('click', '.option_btn', function () {
            $formSelect.selectIdx = $(this).closest('.option_item').index();
            $formSelect.dataset.index = $(this).closest('.option_item').index();
            let textData = $(this).text();
            $(this).closest('.option_list').find('.option_item').removeClass('active').eq($formSelect.dataset.index).addClass('active');
            $($formSelect).find('.form_btn').text(textData).addClass('active');
            selectComplete($selectComplete);
            $('.form_select').attr('data-fixed-active', "false");
        });

        function selectComplete($selectComplete) {
            let $optionArea = $('.fixed_area').find('.option_area');
            $($selectComplete).append($optionArea).removeClass('active');
            $('.fixed_area').remove();
        }
        $(document).on('keydown', '.form_btn', function (e) {
            $formSelect = $formSelect ? $formSelect : e.currentTarget.parentNode;
            let $optionItem = $($formSelect).hasClass('active') ? $('.fixed_area .option_item') : $(e.currentTarget).closest('.form_select').find('.option_item');
            if ($formSelect.dataset.index == undefined) {
                $formSelect.selectIdx = -1;
            } else {
                $formSelect.selectIdx = $formSelect.dataset.index;
            }

            if (e.keyCode == 9 || e.keyCode == 27) {
                selectComplete($selectComplete);
            }

            if (e.keyCode == 37 || e.keyCode == 38) {
                e.preventDefault();
                if (0 < $formSelect.selectIdx) {
                    $formSelect.selectIdx = Number($formSelect.selectIdx) - 1;
                    optionChange();
                }
            }

            if (e.keyCode == 39 || e.keyCode == 40) {
                e.preventDefault();
                let max = $optionItem.length;
                if (max - 1 !== $formSelect.selectIdx && max - 1 > $formSelect.selectIdx) {
                    $formSelect.selectIdx = Number($formSelect.selectIdx) + 1;
                    optionChange();
                }
            }

            function optionChange() {
                $formSelect.dataset.index = Number($formSelect.selectIdx);
                $optionItem.removeClass('active').eq($formSelect.selectIdx).addClass('active');
                let textData = $optionItem.eq($formSelect.selectIdx).find('.option_btn').text();
                $(e.currentTarget).text(textData).addClass('active');
                if ($($formSelect).hasClass('active')) {
                    let h = 0;
                    for (let i = 0; i < $formSelect.selectIdx; i++) {
                        h += $optionItem.eq(i).outerHeight();
                    }
                    $('.fixed_area .option_area').scrollTop(h);
                }
            }
        });
        $(window).resize(function () {
            $('.form_select').hasClass('active') && optionAreaSize();
        });
    },
    modal: function () {
        var $modal, $modalButton;
        $modalButton = $('.modal_toggle');
        $modalButton.on('click', function () {
            $modal = $($(this).data('target'));
            Federation.openModal($modal);
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
                Federation.closeModal($modal);
            }
        });

        $modalCloseButton.on('click', function () {
            Federation.closeModal($modal);
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
                Federation.closeModal($modal);
            }
        }
    },
    button: function () {
        $(document).on('click', '.tabs__btn', function (e) {
            e.preventDefault();
            let index = $(this).closest('.tabs__item').index();
            $('.tabs__item').removeClass('tabs__item--active').eq(index).addClass('tabs__item--active');
            $('.tab-content').removeClass('tab-content--active').eq(index).addClass('tab-content--active');

            if ($('.ttl-wrap__area').length > 0) {
                $('.ttl-wrap__area').removeClass('ttl-wrap__area--active').eq(index).addClass('ttl-wrap__area--active');
            }
        });
        $(document).on('click', '.dropdown_item .content_header', function (e) {
            e.preventDefault();
            let $el = e.currentTarget;
            $($el).closest('.dropdown_item').toggleClass('active').siblings().removeClass('active');
        })
    },
    setSwiper: function () {
        $(".set_swiper").each(function (index, element) {
            var tg = $(this);
            slideView = [5, 4],
                slideTabletView = [4, 3],
                slideMobileView = [1, 1];
            tg.addClass('instance_' + index);

            var swiper = new Swiper('.instance_' + index + ' .swiper', {
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
    scrollTop: function () {
        $(window).on('scroll', function (e) {
            let scrollTop = $(window).scrollTop();
            if (scrollTop > 0) {
                $('body').addClass('scroll_down');
            } else {
                $('body').removeClass('scroll_down');
            }
        })
    },
    resize: function () {
        const breakpoint = window.matchMedia('(max-width:1200px)');
        let resizeMo = breakpoint.matches;

        const resizeFunc = function () {
            if (resizeMo) {
            } else {
                fn.removeHidden();
                const mGnb = $('.mGnb');
                mGnb.css({ 'display': 'none' })
                $('.header').removeClass('on');

                const gnbBg = $(".nav__bg"),
                    subMenu = $(".nav.pc .nav__submenu");

                const heightArray = subMenu.map(function () {
                    return $(this).outerHeight(true);
                }).get();
                const maxHeight = Math.max.apply(Math, heightArray);

                subMenu.css({ height: maxHeight });
                gnbBg.css({ height: maxHeight });
            }
        }

        const breakpointChecker = function () {
            resizeMo = breakpoint.matches;
            return resizeFunc();
        };
        breakpoint.addListener(breakpointChecker);
        breakpointChecker()
    }
}
$(function () {
    Federation.init();
});
