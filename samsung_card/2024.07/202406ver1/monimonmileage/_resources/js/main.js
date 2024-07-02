function viewMore(e){
    $(e).toggleClass('off');
    $(e).next('.content').stop().slideToggle();
}

$(function(){
    $('.tab > a').on('click', function(e){
        e.preventDefault();
        const idx = $(this).index();

        $(this).addClass('active').siblings().removeClass('active');
        $('.tab_content > div').hide();
        $('.tab_content_0'+(idx+1)).show();
    });
});