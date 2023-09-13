
gsap.registerPlugin(GSDevTools, SplitText);



gsap.set('.stage',{autoAlpha:1})  

gsap.registerEffect({
    name:'textEffect',
    extendTimeline: true, // 타임라인 확장
    defaults: {
        y: -100,
        colors: ['red', 'orange'],
    },
    // defaults에 작성한 값은 config로 들어온다.
    effect: (target, config) => {
        const split = new SplitText(target, {type:'chars'})
        const tl = gsap.timeline();

        tl.from(split.chars, {y: config.y, opacity: 0, stagger: 0.05})
        .to(split.chars, {color: gsap.utils.wrap(config.colors)})

        return tl;
    }
})

// gsap.effects.textEffect('h1');
// gsap.effects.textEffect('h2', {y: 100,colors:['blue','green']}); // 특정 대상에 값을 수정할 때 오버라이드 가능

// 위 코드는 registerEffect에 등록된 타임라인처럼
// h1이 실행되고 h2가 실행되는 타임라인을 만들 수 없다.
// effect 안에서 정의된 tl을 return 해줘야 tl을 사용할 수 있다.

const animation = gsap.timeline(); // 페이지의 큰 타임라인

// animation.add(gsap.effects.textEffect('h1')) // add로 타임라인 추가
//          .add(gsap.effects.textEffect('h2', {y: 100,colors:['blue','green']}))

animation.textEffect('h1')
         .textEffect('h2',{y: 'random(-100, 100)', colors:['blue','green']});


