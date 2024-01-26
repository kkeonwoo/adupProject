function viewMore(e){
    $(e).toggleClass('on');
    $(e).next('.content').stop().slideToggle();
    if( $(e).hasClass('on') == true ){
    }
}