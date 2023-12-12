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
            let selectBtn = selectBox.find('.select_btn'),
                optionArea = selectBox.find('.option_area'),
                optionItem = selectBox.find('.option_item');
            const optionBtn = optionArea.find('.option_btn');

            /**
             * selectBox 초기값, 모달 내부 위치 시
             */
            selectBox.each((i, t) => {
                let optionItem = $(t).find('.option_item'),
                    optionArea = $(t).find('.option_area'),
                    tParents = $(t).parents();

                this.handleBtnText(optionItem[0]); // 초기값
                // 부모 요소에 스크롤 이벤트 발생 시
                if (tParents.css('overflow') === 'visible' || tParents.css('overflow') === 'auto') {
                    tParents.on('scroll', function() { setTimeout(() => fn.hasClass(optionArea, 'show') && this.initBeforeSelect(optionItem), 100); })
                }
            })

            /**
             * selectBox open 시, 위치 및 형제 요소 닫기
             */
            selectBtn.on('click', (e) => {
                let t = e.currentTarget,
                    windowHt = $(window).outerHeight() + $(window).scrollTop(), // 화면 하단 높이
                    posSelectBtn = $(t).outerHeight() + $(t).offset().top, // select 버튼 하단 높이
                    selectBtnHt = $(t).outerHeight(),
                    gap = windowHt - posSelectBtn,
                    optionArea = $(t).closest('.form_select').find('.option_area'),
                    optionItem = $(t).closest('.form_select').find('.option_item'),
                    optionAreaHt = optionArea.outerHeight();

                if (!fn.hasClass(optionArea, 'show')) {
                    selectBtn.attr('aria-expanded', false);
                    $('.option_area').removeClass('show');

                    // option 열기
                    $(t).attr('aria-expanded', true);
                    if (gap < optionAreaHt) { // 화면과 select 하단의 차이가 optionArea 높이보다 작다면
                        optionArea.addClass('top');
                        optionArea.addClass('show').css('top', -optionAreaHt);
                    } else {
                        optionArea.removeClass('top');
                        optionArea.addClass('show').css('top', selectBtnHt);
                    }
                    this.lastSelected = optionItem.filter((idx, item) => fn.hasClass(item, 'selected') && item);
                    return this.lastSelected; // tracking selected item to opening option
                } else {
                    this.closeOption();
                }
            });

            /**
             * selectBox 키보드 제어
             */
            selectBtn.on('keydown', (e) => {
                let t = e.currentTarget,
                    optionItem = $(t).closest('.form_select').find('.option_item'),
                    activeItem = $(t).closest('.form_select').find('.selected'),
                    activeIdx = activeItem.index();
                
                if (e.keyCode === 38) {
                    // up
                    e.preventDefault();
                    if (activeIdx <= 0) return;
                    this.handleSelectOption(optionItem, optionItem.eq(activeIdx - 1));
                    this.handleBtnText(optionItem.eq(activeIdx - 1));
                } else if (e.keyCode === 40) {
                    // down
                    e.preventDefault();
                    if (activeIdx >= optionItem.length - 1) return;
                    this.handleSelectOption(optionItem, optionItem.eq(activeIdx + 1));
                    this.handleBtnText(optionItem.eq(activeIdx + 1));
                } else if (e.keyCode === 9 || e.keyCode === 27) {
                    // escape
                    fn.hasClass(optionArea, 'show') && this.initBeforeSelect(optionItem);
                }
            });

            /**
             * option 선택 시
             */
            optionBtn.on('click', (e) => {
                let t = e.currentTarget,
                    optionItem = $(t).closest('.option_item');

                this.closeOption();
                this.handleSelectOption(optionItem.siblings(), optionItem);
                this.handleBtnText(optionItem);
            });

            /**
             * 화면 컨트롤 시, select box 닫기
             */
            $(window).on({
                scroll: function(e) {
                    let optionArea = $(e.target).find('.option_area');

                    if (fn.hasClass(optionArea, 'show')) dentistrySNU.select.initBeforeSelect(optionItem);
                },
                click: function(e) {
                    !$(e.target).closest('.form_select').length && dentistrySNU.select.closeOption();
                },
                touchmove: function(e) {
                    !$(e.target).closest('.form_select').length && dentistrySNU.select.closeOption();
                }
            })
        },
        /**
         * selectBtn 텍스트 값 변경
         * @param {*} t target
         */
        handleBtnText(t) {
            let selectedText = $(t).find('button').text(),
                selectBtn = $(t).closest('.form_select').find('.select_btn');
            
            selectBtn.text(selectedText);
        },
        /**
         * 선택된 option class, attr 변경
         * @param {*} initObj 변경 전
         * @param {*} activeObj 변경 후
         */
        handleSelectOption(initObj, activeObj) {
            $(initObj).removeClass('selected').attr('aria-selected', false);
            $(activeObj).addClass('selected').attr('aria-selected', true);
        },
        /**
         * select option list 닫기
         */
        closeOption() {
            $('.form_select').find('.select_btn').attr('aria-expanded', false);
            $('.form_select').find('.option_area').removeClass('show top');
        },
        /**
         * 선택하지 않고 닫았을 경우, 이전 선택값(초기값)으로 돌아가기
         * @param {*} t target
         */
        initBeforeSelect(t) {
            this.closeOption();
            $(t).removeClass('selected').attr('aria-selected', false);
            this.lastSelected.addClass('selected').attr('aria-selected', true);
            this.handleBtnText(this.lastSelected);
        },
    }
}
$(() => {
    dentistrySNU.init();
});
