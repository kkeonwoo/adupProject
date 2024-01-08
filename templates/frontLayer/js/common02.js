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
        this.tab();
        this.select.init();
        this.setSwiper();
        this.datepicker();
        fn.exists('.alert_btn') && this.alert.init();
        fn.exists('.accordion') && this.accordionFunc.init();
        fn.exists('.draggable_section') && this.drag.init();
    },
    tab : function(){
        // 1. active class로 키고 끄기
        // 2. aria-selected true/false
        // 3. 접근성 : 왼, 위 (이전) / 우, 하 (다음)
        // 4. tab_header에서 탭 하면 tabindex: -1, content로 포커스 
        $('.tab_btn').click(function(e) {
            let t = e.currentTarget,
                idx = $(t).closest('.tab_item').index();
            const tabHeader = $(t).closest('.tab_header'),
                  tabContainer = tabHeader.siblings('.tab_container');
            tabHeader.find('.tab_item').removeClass('active').eq(idx).addClass('active');
            tabContainer.find('.tab_cnt').removeClass('active').eq(idx).addClass('active');
        })
    },
    select : {
        lastSelected : null,
        init() {
            const selectBox = $('.form_select');
            let selectBtn = selectBox.find('.form_btn'),
                optionArea = $('body > .option_area, .form_select .option_area'),
                optionItem = optionArea.find('.option_item');
            /**
             * selectBox 모달 내부 위치 시
             */
            selectBox.each((i, t) => {
                let firstOption = $(t).find('.option_item').eq(0),
                    tParents = $(t).parents();

                ProjectName.select.handleBtnText(firstOption);
                // 부모 요소에 스크롤 이벤트 발생 시
                if (tParents.css('overflow') === 'visible' || tParents.css('overflow') === 'auto') {
                    tParents.on('scroll', function() { setTimeout(() => ProjectName.select.closeOption()); })
                }
            })

            /**
             * selectBox open 시, 위치 및 형제 요소 닫기
             */
            selectBtn.on({
                click: (e) => {
                    let t = e.currentTarget,
                        formSelect = $(t).closest('.form_select'),
                        optionArea = formSelect.find('.option_area'),
                        optionItem = formSelect.find('.option_item');

                    if (!fn.hasClass(formSelect, 'show')) {
                        $(t).addClass('active');
                        formSelect.addClass('show');
                        $('body > .option_area').remove();
                        $('body').append(`${optionArea.prop('outerHTML')}`);

                        optionArea = $('body > .option_area');
                        optionItem = optionArea.find('.option_item');
                        
                        this.handlePosOption(t);
                        this.lastSelected = optionItem.filter((idx, item) => fn.hasClass(item, 'selected') && item);
                        return this.lastSelected; // tracking selected item to opening option
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
                    !$(e.target).closest('.form_select').length && ProjectName.select.closeOption();
                },
                touchmove: function(e) {
                    !$(e.target).closest('.form_select').length && ProjectName.select.closeOption();
                },
                resize: function() {
                    let formSelect = $('.form_select.show'),
                        formSelectWdh = fn.hasClass(formSelect, 'show') && formSelect.outerWidth(),
                        posXSelectBtn = fn.hasClass(formSelect, 'show') && formSelect.offset().left,
                        optionArea = $('body > .option_area');

                        if (fn.hasClass(optionArea, 'show')) optionArea.css({'width' : formSelectWdh, 'left': posXSelectBtn})
                },
                scroll: function() {
                    fn.hasClass('.form_select', 'show') && ProjectName.select.closeOption();
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
            $('.form_select').find('.select_btn').attr('aria-expanded', false);
            $('.form_select').find('.option_area').removeClass('show top');
            $('body > .option_area').remove();
        },
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
            $modal.on('click',function(e){
                if ($(e.target).closest('.modal_box').length < 1 && $('.modal.active').attr('data-dim-click') !== 'false') {
                    ProjectName.modal.closeModal($modal);
                }
            });
            $modalCloseButton.on('click', () => ProjectName.modal.closeModal($modal));
            $modal.on('keydown', (e) => trapTabKey(e));

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
                if (e.keyCode === 27) {
                    ProjectName.modal.closeModal($modal);
                }
            }
        },
        /**
         * 모달 닫기
         * @param {$modal} init의 data-target
         */
        closeModal ($modal) {
            fn.removeHidden();
            $modal.off('scroll');
            $modal.addClass('modal_close').removeClass('active');
        },
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
    alert : {
        /**
         * alert 기본값
         * 버튼에 data-type 필요
         */
        init () {
            const alertBtn = $('.alert_btn');
            const alertPlaceholder = $('.alert_placeholder')
            fn.exists(alertPlaceholder) && alertBtn.on('click', function(e) { ProjectName.alert.appendAlert($(e.currentTarget).data('type'), e) });
        },
        /**
         * 메세지 띄우기
         * @param {type} 메세지 타입
         * @param {evt} event
         * 타입 : 성공, 실패, 에러
         */
        appendAlert (type, evt) {
            let t = evt.currentTarget;
            let alertPlaceholder = $(t).prev();
            let closeAlertBtn = $('.alert_placeholder').find('.btn_close');
            let mes;
            switch (type) {
                case 'success': mes = 'sucess'; break;
                case 'fail': mes = 'fail'; break;
                case 'error': mes = 'error'; break;
            };
            const wrapper = `
            <div class="alert alert-${type}" role="alert">
                <div>${mes}</div>
                <button type="button" class="btn_close" aria-label="Close"></button>
            </div>`;
            alertPlaceholder.html(wrapper);
            closeAlertBtn = alertPlaceholder.find('.btn_close');
            closeAlertBtn.focus();
            fn.exists(alertPlaceholder) && closeAlertBtn.on('click', this.closeAlert);
        },
        /**
         * 메세지 닫기
         * @param {evt} event
         */
        closeAlert (evt) {
            let t = evt.currentTarget;
            let alertPlaceholder = $(t).closest('.alert_placeholder');
            let beforeFocusedElement = $(t).closest('.alert_placeholder').next();

            $(beforeFocusedElement).focus();
            alertPlaceholder.html('');
        },
    },
    accordionFunc : {
        /**
         * 아코디언
         */
        init () {
            const accordion = $('.accordion');
            const accordionBtn = accordion.find('.accordion_btn');
            accordionBtn.on('click', this.handleCollapse);
        },
        /**
         * 이전 영역 닫기
         * @param {e} event
         */
        handleCollapse (e) {
            let t = e.currentTarget;
            // let isExpanded = $(t).attr('aria-expanded');
            let accordionCollapse = $(t).closest('.accordion_item').find('.accordion_collapse');
            
            if (fn.hasClass(t, 'collapsed')) {
                // 이전 열린 영역 닫기
                $(t).closest('.accordion_item').siblings().find('.accordion_btn').addClass('collapsed').attr('aria-expanded', false);
                $(t).closest('.accordion_item').siblings().find('.accordion_collapse').stop().slideUp(150).removeClass('show');
                // 오픈
                $(t).removeClass('collapsed').attr('aria-expanded', true).focus();
                accordionCollapse.stop().slideDown(150).addClass('show');
            } else {
                // 닫기
                $(t).addClass('collapsed').attr('aria-expanded', false).blur();
                accordionCollapse.stop().slideUp(150).removeClass('show');
            }
        }
    },
    drag : {
        init () {
            this.handleDrag('.draggable', 'y');
        },
        handleDrag (target, type) {
            gsap.registerPlugin(Draggable);
            
            const dragContainer = $(target).closest('.draggable_section');
            const dragContainerHt = dragContainer.outerHeight();
            const posSt = dragContainerHt * 0.65;
            const snapBox = $('.snap_box');
            const snapBoxHt = dragContainerHt * 0.325;
            
            $(target).css('transform', `translate3d(0, ${posSt}px, 0)`);
            snapBox.css('height', `${snapBoxHt}`);

            Draggable.create(target, {
                cursor: 'grab',
                type: type,
                edgeResistance: 0.75,
                bounds: { minY: 0, maxY: posSt},
                trigger: $(target).find('.draggable_btn'),
                onDragEnd: function () {
                    if (this.hitTest('.snap_box')) {
                        gsap.to(target, { y: 0, duration: .5, ease: "back.out(1.7)", onComplete: () => { $(target).addClass('top')}})
                    } else {
                        $(target).removeClass('top');
                    }
                },
            });
        },
    }
}
$(function () {
    ProjectName.init();
});
