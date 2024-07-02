$(document).ready(function () {
    $('.event_notice_area .event_notice_hdr .btn_toggle').on('click', function (e) {
        const $this = e.target,
        $thisParent = $($this).closest('.event_notice_area');

        $($thisParent).toggleClass('on');
        $($thisParent).find('.event_notice_bdy').stop().slideToggle();
    })

    $('.card_info_item .btn').on('click',(e)=>{
        e.preventDefault();
        const $this = $(e.currentTarget);
        const $card = $this.closest('.card_info_item').find('.card');
        if($card.hasClass('flipped')) {
            $this.text('뒷면보기');
        } else {
            $this.text('앞면보기');
        }
        $(e.currentTarget).closest('.card_info_item').find('.card').toggleClass('flipped');
    });
});
