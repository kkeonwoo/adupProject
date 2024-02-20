const split = new SplitText('h3');

const tl = gsap.timeline()
.from('.tiger', { duration: 1, scale: 0, rotation: 360})
.from(split.chars, { duration: 4, opacity: 0, y: 60, stagger: 0.2})

ScrollTrigger.create({
    trigger: '.banner',
    pin: true,
    scrub: 1,
    markers:true,
    start: 'top center',
    end: '200% center',
    animation: tl,
})

ScrollTrigger.create({
    trigger: '.section03',
    pin: true,
    scrub: 1,
    markers: true,
    start: 'top',
    end: '+=2000',
    animation: gsap.to('.section03 h2', { rotation: 360,})
})



