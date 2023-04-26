fn = {
    init: function () {
        fn.chkDevice();
        fn.ie();
    },
    chkDevice: function () {
        'use strict';
        if (/Android/i.test(navigator.userAgent)) {
            $("html").removeClass("pc_device").addClass("mobile_device");
            $("body").addClass("android_device");
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            $("html").removeClass("pc_device").addClass("mobile_device");
            $("body").addClass("ios_device");
        } else {
            $("html").removeClass("mobile_device").addClass("pc_device");
        }
        $(window).resize(function () {
            $("html").removeClass("pc-device");
            if (/Android/i.test(navigator.userAgent)) {
                $("html").removeClass("pc_device").addClass("mobile_device");
                $("body").addClass("android_device");
            } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                $("html").removeClass("pc_device").addClass("mobile_device");
                $("body").addClass("ios_device");
            } else {
                $("body").removeClass("ios_device android_device");
                $("html").removeClass("mobile_device").addClass("pc_device");
            }
        });
    },
    exists : function(target){
        return ($(target).length > 0);
    },
    ie: function () {
        if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
            window.location = 'microsoft-edge:' + window.location;
            setTimeout(function () {
                window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
            }, 1);
        }
    },
    setCookie : function(name, value, expirehours){
        let todayDate = new Date();
        todayDate.setHours(todayDate.getHours() + expirehours);
        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
    },
    getScrollBarWidth : function(){
        if(!fn.exists('#fullpage')){
            $('body').append('<div id="fakescrollbar" style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"></div>');
            fakeScrollBar = $('#fakescrollbar');
            fakeScrollBar.append('<div style="height:100px;">&nbsp;</div>');
            let w1 = fakeScrollBar.find('div').innerWidth();
            fakeScrollBar.css('overflow-y', 'scroll');
            let w2 = $('#fakescrollbar').find('div').html('html is required to init new width.').innerWidth();
            fakeScrollBar.remove();
            return (w1-w2);
        }
        return 0;
    },
    getWindowWidth: function(){
        return $(window).outerWidth() + fn.getScrollBarWidth() ;
    },
    getWindowHeight: function(){
        return $(window).outerHeight();
    },
    getTargetWidth: function(target){
        return $(target).outerWidth() + fn.getScrollBarWidth() ;
    },
    getTargetHeight: function(target){
        return $(target).outerHeight();
    },
    getScrollTop: function(target){
        return $(target).scrollTop();
    },
    getOffsetTop: function(target){
        return $(target).offset().top;
    },
    getDate: function(date){
        let dayOfWeek = new Date(date).getDay();
        return dayOfWeek;
    },
    addHidden: function(){
        $('html, body').addClass("hidden");
        // $('body').css("paddingRight", fn.getScrollBarWidth());
        // $('.fixed').css("transform", `translate3d(-${fn.getScrollBarWidth()}px, 0,0)`);
    },
    removeHidden: function(){
        $('html, body').removeClass("hidden");
        // $('body').css("paddingRight",0);
        // $('.fixed').css("transform", `translate3d(0,0,0)`);
    },
    showToastCartAdd: function(el){
        $('body').append(`
            <div class="toast_card ${el === 'aside' &&'right'}">
                <i class="ico ico_cart_add"></i>
                <span class="txt">
                    장바구니에 상품을<br/>
                    담았습니다
                </span>
            </div>
        `);
        $('.toast_card').delay(1000).fadeOut(100).queue(function() { $(this).remove(); });
    },
    showToastStar: function(el){
        $('body').append(`
            <div class="toast_card ${el === 'aside' &&'right'}">
                <i class="ico ico_star"></i>
                <span class="txt">
                    관심상품을<br/>
                    등록 했습니다
                </span>
            </div>
        `);
        $('.toast_card').delay(1000).fadeOut(100).queue(function() { $(this).remove(); });
    },
    showToastStarRemove: function(el){
        $('body').append(`
            <div class="toast_card ${el === 'aside' &&'right'}">
                <span class="txt">
                    관심상품을<br/>
                    삭제하시겠습니까?
                </span>
                <div class="d_flex gap_px_20">
                    <button type="button" class="btn btn_outline_secondary btn_sm close_btn">취소</button>
                    <button type="button" class="btn btn_danger btn_sm remove_btn">삭제</button>
                </div>
            </div>
        `);
    },
}