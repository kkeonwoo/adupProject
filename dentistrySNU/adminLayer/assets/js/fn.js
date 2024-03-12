fn = {
    init: function () {
        fn.chkBrowser();
        fn.ie();
        $(".layout-wrapper").addClass("loaded");
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
    exists: function (target) {
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
}