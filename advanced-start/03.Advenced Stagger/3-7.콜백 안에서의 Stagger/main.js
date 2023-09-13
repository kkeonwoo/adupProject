const l = 8 * 13;

for(let i = 0; i < l; i++){
  let template = /* html */`
    <div class="box"></div>
  `
  document.querySelector('.stage')?.insertAdjacentHTML('beforeend',template)

}

const tween = gsap.to('.box', {
  scale: 0.3,
  stagger: {
    each: 0.5,
    onStart() {
      console.log('start');
      const target = this.targets()[0];

      if (target.dataset.stop === "stop") {
        // 전체 타임라인에서 언제 재생을 시작할지 === startTime
        // 개별 트윈에 정확한 시작시간에 맞춰서 멈추게
        tween.pause(this.startTime());
      }
    }
  }
})

const stage = document.querySelector('.stage');

stage.addEventListener('click', (e) => {
  if ( e.target.matches('.box') ) {
    gsap.to(e.target, {
      backgroundColor: 'red',
      attr: {
        // key : value로 속성 설정 가능
        'data-stop' : 'stop'
      }
    })

    // e.target.setAttribute('data-stop', 'stop');
  }
})

// gsap.to('.tiger > div', {
//   y: 100,
//   stagger: {
//     each: 0.2,
//     repeat: 1,
//     yoyo:true,
//     // stagger 안에 callback 역시 각자 발생
//     // repeat: -1 일 때 onComplete를 사용할 수 없음 -> onRepeat
//     onComplete () {
//       // console.log(this.targets()[0]);
//       gsap.to(this.targets()[0], {
//         rotation: 360,
//       })
//     }
//   }
// })



// const { chars, lines, words } = new SplitText('.word > div')

// const tl = gsap.timeline();

// tl.from(chars, {
//   opacity: 0,
//   duration: 2,
//   stagger: {
//     each: 0.1,
//     from: 'random',
//     ease: 'power1',
//     onComplete() {
//       gsap.to(this.targets()[0], {
//         delay: 0.5,
//         duration: 0,
//         color: '#51ff00',
//       })
//     }
//   }
// })
// .to(lines, {
//   y: 30,
//   opacity: 0,
//   delay: 1,
//   stagger: {
//     each: 0.2,
//     from: 'end'
//   }
// })







