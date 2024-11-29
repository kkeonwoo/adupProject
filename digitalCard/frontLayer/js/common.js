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
        this.switchInfo();
        this.handleTab();
        this.handleQRClick();
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
    handleQRClick: function() {
        $(document).on('click', '.info-box .qr-code', (e)=>{
            const $this = $(e.currentTarget);
            const $infoWrap = $this.closest('.info-wrap');
            $infoWrap.toggleClass('full-width');
        })
        $(document).on('click', '.info-btn-area .btn-info.user', (e) => {
            const $this = $(e.currentTarget);
            const $infoWrap = $this.closest('.info-wrap');
            if($infoWrap.hasClass('full-width')) {
                $infoWrap.removeClass('full-width');
            }
        })
    },
}
$(()=>{
    $window = $(window);
    $html = $('html');
    $body = $('body');
    EasyCharger.init();
});
