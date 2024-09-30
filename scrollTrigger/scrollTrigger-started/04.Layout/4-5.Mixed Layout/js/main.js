// 가로,세로 믹스 레이아웃에선 가속도 없애야
gsap.defaults({ease:'none'})

const sections = gsap.utils.toArray('.horizontal .section');

const tween = gsap.to(sections, {
    x: () => {
        const wrapper = document.querySelector('.horizontal');

        return -(wrapper.offsetWidth - innerWidth)
    }
})

ScrollTrigger.create({
    trigger: '.section02',
    start: 'top top',
    end: '+=3000',
    animation: tween,
    pin: true,
    scrub: true,
})

const boxEnd = gsap.getProperty('.h-section02', 'width')
const boxWidth = gsap.getProperty('.box', 'width')

ScrollTrigger.create({
    trigger: '.h-section02',
    start: 'left left',
    end: `+=${boxEnd - boxWidth}`,
    animation: gsap.to('.box', {
        x: (_, t) => {
            return boxEnd - t.offsetWidth
        },
        // rotation: 360
    }),
    containerAnimation: tween,
    horizontal: true,
    scrub: true,
})




markers();
