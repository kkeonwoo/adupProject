$(document).ready(function () {
    $('.sec1 .card_item .btn').on('click',(e)=>{
        e.preventDefault();
        const $this = $(e.currentTarget);
        const $card = $this.closest('.card_item').find('.card');
        if($card.hasClass('flipped')) {
            $this.text('뒷면보기');
        } else {
            $this.text('앞면보기');
        }
        $(e.currentTarget).closest('.card_item').find('.card').toggleClass('flipped');
    });

    // const $coorTarget = $('.sec1');
    // coorFn();
    // $(window).scroll(()=>{
    //     coorFn();
    // });

    // function coorFn(){
    //     let scrollTop = $(window).scrollTop();
    //     let coordinate = $coorTarget.offset().top + $coorTarget.outerHeight();

    //     if(scrollTop + window.innerHeight > coordinate){
    //         $('.float_area').addClass('fixed');
    //     } else {
    //         $('.float_area').removeClass('fixed');
    //     }
    // }
});