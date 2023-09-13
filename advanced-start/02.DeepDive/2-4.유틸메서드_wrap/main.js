
// gsap 객체 안에 wrap이라는 메서드를 사용
const { wrap } = gsap.utils; // 구조분해할당

gsap.to('.stage',{autoAlpha:1})

const split = new SplitText('h1', {type:'chars'})

const tl = gsap.timeline();

tl.from(split.chars, {
    y: wrap([100, -100]),
    opacity: 0,
    stagger: {
        each: 0.02,
        from: 'random'
    }
})
.to(split.chars, {
    x: 10,
    color: wrap(['red', 'blue', 'yellow']),
    stagger : {
        each: 0.02
    }
})

GSDevTools.create()