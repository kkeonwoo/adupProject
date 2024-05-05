var uiStyle;

$(function(){
    uiStyle = {
        ST: null,
        init: function(){
            $('.pageTab').length > 0 && uiStyle.pageTab.init(); //pageTab
            $('.tableWrap').length > 0 && uiStyle.tableAccessibility.init(); // 테이블 summary, caption 관리
            $('.btnWrap.fixed, .btnWrap.spaceFixed').length > 0 && uiStyle.pageFixBtn();
            $('.accordionList').length > 0 && uiStyle.caseAccordion.init(); // 아코디언 타입별
            $('.accordionCheck').length > 0 && uiStyle.checkAccordion.init(); //아코디언 체크박스
            $('.moreToggle').length > 0 && uiStyle.moreToggle.init(); //확장 토글
            $('.clauseMenuWrap').length > 0 && uiStyle.clauseMenu.init();
            $('.checkInpLink').length > 0 && uiStyle.checkInpLink.init(); // 체크박스 선택시 입력창 활성화
            $('.fullLayer').length > 0 && uiStyle.fullLayer.init();
            $('.layerpop').length > 0 && uiStyle.defalutLayer.init();
            $('.formBox.inputUnderLine').length > 0 && uiStyle.inpDel.init();
            $('.contBox').length > 0 && uiStyle.addTitle.init(); //접근성 title추가
            $('.inner.type02').length > 0 && uiStyle.addTitle02.init(); //접근성 title추가
            $('.bankInfo').length > 0 && uiStyle.addTitleDl.init(); //접근성 title추가
        },
        pageTab : {
            init:function() {
                var _this = this;

                var offsetL = $(".pageTab ul li.on").offset().left;
                $(".pageTab ul li.on").find('a').attr('title','선택됨');

                _this.handler();
            },
            handler : function() {
                var $tab = $('.pageTab'),
                    tabList = $tab.find('ul li');

                tabList.find('a').on("click", function() {
                    var $this = $(this).parent(),
                        idx = $this.index(),
                        offsetLeft = $(this).offset().left;

                    $(this).attr('title','선택됨').parent().addClass('on').siblings().removeClass('on').find('a').attr('title','');
                    $tab.find('>ul').animate({"scrollLeft": offsetLeft} , 300);
                });
            }
        },
        fullLayer: { //
            init: function() {
                var _this = this;

                var layerBtn = $('.fullLayer'),
                    layerClose = $('.fullLayerWrap .popClose');

                layerBtn.on('click', function(e) {
                    _this.openLayer($(this).attr('href'));
                });

                layerClose.on('click', function(e) {
                    _this.closeLayer($(this).parents('.fullLayerWrap').attr('id'));
                });

            },
            openLayer : function(tar) {
                $(tar).fadeIn(300).addClass('open').focusin();
                $('body').addClass('scrolloff').append('<div class="dim"></div>');
                uiStyle.getScrollTop();
            },
            closeLayer:function(tar){
                $('#'+tar).fadeOut(100).focusout().removeClass('open');
                $('body').removeClass('scrolloff');
                $('.dim').remove();
                uiStyle.setScrollTop();
            }
        },
        defalutLayer : {
            init : function() {
                var _this = this;

                var layer = $('.layerpop'),
                    close = $('.layerwrap .close');

                layer.off().on("click", function() {
                    $('body').addClass('scrolloff');
                    uiStyle.getScrollTop();
                });

                close.off().on("click", function() {
                    $('body').removeClass('scrolloff');
                    uiStyle.setScrollTop();
                });
            }
        },
        inpDel : {
            init : function() {
                var _this = this;

                _this.delBtn();

            },
            delBtn : function() {
                var inputWrap = $('.formBox.inputUnderLine'),
                    input = inputWrap.find('input');


                input.on('keyup', function() {
                    if ( $(this).val().length > 0) {
                        $(this).siblings('.btnTxtReset').fadeIn(150);
                    } else {
                        $(this).siblings('.btnTxtReset').fadeOut(150);
                    }
                });

                input.on('focusin', function() {
                    if ( $(this).val().length > 0) {
                        $(this).siblings('.btnTxtReset').fadeIn(150);
                    }
                });

                input.on('focusout', function() {
                    $(this).siblings('.btnTxtReset').fadeOut(150);
                });

                $('.btnTxtReset').on("click", function(e) {
                    e.preventDefault();
                    $(this).siblings('input').val('');
                });
            }
        },
        tagUpdate : function() {
            $(document).on('click', '.sbtn' , function() {
                if ( $(this).find('.icon').hasClass('updateWhite') || $(this).find('.icon').hasClass('update') ) {
                    $(this).find('.icon').addClass('rotate')
                };

                setTimeout(function() {
                    $('.sbtn .icon').removeClass('rotate');
                },550);
            });
        },
        clauseMenu : {
            init : function() {
                var _this = this;

                _this.Agreemenu();
            },
            Agreemenu : function() {
                var menu = $('.clauseMenuWrap'),
                    menuList = menu.find('.clauseList'),
                    menuBtn = menu.find('.btnMenu');

                $(document).on("click", '.btnMenu' , function() {
                    var menuList = $(this).siblings('.clauseList');
                    if ( menuList.hasClass('open')) {
                        $(this).attr('title', '메뉴 열기');
                        menuList.fadeOut(300).removeClass('open');
                        $('.dim').remove();
                    } else {
                        $(this).attr('title', '메뉴 닫기');
                        menuList.fadeIn(150).addClass('open').append('<div class="dim"></div>');
                    }
                });

                $(document).on("click", '.clauseList .dim' , function() {
                    menuBtn.attr('title', '메뉴 열기');
                    menuList.fadeOut(300).removeClass('open');
                    $(this).remove();
                });

                $(document).on("click", ".clauseList > ul > li > a" , function() {
                    var $this = $(this).parent();
                    if ( $this.hasClass('active') ) {
                        $this.removeClass('active').find('.sub').slideUp();
                        $(this).attr('title', '하위메뉴 열기');
                    } else {
                        $this.addClass('active').find('.sub').slideDown();
                        $(this).attr('title', '하위메뉴 닫기');
                    }
                });
            }
        },
        moreToggle: {
            init : function() {
                var _this = this;

                _this.handler();
            },
            handler : function() {
                var $wrap = $('.moreToggle');

                $(document).on("click", ".btnToggle", function() {
                    if ( $(this).hasClass('open')) {
                        $(this).removeClass('open').attr('title', '영역 펼치기').parents('.moreToggle').find('.toggleCont').slideUp(400);
                    } else {
                        $(this).addClass('open').attr('title', '영역 닫기').parents('.moreToggle').find('.toggleCont').slideDown(400);
                    }
                });
                $wrap.each(function() {
                    var moreBtn = $(this).find('.btnToggle');
                    if(moreBtn.hasClass('open') ){ // 페이지진입시 조건검색이 열려있어야하는 경우 .btnToggle에 .open 추가
                        moreBtn.addClass('open').attr('title', '영역 닫기').parents('.moreToggle').find('.toggleCont').slideDown(0);
                    }
                })

            }
        },
        caseAccordion : {
            init: function() {
                var _this = this;

                $('.acc_title').find('span').text('메뉴펼쳐보기');
                $('.acc_title.acc_open').parent().addClass('active').find('.acc_title > span').text('메뉴숨기기');

                _this.caseType();

            },
            caseType: function() {
                var acc = $('.accordionList');

                $('.acc_title').on('click', function() {
                    var $this = $(this),
                        thisAcc = $this.parents('.accordionList');

                    if ( !$this.find('.acc_title').hasClass('acc_open') && !$this.hasClass('disabled')) {
                        if ( !$this.parent().hasClass('active')) {
                            if ( thisAcc.hasClass('targetJS')) { // targat만
                                $this.parent().addClass('active').siblings('li').removeClass('active').find('.acc_title').removeClass('acc_open');
                            } else {
                                $this.parent().addClass('active');
                            }
                        } else {
                            $this.parent().removeClass('active');
                        }
                    }
                });
            }
        },
        checkAccordion : {
            init: function () {
                var acc = $('.accordionCheck');
                acc.on("change", 'input', function () {
                    var _this = $(this);
                    if(_this.prop("checked")){
                        _this.parents('dt').next().find('.showbox').show();
                        $('.formBox.inputUnderLine').length > 0 && uiStyle.inpDel.init(); //val 삭제
                    }else{
                        _this.parents('dt').next().find('.showbox').hide();
                    }
                });
            }
        },
        tableAccessibility: {
            strArr: [],
            init: function(){

                var _this = this

                    _this.set();

            },
            set: function(){
                var _str = uiStyle.tableAccessibility.strArr;

                $('.tableWrap').each(function(i){

                    $('.tableWrap').eq(i).find('th').each(function(n, items){

                        _str.push($(this).text());

                        if($('.tableWrap').eq(i).find('th').length - 1 == n){

                            _str = uiStyle.arrFiltering(_str)

/*
                            _str = _str.filter(function(item) {
                                  return item !== null && item !== undefined && item !== '';
                            });
*/
                            $('.tableWrap').eq(i).find('table').attr('summary', _str + '으로 구성').find('caption').text(_str + '으로 구성');
                            _str = [];

                        };

                    });

                });
            }
        },
        addTitle: {
            strArr: [],
            init: function(){

                var _this = this

                    _this.set();

            },
            set: function(){
                var _str = uiStyle.addTitle.strArr;

                $('.contBox').each(function(i){

                    $('.contBox').eq(i).find('h4').each(function(n, items){

                        _str.push($(this).text());

                        if($('.contBox').eq(i).find('h4').length - 1 == n){

                            _str = uiStyle.arrFiltering(_str)

                            $('.contBox').eq(i).find('.formBox select, .formBox input').attr('title', _str);
                            _str = [];

                        };

                    });

                });
            }
        },
        addTitle02: {
            strArr: [],
            init: function(){

                var _this = this

                    _this.set();

            },
            set: function(){
                var _str = uiStyle.addTitle02.strArr;

                $('.inner.type02').each(function(j){

                    $('.inner.type02').eq(j).find('div.title').each(function(n, items){

                        _str.push($(this).text());

                        if($('.inner.type02').eq(j).find('div.title').length - 1 == n){

                            _str = uiStyle.arrFiltering(_str)

                            $('.inner.type02').eq(j).find('.cont .formBox select, .cont .formBox input').attr('title', _str);
                            _str = [];

                        };

                    });

                });
            }
        },
        addTitleDl: {
            strArr: [],
            init: function(){

                var _this = this

                    _this.set();

            },
            set: function(){
                var _str = uiStyle.addTitleDl.strArr;

                $('.bankInfo').each(function(i){

                    $('.bankInfo').eq(i).find('dt').each(function(n, items){

                        _str.push($(this).text());

                        if($('.bankInfo').eq(i).find('dt').length - 1 == n){

                            _str = uiStyle.arrFiltering(_str)

                            $('.bankInfo').eq(i).find('dd .agreeCheck label').attr('title', _str);
                            _str = [];

                        };

                    });

                });
            }
        },
        arrFiltering: function(v){

            return v = v.filter(function(item) {
                        return item !== null && item !== undefined && item !== '';
                    });

        },
        pageFixBtn : function() {
            var fixBtn = $('.btnWrap.fixed'),
                spaceFixbtn = $('.btnWrap.spaceFixed');

            if ( fixBtn.length != 0) {
                fixBtn.closest('.container').addClass('hasFixedBtn');
            } else if ( spaceFixbtn.length != 0) {
                spaceFixbtn.closest('.container').addClass('hasSpaceFixedBtn');
            }
        },
        checkInpLink : {
            init: function () {
                var chk = $('.checkInpLink');
                chk.on("change", 'input', function () {
                    var tar = $(this).attr('target-single'),
                        dou = $(this).attr('target-double');
                    if($(this).prop("checked")){
                        $(this).parents(chk)
                            .find('.formBox .'+tar+', .formBox .'+dou+'')
                            .attr('disabled',false)
                        ;
                    }else{
                        var inptrue = $(this).parents(chk).find('.formBox .'+tar).attr('disabled',true).focusout();
                        inptrue;
                        if( $(this).parents(chk).find('.double').length > 0 ){
                            var same = $(this).parents(chk).find('.double input:checked').length;
                            if( same === 0) $(this).parents(chk).find('.formBox .'+dou).attr('disabled',true).focusout();
                        }
                        if( $(this).parents(chk).find('.sub').length > 0 ){
                            var sub = $(this).parents(chk).find('.sub input:checked').length;
                            if( sub === 0){
                                inptrue;
                            }else{
                                $(this).parents(chk)
                                    .find('.formBox.sub .'+tar)
                                    .attr('disabled',false)
                                ;
                            }
                        }
                    }
                });
            }
        },
        getScrollTop: function(){ // scroll top 값 가져오기
            this.ST = $(window).scrollTop();
        },
        setScrollTop: function(){ // scroll top 위치로 보내기
            $(window).scrollTop(this.ST);
        },
    }

    uiStyle.init();
    common_ui.init(); //..

});