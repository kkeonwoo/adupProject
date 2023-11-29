function viewMore(e){
    $(e).toggleClass('on');
    $(e).next('.content').stop().slideToggle();
}