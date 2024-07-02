$(function(){
    $('.notice_area .notice_header .ttl').on('click', function (e) {
        const $this = e.target,
        $thisParent = $($this).closest('.notice_area');

        $($thisParent).toggleClass('on');
        $($thisParent).find('.notice_body').stop().slideToggle();
    })
});

$(window).on('load',function(){
    const tabLink = document.querySelectorAll('.tab a');
    tabLink.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            $(window).off('scroll');

            const sectionId = link.getAttribute('href');
            const parentLi = this.parentElement;
            const siblings = parentLi.parentElement.querySelectorAll('li');
            siblings.forEach(sibling => {
                sibling.classList.remove('active');
            });
            parentLi.classList.add('active');

            const section = document.querySelector(`${sectionId}`);
            if (section) {
                const paddingTop = parseFloat(window.getComputedStyle(section).paddingTop);
                const offT = section.getAttribute('id') === 'section02' ? section.offsetTop + paddingTop : section.offsetTop;
                $('html, body').stop().animate({
                    scrollTop: offT
                },function(){
                    $(window).on('scroll',fixedTab);
                });
            }
        });
    });

    function fixedTab() {
        const currentScrollTop = window.scrollY;
        const sections = document.querySelectorAll('.section');

        sections.forEach((section, index) => {
            const nextSection = sections[index + 1];
            const isLastSection = index === sections.length - 1;
            const isSectionVisible = section.offsetTop <= currentScrollTop && (isLastSection || nextSection.offsetTop > currentScrollTop);

            if (isSectionVisible) {
                const tabLink = document.querySelector(`.tab a[href="#${section.id}"]`);
                if (tabLink) {
                    const parentLi = tabLink.closest('li');
                    if (parentLi) {
                        const siblings = parentLi.parentElement.querySelectorAll('li');
                        siblings.forEach(sibling => {
                            sibling.classList.remove('active');
                        });
                        parentLi.classList.add('active');
                    }
                }
            }
        });

        const tab = document.querySelector('.tab');
        const tabInner = document.querySelector('.tab_inner');

        tabInner.classList.toggle('fixed', window.scrollY >= tab.offsetTop);
    }


    $(window).scroll(function() {
        fixedTab();
    }).scroll();
})