const sections = document.querySelectorAll('section');

sections.forEach((section, idx) => {
    const w = section.querySelector('.wrapper');

    if (w) {
        let [x, xEnd] = idx % 2 ? ['100%', (w.scrollWidth - window.outerWidth) * -1] : [-w.scrollWidth, 0];

        gsap.fromTo(w, { x }, {
            x: xEnd,
            scrollTrigger: {
                trigger: section,
                scrub: 1,
            }
        })
    }
})

const tl = gsap.timeline({
    defaults: {
        ease: 'none'
    }
})
.from('.awsome .text',{x:innerWidth})
.to('.awsome .text', { scale: 50, xPercent: -200})
.to('body', { duration:0.3, backgroundColor: '#000'}, '-=.5')

ScrollTrigger.create({
    trigger: '.awsome',
    scrub: 1,
    pin: true,
    end: '+=3000',
    markers: true,
    animation: tl
})

ScrollTrigger.create({
    trigger: '.try',
    pin: true,
    scrub: 1,
    end: '+=2000',
    markers: true,
    animation: gsap.from('.try .text', { opacity: 0, y: 100})
})