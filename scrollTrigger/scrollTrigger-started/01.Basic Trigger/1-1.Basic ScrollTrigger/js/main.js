let tiger = document.querySelector('.tiger');

ScrollTrigger.create({
    trigger: '.tigerSection',
    start: 'top center',
    end: 'bottom center',
    markers: true,
    animation: gsap.to(tiger, { x: 500, rotate: 360, duration: 3}),
    toggleActions: 'restart pause reverse pause'
})


