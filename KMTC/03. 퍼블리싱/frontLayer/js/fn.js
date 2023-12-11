fn = {
    init: function () {
        fn.chkBrowser();
        $("#wrap").addClass("loaded");
        fn.headerFixed();
    },
    chkBrowser: function () {
        'use strict';
        if (/Android/i.test(navigator.userAgent)) {
            $("body").addClass("aos-device");
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            $("body").addClass("ios-device");
        } else {
            $("html").addClass("pc-device");
        }
        $(window).resize(function () {
            $("html").removeClass("pc-device");
            if (/Android/i.test(navigator.userAgent)) {
                $("body").addClass("aos-device");
            } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                $("body").addClass("ios-device");
            } else {
                $("body").removeClass("ios-device aos-device");
                $("html").addClass("pc-device");
            }
        });
    },
    exists : function(target){
        return ($(target).length > 0);
    },
    getScrollBarWidth : function(){
        if($(document).height() > $(window).height()){
            $('body').append('<div id="fakescrollbar" style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"></div>');
            fakeScrollBar = $('#fakescrollbar');
            fakeScrollBar.append('<div style="height:100px;">&nbsp;</div>');
            var w1 = fakeScrollBar.find('div').innerWidth();
            fakeScrollBar.css('overflow-y', 'scroll');
            var w2 = $('#fakescrollbar').find('div').html('html is required to init new width.').innerWidth();
            fakeScrollBar.remove();
            return (w1-w2);
        }
        return 0;
    },
    getWindowWidth: function(){
        return $(window).outerWidth() + fn.getScrollBarWidth() ;
    },
    getWindowHeight: function(){
        return $(window).height();
    },
    getTargetWidth: function(target){
        return $(target).outerWidth() + fn.getScrollBarWidth() ;
    },
    getTargetHeight: function(target){
        return $(target).height();
    },
    getScrollTop: function(target){
        return $(target).scrollTop();
    },
    getOffsetTop: function(target){
        return $(target).offset().top;
    },
    fullHeight: function(){
        let full_height = fn.getWindowHeight();
        $(".full_height").height(full_height);
        $(".double_height").height(full_height * 2);
    },
    textCount: function(target){
        let characterCount = $(target).val().length,
            maximum = $(target).attr('maxlength');
        $(target).parents('.sec_group').find('.count_box .txt').text(`[${characterCount}자 / ${maximum}자]`)
        if ($(target).val().length > maximum) {
            $(target).val($(target).val().substring(0, maximum));
        }
    },
    headerFixed: function(){
        let scrollTop = $(document).scrollTop();
        if (scrollTop > 0) {
            $("#header").addClass("fixed");
        } else {
            $("#header").removeClass("fixed");
        }
        
        if (fn.exists('#mobileHeader')) {
            console.log("Steset")
            if (scrollTop > 0) {
                $("#mobileHeader").addClass("fixed");
            } else {
                $("#mobileHeader").removeClass("fixed");
            }
        }
    }
}