let $window = $(window);
let $html = $('html');
let $body = $('body');

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
        // this.checkbox();
        // this.select.init();
        // this.formControlBx.init();
        // this.bottomSheet.init();
        // this.phInput.init();
        // this.innerScroll.init();
        // this.swiper.init();
        // this.dummy.init();
        // this.clipboard.init();
        // this.valChk.init();
        // this.datepicker();
        // this.chooseTab.init();
        // this.aside.init();
        // this.acco.init();
        // this.handleBtnAct();
        this.switchInfo();
        this.handleTab();
    },
    switchInfo: function() {
        $(document).on('click', '.btn-switch', function(e) {
            e.preventDefault();

            const $this = $(e.currentTarget);
            const switchBox = $this.closest('.switch-wrap').find('.switch-box.active');
            $this.removeClass('active').siblings().addClass('active');
            switchBox.removeClass('active').siblings().addClass('active');
        })
    },
    handleTab: function() {
        if(!fn.exists('.tab-wrap')) return;

        $(document).on('click','.tab-btn-list button.tab-btn',(e)=>{
            const $this = $(e.currentTarget);
            const $swiperTabWrap = $this.closest('.tab-wrap');
            const idx = $this.index();
            $this.addClass('active').siblings().removeClass('active');
            $swiperTabWrap.find('.tab-pannel').removeClass('active').eq(idx).addClass('active')
        })
    },
    checkbox: function () {
        /**
         * checkbox 전체선택 change 이벤트
         */
        $(document).on('change', '.chkall', function (e) {
            e.preventDefault();

            const chkname = $(this).attr('name');
            if($(this).is(':checked')){
                $('input[name='+chkname+']').prop('checked', true);
            }else{
                $('input[name='+chkname+']').prop('checked', false);
            }
        });
        /**
         * checkbox change 이벤트
         */
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
            this.update();
            this.fixedOption();
            this.arrowButton();
            this.html();
            this.resize();
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
        firstTabStop?.focus();

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
    formControlBx: {
        /**
         * formControlBx 초기화
         */
        init(){
            this.keyDown();
            this.reset();
            this.update();
        },
        /**
         * form_control_bx부모요소가 있는 form_control요소에 값이 있는지 체크후 valueSet함수호출
         */
        update(){
            $('.form_control_bx .form_control').each((_,t)=>{
                this.valueSet($(t));
            });
        },
        /**
         * input value체크후 버튼 disabled
         * @param {element} $this - 제이쿼리 this
         */
        valueSet($this){
            const $btnReset = $this.siblings('.btn_reset');
            if($this.val() === ''){
                $btnReset.attr('disabled',true);
            } else {
                $btnReset.attr('disabled',false);
            }
        },
        /**
         * btn_reset요소클릭시 값초기화
         */
        reset(){
            $(document).on('click','.form_control_bx .btn_reset',(e)=>{
                const $this = $(e.currentTarget);
                $this.attr('disabled',true);
                $this.siblings('.form_control').val('');
            });
        },
        /**
         * keyDown시 valueSet함수호출
         */
        keyDown(){
            $(document).on('input','.form_control_bx .form_control',(e)=>{
                const $this = $(e.currentTarget);
                this.valueSet($this);
            });
        },
    },
    bottomSheet: {
        simplebar: null,
        boxObserver: null,
        /**
         * bottom sheet 초기화
         */
        init(){
            const bs = EasyCharger.bottomSheet;
            bs.fbsAreaEl = document.querySelector(".fbs_area");
            if(bs.fbsAreaEl === null) return;
            bs.fbsInnerEl = document.querySelector(".fbs_inner");
            bs.fbsDragEl = document.querySelector(".fbs_drag");
            bs.isDragging = false;
            bs.startY = null;
            bs.startHgt = null;
            const fbsHdrHgt = $('.fbs_hdr').outerHeight();
            const itemHgt = $('.location_item').eq(0).outerHeight();
            $body.addClass('mode_basic');
            bs.updateSheetHgt(fbsHdrHgt+itemHgt+16,true);
            bs.fbsDragEl.addEventListener("mousedown",(e) => this.dragStart(e,bs));
            document.addEventListener("mousemove",(e) => this.dragging(e,bs));
            document.addEventListener("mouseup",(e) => this.dragStop(e,bs));
            bs.fbsDragEl.addEventListener("touchstart",(e) => this.dragStart(e,bs));
            document.addEventListener("touchmove",(e) => this.dragging(e,bs));
            document.addEventListener("touchend",(e) => this.dragStop(e,bs));
            bs.resizeObserver();
        },
        /**
         * bottom sheet 높이제어
         * @param {number} hgt - 높이값 비율
         * @param {boolean} px - px단위 사용여부
         */
        updateSheetHgt(hgt,px=false){
            const bs = EasyCharger.bottomSheet;
            if(px){
                bs.fbsInnerEl.style.height = `${hgt}px`;
            }else{
                bs.fbsInnerEl.style.height = `${hgt}vh`;
                bs.fbsAreaEl.classList.toggle("fullscreen", hgt === 100);
            } 
        },
        /**
         * 드래그시작시 현재높이값 저장 및 다중드래그제어
         * @param {Event} e - 이벤트
         * @param {object} bs - bottomSheet
         */
        dragStart(e,bs){
            const hgt = bs.fbsInnerEl.style.height;
            bs.isDragging = true;
            startY = e.pageY || e.touches?.[0].pageY;
            startHgt = hgt.includes('vh') ? parseInt(hgt) : parseInt(hgt) / window.innerHeight * 100;
            bs.fbsAreaEl.classList.add("dragging");
            $body.addClass("is_dragging");
            e.preventDefault();
        },
        /**
         * 드래그중일때 height값 갱신
         * @param {Event} e - 이벤트
         * @param {object} bs - bottomSheet
         */
        dragging(e,bs){
            if(!bs.isDragging) return;
            const delta = startY - (e.pageY || e.touches?.[0].pageY);
            const newHgt = startHgt + delta / window.innerHeight * 100;
            const hdrHgt = $('.map_hdr').outerHeight();
            const fltgHgt = $('.fltg_ftr').outerHeight();
            const fbsHgt = $('.fbs_hdr').outerHeight();
            const maxHgt = Math.abs((hdrHgt + fltgHgt + 30) / window.innerHeight * 100 - 100);
            const minHgt = fbsHgt / window.innerHeight * 100;
            if(newHgt >= maxHgt){
                bs.updateSheetHgt(maxHgt);
            } else if (newHgt <= minHgt){
                bs.updateSheetHgt(minHgt);
            } else {
                bs.updateSheetHgt(newHgt);
            }
        },
        /**
         * 드래그위치에 따라 세팅값으로 이동
         * @param {Event} e - 이벤트
         * @param {object} bs - bottomSheet
         */
        dragStop(e,bs){
            if(!bs.isDragging) return;
            const hgt = bs.fbsInnerEl.style.height;
            const fbsHdrHgt = $('.fbs_hdr').outerHeight();
            const itemHgt = $('.location_item').eq(0).outerHeight();
            bs.isDragging = false;
            bs.fbsAreaEl.classList.remove("dragging");
            $body.removeClass("is_dragging");
            const sheetHgt = hgt.includes('vh') ? parseInt(hgt) : parseInt(hgt) / window.innerHeight * 100;
            const fullHgt = window.innerHeight - $('.map_hdr').outerHeight() - $('.fltg_ftr').outerHeight() - 30;

            function modeRange(mapRange=20,basicRange=40){
                $body.removeClass(['mode_map','mode_basic','mode_full']);
                if(sheetHgt < mapRange){
                    $body.addClass('mode_map');
                    bs.updateSheetHgt(fbsHdrHgt,true);
                } else if(sheetHgt < basicRange) {
                    $('.fbs_body .simplebar-content-wrapper').scrollTop(0);
                    $body.addClass('mode_basic');
                    bs.updateSheetHgt(fbsHdrHgt+itemHgt+16,true)
                } else {
                    $('.fbs_body .simplebar-content-wrapper').scrollTop(0);
                    $body.addClass('mode_full');
                    bs.updateSheetHgt(fullHgt,true);
                }
            }

            if($body.hasClass('mode_full')){
                modeRange(undefined,70);
            } else if ($body.hasClass('mode_map')) {
                modeRange(10,undefined);
            } else {
                modeRange();
            }
        },
        /**
         * 내부요소 리사이즈감시
         */
        resizeObserver(){
            const bs = EasyCharger.bottomSheet;
            let fbsHdrHgt = $('.fbs_hdr').outerHeight();
            $('.fbs_body').css({'height': `calc(100% - ${fbsHdrHgt}px - 16px)`});
            bs.boxObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    fbsHdrHgt = $('.fbs_hdr').outerHeight();
                    $('.fbs_body').css({'height': `calc(100% - ${fbsHdrHgt}px - 16px)`});
                    bs.simplebar?.recalculate();
                    bs.isDragging = true;
                    bs.dragStop(undefined,bs);
                }
            });
            const lbListEl = document.querySelector('.lb_list');
            const locationItemEl = document.querySelector('.location_item');
            if(locationItemEl === null) return;
            bs.boxObserver.observe(lbListEl);
            bs.boxObserver.observe(locationItemEl);
        },
        /**
         * 내부요소 리사이즈감시 제거
         */
        disconnect(){
            const bs = EasyCharger.bottomSheet;
            bs.boxObserver.disconnect();
            bs.boxObserver.disconnect();
        }
    },
    phInput: {
        /**
         * place holder input 초기화
         */
        init(){
            this.keyDown();
            this.update();
        },
        /**
         * ph_group 요소 초기화
         */
        update(){
            $('.ph_group .form_control').each((_,t)=>{
                this.valueSet($(t));
            });
            $('.ph_group .ph_masking .form_control').each((_,t)=>{
                $(t).val('*'.repeat(Number($(t).attr('data-txt-num'))));
                this.maskingSet($(t));
                this.valueSet($(t));
            });
        },
        /**
         * input value체크후 버튼 disabled
         * @param {element} $this - 제이쿼리 this
         */
        valueSet($this){
            const $phGroup = $this.closest('.ph_group');
            if($this.val() === ''){
                $phGroup.removeClass('is_val');
            } else {
                $phGroup.addClass('is_val');
            }
        },
        /**
         * input 마스킹처리
         */
        maskingSet($this){
            const $phGroup = $this.closest('.ph_group');
            const valNum = $this.val().length;
            $this.attr('data-txt-num',valNum);
            $phGroup.find('.ph_txt .ph_val').text('*'.repeat(valNum));
        },
        /**
         * keyDown시 valueSet함수호출
         */
        keyDown(){
            $(document).on('input','.ph_group .form_control',(e)=>{
                const $this = $(e.currentTarget);
                this.valueSet($this);
            });
            $(document).on('input','.ph_group .ph_masking .form_control',(e)=>{
                const $this = $(e.currentTarget);
                this.maskingSet($this);
            });
        },
    },
    innerScroll: {
        /**
         * 내부스크롤 영역 초기화
         */
        init(){
            this.update();
        },
        /**
         * 내부스크롤 영역 simplebar로 교체
         */
        update(){
            if(!fn.exists('.inner_scroll')) return;
            $('.inner_scroll').each((_,t)=>{
                if($(t).closest('.fbs_area').length){
                    EasyCharger.bottomSheet.simplebar = new SimpleBar(t,{autoHide: false});
                }else{
                    new SimpleBar(t,{autoHide: false});
                }
            });
        }
    },
    swiper: {
        init(){
            this.swiperGallery();
            this.swiperEventBnr();
            this.swiperTab();
        },
        /**
         * swiper_gallery 클래스요소 swiper 생성
         */
        swiperGallery(){
            if(!fn.exists('.swiper_gallery')) return;
            if($('.swiper_gallery .swiper-slide').length === 1) $('.swiper_gallery').addClass('only_one');
            let swiperGallery = new Swiper(".swiper_gallery", {
                navigation: {
                    nextEl: ".swiper_gallery .swiper-button-next",
                    prevEl: ".swiper_gallery .swiper-button-prev",
                },
            });
        },
        /**
         * swiper_evnet_bnr 클래스요소 swiper 생성
         */
        swiperEventBnr(){
            if(!fn.exists('.swiper_evnet_bnr')) return;
            let swiperEventBnr = new Swiper(".swiper_evnet_bnr", {
                loop: true,
                pagination: {
                    el: ".swiper_evnet_bnr .swiper-pagination",
                    clickable: true,
                },
            });
        },
        swiperTab(){
            if(!fn.exists('.swiper_tab')) return;
            let swiperTab = new Swiper(".swiper_tab", {
                slidesPerView: "auto",
            });
            $(document).on('click','.swiper_tab button.tab_btn',(e)=>{
                const $this = $(e.currentTarget);
                const $swiperTabWrap = $this.closest('.swiper_tab_wrap');
                const idx = $this.closest('.swiper-slide').index();
                $this.closest('.swiper-slide').siblings('.swiper-slide').find('.tab_btn').removeClass('active');
                $this.addClass('active');
                $swiperTabWrap.find('.swiper_tab_pannel').removeClass('active').eq(idx).addClass('active')
            })
        },
    },
    dummy: {
        init(){
            this.fltg();
            this.backFtr();
        },
        /**
         * fltg_ftr 요소 공간만큼 fltg_dummy 높이 채움
         */
        fltg(){
            if(!fn.exists('.fltg_ftr_wrap')) return;
            if(!fn.exists('.fltg_dummy')){
                $('.home_body, .back_body, .step_body').append('<div class="fltg_dummy"></div>');
            }
            let fltgFtrHgt = $('.fltg_ftr').outerHeight();
            $('.fltg_dummy').css({'height': `${fltgFtrHgt}px`});
            let box_observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    fltgFtrHgt = $('.fltg_ftr_wrap').outerHeight();
                    $('.fltg_dummy').css({'height': `${fltgFtrHgt}px`});
                }
            });
            const fltgFtrEl = document.querySelector('.fltg_ftr');
            box_observer.observe(fltgFtrEl);
        },
        backFtr(){
            if(!fn.exists('.back_ftr.observer .btn_area')) return;
            let fltgFtrHgt = $('.back_ftr .btn_area').outerHeight();
            $('.back_ftr').css({'height': `${fltgFtrHgt}px`});
            let box_observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    fltgFtrHgt = $('.back_ftr .btn_area').outerHeight();
                    $('.back_ftr').css({'height': `${fltgFtrHgt}px`});
                }
            });
            const fltgFtrEl = document.querySelector('.back_ftr .btn_area');
            box_observer.observe(fltgFtrEl);
        }
    },
    notification: {
        /**
         * notification html 구조 세팅
         */
        set(msg,type='gray',du=5){
            const $notif = $(`
                <div class="notification type_${type}">
                    <span class="txt">${msg}</span>
                </div>
            `);
            this.get($notif,du);
        },
        /**
         * notification 화면에 뿌려주기
         * @param {HTMLDivElement} $notif - 생성된 notification 요소
         */
        get($notif,du){
            let $notifArea = $('.notification_area');
            if(!fn.exists('.notification_area')) $body.append(`<div class="notification_area"></div>`);
            $notifArea = $('.notification_area');
            $notifArea.append($notif);
            let tl = gsap.timeline();
            tl
            .to($notif,{y:-10,autoAlpha:1})
            .to($notif,{delay:du,autoAlpha:0})
            .add(()=>{$notif.remove()});
        }
    },
    clipboard: {
        init(){
            this.set();
        },
        /**
         * 클립보드 생성
         */
        set(){
            if(!fn.exists('.copy_btn')) return;
            new ClipboardJS('.copy_btn');
        }
    },
    valChk: {
        init(){
            this.update();
            this.keyDown();
        },
        /**
         * val_chk 클래스가 있으면 set 실행
         */
        update(){
            $('.input_group.val_chk .form_control').each((_,t)=>{
                this.set($(t));
            });
        },
        /**
         * value 체크후 is_val클래스 추가 및 제거
         */
        set($this){
            const $inputGroup = $this.closest('.input_group');
            if($this.val() === ''){
                $inputGroup.removeClass('is_val');
            } else {
                $inputGroup.addClass('is_val');
            }
        },
        /**
         * 값변경시 체크
         */
        keyDown(){
            $(document).on('input','.input_group.val_chk .form_control',(e)=>{
                const $this = $(e.currentTarget);
                this.set($this);
            });
        },
    },
    datepicker : function(){
        $(".datepicker").datepicker({
            dateFormat: "yy-mm-dd", // 날짜의 형식
            minDate: 0,
            nextText: ">",
            prevText: "<"
        });
        $(".startDate").datepicker({
            dateFormat: "yy-mm-dd", // 날짜의 형식
            minDate: 0,
            nextText: ">",
            prevText: "<",
            onSelect: function (date) {
                var type = $(this).data('type');
                var endDate = $('.endDate[data-type=' + type + ']');
                var startDate = $(this).datepicker('getDate');
                var minDate = $(this).datepicker('getDate');
                endDate.datepicker('setDate', minDate);
                startDate.setDate(startDate.getDate() + 30);
                endDate.datepicker('option', 'maxDate', startDate);
                endDate.datepicker('option', 'minDate', minDate);
            }
        });
        $('.endDate').datepicker({
            dateFormat: "yy-mm-dd", // 날짜의 형식
            nextText: ">",
            prevText: "<"
        });
    },
    chooseTab: {
        init(){
            this.click();
        },
        /**
         * 해당번째 탭 활성화
         */
        click(){
            $(document).on('click','.choose_tab',(e)=>{
                const $this = $(e.currentTarget);
                const idx = $this.index();
                const $chooseTabHdr = $this.closest('.choose_tab_hdr');
                const $chooseTabCont = $chooseTabHdr.siblings('.choose_tab_cont');
                $chooseTabHdr.find('.choose_tab').removeClass('active').eq(idx).addClass('active');
                $chooseTabCont.find('.choose_item').removeClass('active').eq(idx).addClass('active');
            });
        },
    },
    aside: {
        init(){
            this.menu();
        },
        /**
         * 사이드바 이벤트
         */
        menu(){
            $(document).on('click','.fltg_btn',(e)=>{
                const $this = $(e.currentTarget);
                if(!fn.exists($this.find('.ico_menu'))) return;
                $('.aside').toggleClass('active');
                $this.closest('.fltg_item').toggleClass('active').siblings('.fltg_item').removeClass('active');
            });
            $(document).on('click','.aside .back_btn',(e)=>{
                const $this = $(e.currentTarget);
                $('.aside').removeClass('active');
                $('.fltg_item').removeClass('active');
            });
        },
    },
    acco: {
        init(){
            this.toggle();
        },
        /**
         * 아코디언 토글 이벤트
         */
        toggle(){
            $(document).on('click','.acco_item .toggle_btn',(e)=>{
                const $this = $(e.currentTarget);
                const $accoItem = $this.closest('.acco_item');
                const isActive = $accoItem.hasClass('active');
                $accoItem.toggleClass('active');
                $accoItem.find('.acco_body').stop().slideToggle(450);
                if(isActive){
                    $this.attr({'aria-label':'내용열기','aria-expanded':false});
                } else {
                    $this.attr({'aria-label':'내용닫기','aria-expanded':true});
                }
            });
        },
    },
    handleBtnAct: function(){
        let typeBox = $('.type_box');
        
        if (typeBox) {
            typeBox.on('click', (e)=>{
                let $t = $(e.currentTarget);

                $t.addClass('active').siblings().removeClass('active');
            })
        }
    },
}
$(()=>{
    $window = $(window);
    $html = $('html');
    $body = $('body');
    EasyCharger.init();
});
