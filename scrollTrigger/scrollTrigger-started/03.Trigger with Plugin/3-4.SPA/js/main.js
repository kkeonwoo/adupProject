// ScrollTrigger를 각 페이지 이동때마다 생성하여 무한으로 늘어나 리소스 문제 발생
barba.hooks.leave(()=> {
    ScrollTrigger.getAll().forEach(t => t.kill());
})

// scrollTrigger를 kill해서 제거하니 marker도 같이 사라져 위치를 못 잡음
barba.hooks.after(()=> { // 가장 마지막에 호출됨
    // 페이지 이동 후 스크롤 위치 수정
    scrollbar.update();
    scrollbar.scrollTo(0, 0);
    markers();
})

function pageLeave(target) {
    const tl = gsap.timeline()
    .to('h2', { y: 30})
    .to(target, { opacity: 0})

    return tl
}

function pageEnter(target) {
    const tl = gsap.timeline()
    .from('h2', { y: -30})
    .from(next.container, { opacity: 0})
}

function home() {
    ScrollTrigger.create({
        trigger: '.section03',
        start: 'top center',
        end: 'bottom center',
        animation: gsap.to('.box', { x: 300}),
        markers: true,
        scrub: true,
    })
}

function about() {
    ScrollTrigger.create({
        trigger: '.section03',
        start: 'top center',
        end: 'bottom center',
        animation: gsap.to('.box', { x: 200, rotation: 360}),
        markers: true,
        scrub: true,
    })
}

function contact() {
    ScrollTrigger.create({
        trigger: '.section03',
        start: 'top center',
        end: 'bottom center',
        animation: gsap.to('.box', { y: 100, rotation: 180}),
        markers: true,
        scrub: true,
    })
}

barba.init({
    views: [ // 각 페이지 별 실행시켜야할 js 코드
        { namespace: 'home', beforeEnter: () => home() },
        { namespace: 'about', beforeEnter: () => about() },
        { namespace: 'contact', beforeEnter: () => contact() }
    ],
    transitions: [
        {
            name: 'opacity-transition', // 지정 안해도 상관 없음
            // leave, enter 훅
            leave({current}) {
                // data : { current: 현재페이지, next: 다음페이지}
                // current.container => data-barba="container"
                // return gsap.to(current.container, { opacity: 0}) // leave에선 return을 해줘야 나가는 애니메이션이 자연스러움
                pageLeave(current.container);
            },
            enter({next}) {
                pageEnter(next.container)
            },
            once:() => markers()
        }
    ]
})

// markers();
// scrollTrigger의 marker는 항상 scrollTrigger가 생성된 이후에 실행이 되어야 제대로 된 위치가 잡힘.
// barba.js의 beforeEnter는 dom이 생성된 이후에 실행되는 함수
// 따라서 markers(); 가 먼저 호출이 되어 위치를 못잡음



















