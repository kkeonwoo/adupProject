// scroll library -> smooth scroll bar
// 1. 기본적으로 스크롤을 하기 위해선 컨테이너가 컨텐츠보다 작아야함
//  - 컨테이너에 사이즈가 정해져있어야 한다는 의미. 스크롤이 생겨야하니깐
// - 스무스스크롤바를 사용하면 .scroll-content로 컨텐츠를 랩핑
// - scrollbar-track 으로 컬러 사이즈 커스텀 가능
// - 동작원리
//      1. 스크롤하면 transform: translate()로 애니메이션
//      2. document.documentElement.scrollTop으로 html 스크롤 변화를 감지할 수 없음

// - smooth scrollbar를 사용하면 scrolltrigger가 실행이 안됨
// - html의 스크롤 높이가 변하지 않아서
// - 그래서 scrollerProxy로 스크롤을 입혀줘야함

gsap.registerPlugin(ScrollTrigger);

const scrollElement = [
    {
        target: document.querySelector('#container'),
        scrollName: null,
        marker: 'main'
    },
    {
        target: document.querySelector('.deep'),
        scrollName: null,
        marker: 'deep'
    },
]

const options = {
    damping: 0.08, // 부드러운 정도 ( 0.1 ~ -0.05 사이 적합)
    alwaysShowTracks: true, // 항상 스크롤 보이게 설정
}

scrollElement.forEach((elem) => {
    elem.scrollName = Scrollbar.init(elem.target, {...options});

    ScrollTrigger.scrollerProxy(elem.target, {
        scrollTop(value) {
            if(arguments.length) {
                elem.scrollName.scrollTop = value; // setter
            }
            return elem.scrollName.scrollTop; // getter
        }
    });

    elem.scrollName.addListener(ScrollTrigger.update);
})



// const scrollbar = Scrollbar.init(container, {...options});
// const deppScrollbar = Scrollbar.init(deep, {...options});

// ScrollTrigger.scrollerProxy(container, {
//     scrollTop(value) {
//         if(arguments.length) {
//             scrollbar.scrollTop = value; // setter
//         }
//         return scrollbar.scrollTop; // getter
//     }
// });

// ScrollTrigger.scrollerProxy(deep, {
//     scrollTop(value) {
//         if(arguments.length) {
//             deppScrollbar.scrollTop = value; // setter
//         }
//         return deppScrollbar.scrollTop; // getter
//     }
// });

// 스크롤할 때 발생하는 이벤트
// window.addEventListener('scroll', () => {})
// scrollbar.addListener((e) => {console.log(e);});
// scrollbar.addListener(ScrollTrigger.update);
// deppScrollbar.addListener(ScrollTrigger.update);
// ScrollTrigger.defaults({scrolller:container});
// ScrollTrigger.refresh => 초기화
// ScrollTrigger.update => 주기적으로 값을 반환

ScrollTrigger.create({
    trigger: '.section02',
    start: 'top center',
    end: 'bottom center',
    scroller: scrollElement[0].target,
    animation: gsap.to('.section02 h2', {x: 500}),
    markers: true,
    scrub: true,
    id: scrollElement[0].marker,
});

ScrollTrigger.create({
    trigger: '.d2',
    start: 'top center',
    end: 'bottom center',
    scroller: scrollElement[1].target,
    animation: gsap.to('.text', {x: 200}),
    markers: true,
    scrub: true,
    id: scrollElement[1].marker,
});

scrollElement.forEach((elem) => {
    if(document.querySelector('.gsap-marker-scroller-start')) {
        const markers = gsap.utils.toArray(`[class *= "marker-${elem.marker}"]`);
    
        elem.scrollName.addListener(({offset}) => {
            gsap.set(markers, {marginTop: -offset.y})
        });
    };
})
