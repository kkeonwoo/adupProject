const mm = gsap.matchMedia();

const options = {
    isMobile : '(max-width: 500px)',
    isDesktop : '(min-width: 501px',
    reduceMotion: '(prefers-reduced-motion: reduce)'
}

const checkbox = document.querySelector('#motionToggle');

checkbox.checked = window.matchMedia('(prefers-reduced-motion: reduce)').matches // matches = 요소가 있는지 체크
checkbox.addEventListener('change', gsap.matchMediaRefresh)

mm.add(options, (ctx) => {
    let {isMobile, isDesktop, reduceMotion} = ctx.conditions;

    // checkbox 체크 유무로 reduceMotion 값 설정
    reduceMotion = checkbox.checked;

    if(!reduceMotion) {
        ScrollTrigger.create({
            trigger: '.section03',
            start: 'top center',
            end: 'bottom center',
            animation: gsap.to('.orange', { rotaiton: 360}),
            pin: false,
            pinSpacing: false,
            markers: true,
            scrub: true,
        })
    }

    // gsap.to('.box', {
    //     scale: reduceMotion ? 1 : isMobile ? 4 : 10,
    //     rotation: 360,
    //     yoyo: true,
    //     repeat: -1,
    //     duration: 1
    // })
})








markers()

