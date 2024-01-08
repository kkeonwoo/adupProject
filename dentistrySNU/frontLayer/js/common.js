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

$.namespace('dentistrySNU');
dentistrySNU = {
    init : function(){
        this.tab();
        this.modal();
        this.swiper.init();
        this.select.init();
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
    modal : function(){
        var $modal, $modalButton;
        $modalButton = $('.modal_toggle');
        $modalButton.on('click',function(){
            $modal = $($(this).data('target'));
            dentistrySNU.openModal($modal);
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
                dentistrySNU.closeModal($modal);
            }
        });

        $modalCloseButton.on('click',function(){
            dentistrySNU.closeModal($modal);
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
                dentistrySNU.closeModal($modal);
            }
        }
    },
    swiper : {
        init: () => {

        },

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

                dentistrySNU.select.handleBtnText(firstOption);
                // 부모 요소에 스크롤 이벤트 발생 시
                if (tParents.css('overflow') === 'visible' || tParents.css('overflow') === 'auto') {
                    tParents.on('scroll', function() { setTimeout(() => dentistrySNU.select.closeOption()); })
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
                    !$(e.target).closest('.form_select').length && dentistrySNU.select.closeOption();
                },
                touchmove: function(e) {
                    !$(e.target).closest('.form_select').length && dentistrySNU.select.closeOption();
                },
                resize: function() {
                    let formSelect = $('.form_select.show'),
                        formSelectWdh = fn.hasClass(formSelect, 'show') && formSelect.outerWidth(),
                        posXSelectBtn = fn.hasClass(formSelect, 'show') && formSelect.offset().left,
                        optionArea = $('body > .option_area');

                        if (fn.hasClass(optionArea, 'show')) optionArea.css({'width' : formSelectWdh, 'left': posXSelectBtn})
                },
                scroll: function() {
                    fn.hasClass('.form_select', 'show') && dentistrySNU.select.closeOption();
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
}
$(() => {
    dentistrySNU.init();
});
