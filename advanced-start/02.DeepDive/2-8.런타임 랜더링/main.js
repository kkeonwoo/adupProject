const tl = gsap.timeline({
    defaults: {
        duration: 1,
    }
});

tl.from('.orange', {opacity: 0, y: 50})
.from('.pink', {opacity:0, y: -50})
.from('.blue', {opacity:0, scale: 1.2})
.from('.orange', {opacity:0, immediateRender: false}) // 같은 대상에 같은 값을 주었을 때 발생
// 마지막 orange는 이전에 발생한 애니메이션의 값을 기억하고 있음.
// 그래서 opacity: 0을 기억
// immediateRender: true 기본값
// 앞에 orange에서 0 -> 1로 끝난 값을 기억하게 됨




GSDevTools.create()