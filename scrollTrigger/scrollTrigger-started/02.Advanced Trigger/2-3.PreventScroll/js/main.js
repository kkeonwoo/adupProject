const tl = gsap.timeline({
    defaults: {
        duration: 3,
        ease: 'power3.inOut' // 고급스러운 애니메이션 사이트에 자주 사용
    },
    // onComplete: () => {
    //     console.log('complete');
    // }
})
.from('.image_container > div', { 
    x: innerWidth,
    stagger: {
        amount: 0.5
    },
})
.to('.image_container > div', {
    y: innerHeight * 0.2,
    stagger: {
        amount: 0.5,
        from: 2
    },
}, '-=1.5')
.from('.text_container .elem', {
    y: 30,
    opacity: 0,
    stagger: {
        each: 0.2,
        ease: 'power3.inOut'
    },
    duration: 1,
}, '-=2')

tl.eventCallback('onComplete', () => {
    gsap.set('#no-scroll', { display: 'none' })
})

ScrollTrigger.create({
    trigger: '.section01',
    start: 'top top',
    end: 'bottom top',
    animation: gsap.to('.image_container', { x: -innerWidth * 0.5}),
    scrub: true,
})

// 스크롤 막는 방법
// 1. position: fixed에 width, height 100의 dom 요소를 만든다.
// 2. 애니메이션이 끝나면 display: none으로 스크롤 되게 만든다.












markers()



