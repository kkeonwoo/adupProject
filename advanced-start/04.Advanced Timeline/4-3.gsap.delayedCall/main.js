

// 타임라인 자체를 멈추고 다시 재생 시키는 방법은?

let tl = gsap.timeline()
.to('.orange',{duration:2,x:300})
.addPause('>', gsap.delayedCall, [2, () => tl.play()])
.to('.blue',{duration:2,x:300})

// const d = setTimeout(() => {
//     console.log('hello');
// }, 2000);

// clearTimeout(d);

// setTimeout 과 달리 tween이 반환되어 유용하게 활용 가능.
// const t = gsap.delayedCall(2, ()=> {
//     console.log('hello~');
// })

// t.kill();

console.log(t); // return tween

GSDevTools.create({animation:tl})