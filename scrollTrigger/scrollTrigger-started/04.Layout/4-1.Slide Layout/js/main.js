const tl = gsap.timeline();

gsap.utils.toArray('.section').forEach((section, index) => {
    
    if(!section.classList.contains('section01')) {

        tl.from(section, { xPercent: index % 2 ? -100 : 100})

    }
})

// const tl = gsap.timeline()
// .from('.section02', { xPercent: 100})
// .from('.section03', { xPercent: -100})
// .from('.section04', { xPercent: 100})

ScrollTrigger.create({
    trigger: '.wrapper',
    start: 'top top',
    end: '+=4000',
    animation: tl,
    pin: true,
    // pinSpacing: false,
    markers: true,
    scrub: true,
})





markers()

