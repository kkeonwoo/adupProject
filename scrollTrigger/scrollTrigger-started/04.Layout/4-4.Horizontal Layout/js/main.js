gsap.defaults({ease: 'none'})

// 방법 1.
// wrapper 전체 가로로 밀기
// const horizontal = gsap.to('.wrapper', {
//     x: (_, t) => {
//         return -(t.scrollWidth - innerWidth);
//     }
// })

// ScrollTrigger.create({
//     trigger: '.hero',
//     start: 'top top',
//     end: () => '+=' + innerHeight * 2,
//     animation: horizontal,
//     pin: true,
//     markers: true,
//     scrub: true,
// })


// 방법 2.
// 각 section 밀기
const sections = gsap.utils.toArray('.section');

const tween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    scrollTrigger: {
        trigger: '.hero',
        end: () => '+=' + innerWidth * 2,
        pin: true,
        scrub: 1,
    }
})

ScrollTrigger.create({
    trigger: '.section02',
    start: 'left center',
    end: 'right center',
    horizontal: true, // 수평
    containerAnimation: tween, // tween을 기준으로 애니메이션
    animation: gsap.to('.box', { rotation: 360}),
    markers: true,
    scrub: true,
})



markers()

