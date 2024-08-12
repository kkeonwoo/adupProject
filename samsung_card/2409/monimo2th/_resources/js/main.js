function viewMore(e){
    $(e).toggleClass('off');
    $(e).next('.content').stop().slideToggle();
}

$(function(){
    $('.tab > .tab_btn').on('click', function(e){
        e.preventDefault();
        const idx = $(this).index();

        $(this).addClass('active').siblings().removeClass('active');
        const $tabArea = $(this).closest('.tab_area');
        $tabArea.find('.tab_content > div').hide();
        $tabArea.find('.tab_content_0'+(idx+1)).show();

        if($(this).closest('.event_all_area').length){
            // ScrollTrigger.refresh();
            $('html, body').stop().animate({
                // scrollTop: $('.event_all_area .event_card').eq(idx).offset().top - $('.event_tab_pin').height() - 1
                scrollTop: $('.event_all_area .event_card').eq(idx).offset().top + 3
            }, 800);
        }
    });

    ScrollTrigger.create({
        trigger: '.event_tab_pin',
        start: () => `top top`,
        endTrigger : '.event_all_area',
        end: () => 'bottom center',
        pin: true,
        pinSpacing: false,
    });

    function event1On(){
        $('.event_tab_pin a').eq(0).addClass('active')
        $('.event_tab_pin a').eq(1).removeClass('active')
    }
    function event2On(){
        $('.event_tab_pin a').eq(1).addClass('active')
        $('.event_tab_pin a').eq(0).removeClass('active')
    }

    ScrollTrigger.create({
        trigger: '.event_card1',
        start: () => `top top`,
        endTrigger : '.event_card2',
        end: () => 'top top',
        onEnter: () => event1On(),
        onEnterBack : () => event1On(),
    });

    ScrollTrigger.create({
        trigger: '.event_card2',
        start: () => `top top`,
        end: () => 'bottom bottom',
        onEnter: () => event2On(),
    });
});