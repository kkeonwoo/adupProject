fn = {
    init() {
        fn.chkDevice();
        fn.ie();
    },
    chkDevice() {
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
    exists(target) {
        return ($(target).length > 0);
    },
    ie() {
        if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
            window.location = 'microsoft-edge:' + window.location;
            setTimeout(function () {
                window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
            }, 1);
        }
    },
    setCookie(name, value, expirehours) {
        let todayDate = new Date();
        todayDate.setHours(todayDate.getHours() + expirehours);
        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
    },
    getScrollBarWidth() {
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
    getWindowWidth() {
        return $(window).outerWidth() + fn.getScrollBarWidth() ;
    },
    getWindowHeight() {
        return $(window).outerHeight();
    },
    getTargetWidth() {
        return $(target).outerWidth() + fn.getScrollBarWidth() ;
    },
    getTargetHeight() {
        return $(target).outerHeight();
    },
    getScrollTop(target) {
        return $(target).scrollTop();
    },
    getOffsetTop() {
        return $(target).offset().top;
    },
    getDate(date) {
        let dayOfWeek = new Date(date).getDay();
        return dayOfWeek;
    },
    addHidden() {
        $('html, body').addClass("hidden");
        if(window.innerHeight > $('#wrapper').outerHeight()) return;
        $('body').css("paddingRight", fn.getScrollBarWidth());
        // $('.fixed').css("transform", `translate3d(-${fn.getScrollBarWidth()}px, 0,0)`);
    },
    removeHidden() {
        $('html, body').removeClass("hidden");
        $('body').css("paddingRight",0);
        // $('.fixed').css("transform", `translate3d(0,0,0)`);
    },
    currentScroll() {
        let currentScrollPoint = Number(($(window).scrollTop() / ($(document).height() - $(window).height()) * 100).toFixed(2));
        return currentScrollPoint;
    },
}
fn.init();
  