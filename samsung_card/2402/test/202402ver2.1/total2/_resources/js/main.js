$(document).ready(function () {
    $('.design_box .btn').on('click',function(e){
        e.preventDefault();
        $(this).closest('.design_box').find('.card_box').toggleClass('flipped');
    });
    $('.notice_area .notice_header .ttl').on('click', function (e) {
        const $this = e.target,
        $thisParent = $($this).closest('.notice_area');

        $($thisParent).toggleClass('on');
        $($thisParent).find('.notice_body').stop().slideToggle();
    })
});
