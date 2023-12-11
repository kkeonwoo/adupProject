$(function () {
    fn.init();
   

});
$(document).ready(function () {
    if (fn.exists('#fullpage')) {
        $('#fullpage').fullpage({
            // sectionsColor: ['#C63D0F', '#1BBC9B', '#7E8F7C','#333'],
            responsiveWidth: 1200,
            responsiveHeight : 768,
            // navigation: true,
            // navigationPosition: 'right',
            // anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage', 'lastPage'],
            scrollOverflow: true,
            autoScrolling:true,
            keyboardScrolling: true,
            css3: true
        });
    }

    window.addEventListener('scroll', (e) => {
        fn.headerFixed();
    });
});
$(window).on('load', function () {
    // AOS.init({
    //     offset: 300,
    //     duration: 700
    // });
});