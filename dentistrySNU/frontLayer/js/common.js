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
        this.select.init();
        this.swiper.init();
    },
    tab: function() {
        let tabLink, tabItem, tabPanel, activeIdx;
        tabLink = $('.tab_link');
        tabPanel = $('.tab_panel');

        //탭메뉴 클릭 이벤트
        tabLink.on({
            click: function(e) {
                init(e);
                handleTab(tabItem, tabPanel, activeIdx);
            },
            keydown: function(e) {
                init(e);
                if (e.keyCode === 37 || e.keyCode === 38) {
                    if (activeIdx > 0) handleTab(tabItem, tabPanel, activeIdx - 1);
                } else if (e.keyCode === 39 || e.keyCode === 40) {
                    if (activeIdx < tabItem.length - 1) handleTab(tabItem, tabPanel, activeIdx + 1);
                } else if (e.keyCode === 9) {
                    tabPanel.eq(activeIdx).focus();
                }
            }
        })

        function init(e) {
            e.preventDefault();
            tabItem = $(e.currentTarget).closest('.tab_container').find('.tab_item');
            tabPanel = $(e.currentTarget).closest('.tab_container').find('.tab_panel');
            activeIdx = $(e.currentTarget).closest('.tab_item').index();
        }

        function handleTab(tabItem, tabPanel, activeIdx) {
            tabItem.find('.tab_link').removeClass('active').attr({'aria-selected': false, 'tabindex': -1});
            tabItem.eq(activeIdx).find('.tab_link').addClass('active').focus().attr({'aria-selected': false, 'tabindex': null});
            tabPanel.attr('hidden', true);
            tabPanel.eq(activeIdx).attr('hidden', false);
        }

        //키보드 이벤트
        tabPanel.on('keydown', function (e) {
            let idx = $(this).index();
            let activeTabLink = $(this).closest('.tab_container').find('.tab_item').eq(idx).find('.tab_link');
            tabPanel = $(this).closest('.tab_content').find('.tab_panel');

            if (idx === tabPanel.length - 1) return;
            e.preventDefault();
            if (e.keyCode === 9) activeTabLink.focus();
        })
    },
    select : {
        init() {
            let selectBox = $('.form_select'),
                selectBtn = selectBox.find('.form_btn');

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
                        optionArea = formSelect.find('.option_area');

                    if (!fn.hasClass(formSelect, 'show')) {
                        $(t).addClass('active');
                        formSelect.addClass('show');
                        $('body > .option_area').remove();
                        $('body').append(`${optionArea.prop('outerHTML')}`);

                        optionArea = $('body > .option_area');
                        optionItem = optionArea.find('.option_item');
                        
                        this.handlePosOption(t);
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
            $('.form_select').find('.option_area').removeClass('show top');
            $('body > .option_area').remove();
        },
    },
    swiper : {
        init() {

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
                    dentistrySNU.modal.closeModal($modal);
                }
            });
            $modalCloseButton.on('click', () => dentistrySNU.modal.closeModal($modal));
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
                    dentistrySNU.modal.closeModal($modal);
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
}
$(() => {
    dentistrySNU.init();
});
