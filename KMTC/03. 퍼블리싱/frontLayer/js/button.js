$(function () {
    $('.seg_item .more_btn').mouseover(function(){
        $(this).parents('.seg_item').addClass('active');
        console.log("ononnon")
    });
    $('.seg_item .more_btn').mouseleave(function(){
        $(this).parents('.seg_item').removeClass('active');
    });
    let menuIndex = 0;
    const indicatorTxt = $('.indicator_item').eq(1).text();
    $('.menu_lnb > ul > li').each(function(index, item){ 
        let menuLnbTxt = $(item).children('a').text();
        if(indicatorTxt == menuLnbTxt ){
            menuIndex = index;
        }
    });
    $(".btn_menu").click(function (e) {
        e.preventDefault();
        $("#menu").show();
        $("#menu").addClass("active");
        $("#menu").addClass("open");
        $('#menu .menu_lnb > ul > li > a').removeClass('active');
        $('#menu .menu_lnb > ul > li').find('.menu_contents').removeClass('show');
        $('#menu .menu_lnb > ul > li > a').eq(menuIndex).addClass('active');
        $('#menu .menu_lnb > ul > li').eq(menuIndex).find('.menu_contents').addClass('show');
        setTimeout(function () {
            $('#menu .menu_lnb > ul > li').eq(menuIndex).find('.menu_contents').addClass('active');
        }, 10);
        $('html, body').addClass("hidden");
        $('body').css("paddingRight", fn.getScrollBarWidth());
        $('#menu .btn_close').delay(500).fadeIn(450);
    });
    $("#menu .btn_close").click(function (e) {
        e.preventDefault();
        $('#menu .menu_lnb > ul').removeClass('mo_active');
        $('.search_modal').removeClass('active');

        setTimeout(function () {
            $("#menu").removeClass("open");
            $('.menu_contents').removeClass('active');
            $('#menu .btn_close').fadeOut(450);
        }, 10);

        setTimeout(function () {
            $("#menu").hide();
            $("#menu").removeClass("active");
            $('#menu .menu_lnb ul a').removeClass('active');
            $('.menu_contents .menu_column').removeClass('show');
            $('html, body').removeClass("hidden");
            $('body').css("paddingRight", 0);
        }, 900);
    });
    $("#menu .btn_search").click(function (e) {
        e.preventDefault();
        $('#menu .menu_lnb > ul').toggleClass('mo_active');
        $('.search_modal').toggleClass('active');
    });
    $("#menu .menu_lnb > ul > li > a").click(function (e) {
        e.preventDefault();
        menuIndex = $(this).parent('li').index();

        $('#menu .menu_lnb > ul > li > a').removeClass('active');
        $('#menu .menu_lnb > ul > li > a').eq(menuIndex).addClass('active');
        $('#menu .menu_lnb > ul').removeClass('mo_active');
        $('.search_modal').removeClass('active');

        $('.menu_contents .menu_column').removeClass('show');
        $('#menu .menu_lnb > ul > li').find('.menu_contents').removeClass('show');
        $('#menu .menu_lnb > ul > li').eq(menuIndex).find('.menu_contents').addClass('show');
        $('#menu .menu_lnb > ul > li').eq(menuIndex).find('.menu_contents').addClass('active');
    });
    $('.column_list > h2 > a').click(function(e){
        if($(this).parent('h2').siblings('ul').length){
            e.preventDefault();
            $(this).parents('.column_list').toggleClass('show');
            $(this).parents('.column_list').find('ul').toggleClass('show');
        }
    });
    $("#header .btn_search").click(function (e) {
        e.preventDefault();
        $(this).siblings('.search_input').toggle()
        $(this).toggleClass('active');
    });

});