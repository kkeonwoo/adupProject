(function ($) {
    jQuery.prototype.extend({
        switchMethod: function () {
            $(document).on('click', '.switch li', function (e) {
                e.preventDefault();

                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
            });
        },
        toggleMethod: function () {
            $(document).on('click', '.toggle', function (e) {
                e.preventDefault();

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

$.namespace('EasyCharger');
EasyCharger = {
    init: function () {
        this.include();
        this.lnb();
        this.allMenu();
        this.checkbox();
        this.select.init();
        this.tab();
        this.datepicker();
        this.fileAttach();

        $(".toggle").length && $(".toggle").toggleMethod();
    },
    include : function(){
        if(location.pathname.indexOf('/allMenu.html') > -1){
            $("#header").load("./include/header.html");
        }else{
            $("#header").load("../include/header.html");
        }
        $("#lnb").load("../include/lnb.html", function(){
            $('.sub_menu_list a').each(function(index,item){
                let mainContentTit = $('.section_tit').hasClass('sub') ? $('.section_tit').data('menu').replace(/\s/gi, "") : $('.section_tit').text().replace(/\s/gi, ""),
                    menuText = $(item).text().replace(/\s/gi, "");
                
                if(mainContentTit === menuText){
                    $(this).parent().addClass('active');
                    $(this).closest('.sub_menu_list').show();
                    $(this).closest('.sub_menu_list').prev().addClass('active');
                }
            });

            const logoH = $('#lnb .logo').outerHeight();
            $('#lnb .menu_list').css({
                height:`calc(100vh - ${logoH}px)`
            });
        });
    },
    allMenu: function () {
        $('.all_sub_menu_list > ul').each(function(){
            const count = $(this).find('li').length;

            if(count > 7){
                $(this).closest('li').addClass('type_lg');
            }
        });
    },
    lnb: function () {
        $(document).on('click', '.menu_link', function (e) {
            e.preventDefault();

            $(this).toggleClass('active').next('.sub_menu_list').stop().slideToggle();
        });
        $(document).on('click', '.sub_menu_list a', function (e) {
            e.stopPropagation();
        });
    },
    checkbox: function () {
        //checkbox 클릭 이벤트
        $(document).on('change', '.chkall', function (e) {
            e.preventDefault();

            const chkname = $(this).attr('name');
            if($(this).is(':checked')){
                $('input[name='+chkname+']').prop('checked', true);
            }else{
                $('input[name='+chkname+']').prop('checked', false);
            }
        });

        $(document).on('change', 'input[type="checkbox"]', function (e) {
            e.preventDefault();

            const chkname = $(this).attr('name'),
            chkall = $('input[name='+chkname+'].chkall'),
            total = $('input[name='+chkname+']:not(.chkall)').length,
            checked = $('input[name='+chkname+']:not(.chkall):checked').length;

            if(total != checked){
                chkall.prop("checked", false);   
            }else{
                chkall.prop("checked", true); 
            }
        });
    },
    select: {
        /**
         * select 로드시 초기화
         */
        init(){
            $(window).on('load',function(){
                EasyCharger.select.update();
                EasyCharger.select.fixedOption();
                EasyCharger.select.arrowButton();
                EasyCharger.select.html();
                EasyCharger.select.resize();
            });
        },
        /**
         * 새로운 select 요소 생성시 기본값 세팅
         */
        update(){
            const $formBtnAll = $('.form_btn');
            $formBtnAll.each((i,t)=>{
                const $t = $(t);
                const $formSelect = $t.closest('.form_select');
                const $optionArea = $t.siblings('.option_area');
                const $optionItemActive = $optionArea.find('.option_item.active');
                const $optionBtnActive = $optionItemActive.find('.option_btn');
                const val = $optionBtnActive.val();
                const idx = $optionItemActive.index();
                const text = $optionBtnActive.text();
                $t.text(text);
                $formSelect.attr('data-active-index',idx);
                $formSelect.find('.form_btn').attr('value',val);
                $t.off('click').on('click',(e)=>{
                    const $fixedOptionArea = $('.fixed_option_area');
                    const $modal = $t.closest('.modal');
                    $formBtnAll.not($t).closest('.form_select').removeClass(['active','top']);
                    $fixedOptionArea.remove();
                    const idx = $t.closest('.form_select').attr('data-active-index');
                    if($formSelect.hasClass('active')){
                        $formSelect.removeClass(['active','top']);
                    }else{
                        $formSelect.addClass('active');
                        if($modal.length){
                            $modal.append(/* html */`
                                <div class="fixed_option_area">
                                    ${$optionArea.prop('outerHTML')}
                                </div>
                            `);
                            this.coordinate($formSelect,true);
                        }else{
                            $body.append(/* html */`
                                <div class="fixed_option_area">
                                    ${$optionArea.prop('outerHTML')}
                                </div>
                            `);
                            this.coordinate($formSelect);
                        }
                        const $fixedOptionAreaNew = $('.fixed_option_area');
                        new SimpleBar($fixedOptionAreaNew.find('.option_area')[0],{autoHide: false});
                        this.autoScr($fixedOptionAreaNew,+idx)
                    }
                });
            });
        },
        /**
         * select option 버튼 클릭시 이벤트
         */
        fixedOption(){
            $(document).on('click','.fixed_option_area .option_btn',(e)=>{
                const $t = $(e.currentTarget);
                const $optionItem = $t.closest('.option_item');
                const idx = $optionItem.index();
                const $formSelectActive = $('.form_select.active');
                this.active($formSelectActive,idx);
                this.remove();
            });
        },
        /**
         * 키보드 제어 이벤트
         * - 화살표버튼 제어기능
         * - 닫기버튼 기능
         */
        arrowButton(){
            $(document).on('keydown','.form_btn',(e)=>{
                const keyName = e.key;
                const $t = $(e.currentTarget);
                const $fixedOptionArea = $('.fixed_option_area');
                const $formSelect = $t.closest('.form_select');
                const $optionItem = $formSelect.find('.option_item');
                const minNum = 0;
                const maxNum = $optionItem.length - 1;
                let idx = Number($formSelect.attr('data-active-index'));
                const conditions = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
                switch (keyName) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        if(maxNum === idx) break;
                        idx++;
                        break; 
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        if(minNum >= idx) break;
                        idx--;
                        break;
                    case 'Tab':
                    case 'Escape':
                        $fixedOptionArea.remove();
                        $formSelect.removeClass(['active','top']);
                        break;
                }
                if (conditions.includes(keyName)){
                    const isModal = Boolean($t.closest('.modal').length);
                    this.active($formSelect,idx,isModal);
                    this.autoScr($fixedOptionArea,idx)
                    e.preventDefault();
                }
            });
        },
        /**
         * 해당번째 요소 활성화
         * @param {HTMLDivElement} $formSelectActive - 활성화된 select 요소
         * @param {number} idx - 체크된 순서값
         * @param {boolean} isModal - 해당 select 요소에 부모가 모달 내부인지 체크
         */
        active($formSelectActive,idx,isModal = false){
            if(idx === -1) return;
            const text = $formSelectActive.find('.option_item').eq(idx).text();
            const $optionArea = $('.fixed_option_area .option_area');
            const val = $formSelectActive.find('.option_item').eq(idx).find('.option_btn').val();
            $optionArea.find('.option_item').removeClass('active').eq(idx).addClass('active');
            $formSelectActive.attr('data-active-index',idx);
            $formSelectActive.find('.option_item').removeClass('active').eq(idx).addClass('active');
            $formSelectActive.find('.form_btn').text(text).attr('value',val);
            this.coordinate($formSelectActive,isModal);
        },
        /**
         * 특정영역 스크롤시 option영역 사라지는 이벤트
         * @param {HTMLDivElement[]} scrHideArr - select 숨김처리되는 요소
         */
        scroll(scrHideArr = ['.scr_select']){
            scrHideArr.forEach((t,i)=>{
                const $t = $(t);
                $t.addClass('.scr_hide_area');
                $t.off('scroll').on('scroll',()=>{
                    const $formSelectActive = $('.form_select.active');
                    if($formSelectActive.load) this.remove();
                });
            });
        },
        /**
         * 새로 생성된 option영역 select버튼 좌표체크후 위치, 크기 세팅
         * @param {HTMLDivElement} $formSelectActive - 활성화된 select 요소
         * @param {boolean} isModal - 해당 select 요소에 부모가 모달 내부인지 체크
         * @param {boolean} isResize - 리사이즈시 1px 오차 체크
         */
        coordinate($formSelectActive,isModal = false,isResize = false){
            if($formSelectActive.length === 0) return;
            const $fixedOptionArea = $('.fixed_option_area');
            const windowHgt = $window.outerHeight();
            const wdt = $formSelectActive.outerWidth();
            const hgt = $formSelectActive.outerHeight();
            const fixedHgt = $fixedOptionArea.outerHeight();
            let offsetX = $formSelectActive.offset().left;
            const offsetY = $formSelectActive.offset().top;
            const offsetY2 = $formSelectActive.closest('.modal_box').offset()?.top;
            const positionY = $formSelectActive[0].getBoundingClientRect().top;
            const modalPt = parseFloat($formSelectActive.closest('.modal_centered').css("padding-top"));
            let y;

            if (isModal){
                if(windowHgt >= $formSelectActive.closest('.modal_box').outerHeight()){
                    offsetX += fn.getScrollBarWidth() / 2;
                    y = positionY;
                } else {
                    y = offsetY - offsetY2;
                }
            } else {
                y = offsetY;
            }
            if(windowHgt/2 > positionY){
                $fixedOptionArea.css({"left":`${offsetX}px`,"top":`${y + hgt}px`,"width":`${wdt}px`});
            } else {
                $formSelectActive.addClass('top');
                $fixedOptionArea.addClass('top').css({"left":`${offsetX}px`,"top":`${y - fixedHgt + (isResize && 1)}px`,"width":`${wdt}px`});
            }
        },
        /**
         * 생성된 fixed_option_area 클래스 요소 제거 및 비활성화처리
         */
        remove(){
            const $formSelectAll = $('.form_select');
            const $fixedOptionArea = $('.fixed_option_area');
            $fixedOptionArea.remove();
            $formSelectAll.removeClass(['active','top']);
        },
        /**
         * select 외부영역 클릭시 닫힘 이벤트
         */
        html(){
            $html.click((e)=>{
                const $fixedOptionArea = $('.fixed_option_area');
                const $formSelectActive = $('.form_select.active');
                if(!($(e.target).closest('.fixed_option_area').length || $(e.target).closest('.form_select').length)){
                    $fixedOptionArea.remove();
                    $formSelectActive.removeClass(['active','top']);
                }
            });
        },
        /**
         * resize시 좌표 및 크기 변경
         */
        resize(){
            $(window).resize(()=>{
                const $formSelectActive = $('.form_select.active');
                const isModal = Boolean($formSelectActive.closest('.modal').length);
                this.coordinate($formSelectActive,isModal,true);
            });
        },
        /**
         * option영역 open시 해당번째 요소로 자동 스크롤
         * @param {HTMLDivElement} $fixedOptionArea - 생성된 option 영역
         * @param {number} idx - 체크된 순서값
         */
        autoScr($fixedOptionArea,idx){
            const itemHgt = $fixedOptionArea.find('.option_item').outerHeight();
            const scrTop = itemHgt * idx;
            $fixedOptionArea.find('.option_area').scrollTop(scrTop);
        },
    },
    closeModal: function (
        $modal
    ) {
        fn.removeHidden();
        $('.modal').off('scroll', function () { });
        $('html, body').removeClass('hidden');
        $modal.addClass('modal_close');
        $modal.removeClass('active');
        $('.activeModal').focus();
        setTimeout(() => {
            $('.btn.activeModal').removeClass('activeModal')
        },100)
    },
    openModal: function (
        $modal,
        focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',
        $modalCloseButton = $modal.find('.close'),
        focusedElementBeforeModal = document.activeElement
    ) {
        $(focusedElementBeforeModal).addClass('activeModal');
        fn.addHidden();
        $modal.addClass('active');

        $modal.on('keydown', function (e) {
            trapTabKey(e);
        });

        $modal.on('click', function (e) {
            if ($(e.target).closest('.modal_box').length < 1 && $modal.attr('data-dim-click') !== 'false' && !$modal.hasClass('modal_certification') && $(e.target).closest('.fixed_option_area').length === 0) {
                EasyCharger.closeModal($modal);
            }
        });

        $modalCloseButton.on('click', function () {
            if($modal.closest('.modal_notice').length){ //Notice Popup
                if($modal.find('.modal_box.hide').length !== $modal.find('.modal_box').length){
                    $(this).closest('.modal_box').addClass('hide');
                    if($modal.find('.modal_box.hide').length === $modal.find('.modal_box').length){
                        EasyCharger.closeModal($modal);    
                    }
                }
            }else{
                EasyCharger.closeModal($modal);
            }
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
                EasyCharger.closeModal($modal);
            }
        }
    },
    tab : function(){
        const tabGroups = document.querySelectorAll('[data-role="tab"]');
        if (tabGroups) {
          let currentTarget, targetTabWrap, targetTabListWrap, targetPanelWrap;
          // 이벤트 타겟 변수 설정
          const init = (e) => {
            currentTarget = e.target.tagName;
            currentTarget === 'BUTTON' || 'A'
              ? (currentTarget = e.target)
              : (currentTarget = e.target.closest('button') || e.target.closest('a'));
            targetTabWrap = currentTarget.closest('[data-role="tab"]');
            targetTabListWrap = targetTabWrap.querySelector('[role="tablist"]');
            targetPanelWrap = targetTabWrap.querySelector('.tab_contents');
          };
          // 클릭 이벤트
          const tabClickEvt = (e) => {
            init(e);
            if (currentTarget.ariaSelected === 'false') {
              // 미선택된 탭 속성 false 상태로 만들기
              tabRemoveEvt(targetTabListWrap, targetPanelWrap);
              // 선택 된 탭 속성 true 상태로 만들기
              tabAddEvt(currentTarget, targetTabWrap);
            }
          };
          // 키보드 접근 이벤트
          const tabKeyUpEvt = (e) => {
            init(e);
            const targetBtnWrap = currentTarget.parentElement;
            if (e.key == 'ArrowRight') {
              // 키보드 -> 화살표를 눌렀을 때
              if (targetBtnWrap.nextElementSibling) {
                targetBtnWrap.nextElementSibling.children[0].focus();
                tabRemoveEvt(targetTabListWrap, targetPanelWrap);
                tabAddEvt(targetBtnWrap.nextElementSibling.children[0], targetTabWrap);
              } else homeKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
            } else if (e.key == 'ArrowLeft') {
              // 키보드 <- 화살표를 눌렀을 때
              if (targetBtnWrap.previousElementSibling) {
                targetBtnWrap.previousElementSibling.children[0].focus();
                tabRemoveEvt(targetTabListWrap, targetPanelWrap);
                tabAddEvt(targetBtnWrap.previousElementSibling.children[0], targetTabWrap);
              } else endKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
            }
            // 키보드 End 키 눌렀을 때
            else if (e.key == 'End') endKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
            // 키보드 Home 키 눌렀을 때
            else if (e.key == 'Home')
              homeKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap);
          };
          // tab active event
          const tabAddEvt = (currentTarget, targetPanelWrap) => {
            // 선택 된 탭 속성 true 로 변경
            currentTarget.setAttribute('aria-selected', 'true');
            currentTarget.removeAttribute('tabindex');
            currentTarget.parentElement.classList.add('active');
            // 연결 된 tabpanel 숨김 해제
            targetPanelWrap
              .querySelector(`[aria-labelledby="${currentTarget.id}"]`)
              .removeAttribute('hidden');
            targetPanelWrap
              .querySelector(`[aria-labelledby="${currentTarget.id}"]`)
              .setAttribute('tabindex', '0');
          };
          // tab active remove event
          const tabRemoveEvt = (tabListWrap, tabPanelWrap) => {
            targetTabListWrap.querySelectorAll('li').forEach((tabBtnWrap) => {
              // 기존에 선택 된 탭 속성 false 로 변경
              if (tabBtnWrap.classList.contains('active')) {
                tabBtnWrap.classList.remove('active');
                tabBtnWrap.querySelector('[role="tab"]').setAttribute('aria-selected', 'false');
                tabBtnWrap.querySelector('[role="tab"]').setAttribute('tabindex', '-1');
              }
            });
            // 기존에 선택 된 tabpanel 숨김
            for (let tabPanel of targetPanelWrap.children) {
              tabPanel.setAttribute('hidden', 'false');
              tabPanel.setAttribute('tabindex', '-1');
            }
          };
          // 키보드 Home key Event (선택된 탭 리스트 중 첫 번째 리스트로 포커스 이동)
          const homeKeyEvt = (targetTabListWrap, targetTabWrap, targetPanelWrap) => {
            targetTabListWrap.children[0].children[0].focus();
            tabRemoveEvt(targetTabListWrap, targetPanelWrap);
            tabAddEvt(targetTabListWrap.children[0].children[0], targetTabWrap);
          };
          // 키보드 End key Event (선택된 탭 리스트 중 마지막 리스트로 포커스 이동)
          const endKeyEvt = (targetTabListWrap, targetTabWrap, targetPanelWrap) => {
            const targetTabLists = targetTabListWrap.querySelectorAll('li');
            targetTabLists[targetTabLists.length - 1].children[0].focus();
            tabRemoveEvt(targetTabListWrap, targetPanelWrap);
            tabAddEvt(targetTabLists[targetTabLists.length - 1].children[0], targetTabWrap);
          };
          // 클릭/키보드 탭 이벤트 제거/할당
          tabGroups.forEach((tabWrapper) => {
            const tabBtns = tabWrapper.querySelectorAll('[role="tab"]');
            tabBtns.forEach((tabBtn) => {
              tabBtn.removeEventListener('click', tabClickEvt);
              tabBtn.addEventListener('click', tabClickEvt);
              tabBtn.removeEventListener('keyup', tabKeyUpEvt);
              tabBtn.addEventListener('keyup', tabKeyUpEvt);
            });
          });
        }
    },
    datepicker : function(){
        $(".datepicker").datepicker({
            dateFormat: "yy-mm-dd", // 날짜의 형식
            nextText: ">",
            prevText: "<"
        });
        $(".startDate").datepicker({
            dateFormat: "yy-mm-dd", // 날짜의 형식
            nextText: ">",
            prevText: "<",
            onSelect: function (date) {
                var type = $(this).data('type');
                var endDate = $('.endDate[data-type=' + type + ']');
                var startDate = $(this).datepicker('getDate');
                var minDate = $(this).datepicker('getDate');
                endDate.datepicker('setDate', minDate);
                startDate.setDate(startDate.getDate() + 30);
                // endDate.datepicker('option', 'maxDate', startDate); 종료 일자의 최대 선택 가능 기간
                // endDate.datepicker('option', 'minDate', minDate); 종료 일자의 최소 선택 가능 기간
            }
        });
        $('.endDate').datepicker({
            dateFormat: "yy-mm-dd", // 날짜의 형식
            nextText: ">",
            prevText: "<"
        });
    },
    fileAttach : function(){
        $(document).on('change','.upload_hidden',function(){
            if(fn.exists('.delete_type')){
                if(window.FileReader){
                    const reader = new FileReader();
                    const filename = $(this)[0].files[0].name;
                    const fileBox = $(this)[0].closest('.filebox');
                    let str = "<button type='button' class='delete_file'>delete</button>";

                    reader.onload = function(e){
                        const src = e.target.result;
                        $(fileBox).append(str);
                    }
                    reader.readAsDataURL($(this)[0].files[0]);
                    $(this).siblings('.upload_name').val(filename);
                    $(this).siblings('.upload_name').addClass('inc_value');
                    $(this).siblings('.btn_label').addClass('inc_value');
                }else {
                    $(this)[0].select();
                    $(this)[0].blur();
                    const imgSrc = document.selection.createRange().text;
                    const filename = $(this).val().split('/').pop().split('\\').pop();
                    
                    $(this).siblings('.upload_name').val(filename);
                }
            }else{
                if(window.FileReader){
                    const filename = $(this)[0].files[0].name;
                    $(this).siblings('.upload_name').val(filename);
                }else {
                    const filename = $(this).val().split('/').pop().split('\\').pop();
                    $(this).siblings('.upload_name').val(filename);
                };
            }
        });
    },
}
$(function () {
    $window = $(window);
    $html = $('html');
    $body = $('body');
    EasyCharger.init();
});
