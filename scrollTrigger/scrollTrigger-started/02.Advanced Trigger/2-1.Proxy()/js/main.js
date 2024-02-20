var Scrollbar = window.Scrollbar;

// Scrollbar.init(document.querySelector('#container'));

ScrollTrigger.create({
    trigger: '.section02',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
    markers: true,
    animation: gsap.to('.section02 h2', { xPercent: 500})
})





