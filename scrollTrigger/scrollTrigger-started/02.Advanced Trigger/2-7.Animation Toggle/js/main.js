const dots = gsap.utils.toArray('.dot');
const text = gsap.utils.toArray('.lnb span');

gsap.utils.toArray('.section').forEach((section, idx) => {    
    const lnbAnimation = gsap.timeline()
    .to(dots[idx], { scale: 2})
    .to(text[idx], { 
        x: 50, 
        opacity: 1,
        color: idx === 1 && 'white'
    }, 0)

    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        animation: lnbAnimation,
        toggleActions: 'restart reverse restart reverse'
    })
});

ScrollTrigger.create({
    trigger: '.section02',
    start: 'top center',
    end: 'bottom center',
    // animation: gsap.to('.section02', {backgroundColor: 'black'}),
    // toggleActions: 'restart reverse restart reverse'
    onToggle: ({ isActive, animation }) => {
        // console.log(self.isActive); // boolean 반환
        // console.log(self.animation); // ScrollTrigger animation 트윈을 가지고 올 수 있음
        // animation.reversed(!isActive)

        gsap.to('.section02', { backgroundColor: isActive ? 'black' : 'white'})
    }
})

ScrollTrigger.create({
    trigger: '.scroll-content',
    start: 'top center',
    end: 'bottom center',
    animation: gsap.from('.progress', { scaleY: 0, transformOrigin: 'center top', ease: 'none'}),
    scrub: true
})






markers();




