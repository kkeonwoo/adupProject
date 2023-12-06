function viewMore(e){
    $(e).toggleClass('off');
    $(e).next('.content').stop().slideToggle();
}