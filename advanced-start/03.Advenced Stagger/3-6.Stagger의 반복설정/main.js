const l = 8 * 13;

for(let i = 0; i < l; i++){
  let template = /* html */`
    <div class="box" data-index="${i}"></div>
  `
  document.querySelector('.stage')?.insertAdjacentHTML('beforeend',template)
  
}

gsap.to('.box', {
  duration: 1,
  scale: 0.2,
  ease: 'power4.out',
  stagger: {
    repeat: -1,
    yoyo: true,
    each: 0.1,
    from: 'center',
    grid: 'auto', // 그리드 자체를 인식해서 전체가 하나처럼 움직인다.
    // axis: 'x', // x, y축을 기준으로만 애니메이션을 줄 수 있다.
  }
})

// gsap.to('.tiger > div', {
//   y: 100,
//   // repeat: -1, 전체 트윈 애니메이션이 끝나면 반복 
//   // yoyo: true,
//   stagger: {
//     each: 0.5,
//     repeat: -1, // 각자 애니메이션이 끝나자마자 반복
//     yoyo: true,
//   }
// })


















