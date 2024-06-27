const theme = {
  primary: "#6067f3",
  secondary: "#e8e2da",
};

const keywords = ['Jeju', 'Yang-yang', 'Mokpo', 'Busan']

function fixedHeader() {

  ScrollTrigger.create({
    trigger: '.nav_container',
    start: 'top top',
    // pin을 많이 주면 endTrigger의 위치를 못잡는 경우 발생.
    // max는 최대 스크롤의 위치를 주는 키워드
    // 비동기 처리로 pin 요소들이 다 로드된 후 실행하게 해도 됨
    end: 'max', 
    // endTrigger: '.footer',
    pin: true,
    pinSpacing: false,
  })
}

function changeTheme(mode = 'light') {
  const tween = gsap.to('body, .nav_container', { 
    backgroundColor: mode === 'light' ? theme.secondary : theme.primary,
    color: mode === 'light' ? theme.primary : theme.secondary
  })

  return tween
}

function heroAnimation() {

  gsap.set('.logo', {
    width:'100%',
    yPercent: -90,
  })

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom 20%',
    animation: gsap.to('.logo', {width:'12%', yPercent: 0}),
    scrub: true,
  })

}

function textAnimation() {

  gsap.utils.toArray('.header_text-wrap').forEach((txt, idx) => {
    const target = txt.querySelector('.header_text-move');

    ScrollTrigger.create({
      trigger: txt,
      start: 'top center',
      end: 'bottom center',
      animation: gsap.fromTo(target, { x: idx % 2 ? innerWidth : -innerWidth}, { x: 0}),
      scrub: true,
    })
  });

}

function maskAnimation() {

  const circleTween = gsap.timeline()
    .to('.circle_element', { width: innerWidth, height: innerHeight, borderRadius: 0 })
    .add(changeTheme(), 0)

  ScrollTrigger.create({
    trigger: '.circle_wrap',
    start: 'top top',
    end: 'bottom top',
    animation: circleTween,
    pin: true,
    scrub: true,
  })

}

function categoryAnimation() {

  const tween = gsap.from('.categories_link', { opacity: 0, filter: 'blur(3px)', stagger: { each: .2, from: 'random' } })

  ScrollTrigger.create({
    trigger: '.catories_container',
    start: 'top top',
    end: 'bottom top',
    animation: tween,
    pin: true,
    scrub: true,
  })

}

function galleryAnimation() {
  
  ScrollTrigger.create({
    trigger: '.text_container',
    start: 'top top',
    end: 'bottom bottom',
    endTrigger: '.image_container',
    animation: gsap.to('.front_image', { yPercent: -20}),
    pin: true,
    pinSpacing: false,
    scrub: true,
    onUpdate: ({progress}) => {
      let ratio = Math.round(progress * 100);
      let idx = 0;
      let mode = 'light';

      if (ratio > 0 && ratio < 25) {
        idx = 0;
        mode = 'light'
      } else if (ratio >= 25 && ratio < 50) {
        idx = 1;
        mode = 'dark'
      } else if (ratio >= 50 && ratio < 75) {
        idx = 2;
        mode = 'light'
      } else if (ratio >= 75 && ratio <= 100) {
        idx = 3;
        mode = 'dark'
      }
      
      changeTheme(mode);
      document.querySelector('.text_container span').textContent = keywords[idx]
    }
  })
}

fixedHeader();
heroAnimation();
textAnimation();
maskAnimation();
categoryAnimation();
galleryAnimation();

// ScrollTrigger.create({
//   trigger: '.hero',
//   start: 'top top',
//   end: '70% top',
//   animation: gsap.fromTo('.logo', { y: -200, width: 1200 }, { y: 0, width: 180 }),
//   // markers: true,
//   scrub: true,
// })

// const heroAnimation = gsap.timeline()
//   .from('.header_text-wrap:nth-child(1)', { x: -innerWidth })
//   .from('.header_text-wrap:nth-child(2)', { x: innerWidth })
//   .from('.header_text-wrap:nth-child(3)', { x: -innerWidth })
//   .from('.header_text-wrap:nth-child(4)', { x: innerWidth })

// ScrollTrigger.create({
//   trigger: '.visual_container',
//   start: 'top-=30% top',
//   end: 'bottom center',
//   endTrigger: '.header_text',
//   animation: heroAnimation,
//   // markers: true,
//   scrub: true,
// })

// const circleAnimation = gsap.timeline()
//   .to('.circle_element', { width: '100%', height: '100%', borderRadius: 0 })
//   .to('body', { backgroundColor: '#e8e2da' }, '<')

// ScrollTrigger.create({
//   trigger: '.circle_wrap',
//   start: 'top top',
//   end: 'bottom top',
//   animation: circleAnimation,
//   pin: true,
//   markers: true,
//   scrub: true,
// })

// const categoryAnimation = gsap.from('.categories_link', { opacity: 0, filter: 'blur(10px)', stagger: { each: .2, from: 'random' } })

// ScrollTrigger.create({
//   trigger: '.catories_container',
//   start: 'top top',
//   end: 'bottom top',
//   animation: categoryAnimation,
//   pin: true,
//   pinSpacing: true,
//   markers: true,
//   scrub: true,
// })


markers();
