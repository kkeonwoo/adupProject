const h2 = document.querySelector('.section02 h2'); // 선택자 2번이상 반복되면 변수에 담는 게 좋다

gsap.to(h2, {
  x: 200,
  scrollTrigger: {
    trigger: '.section02',
    start: () => {
      // scrollTrigger는 resize할 때 변화된 값을 새로고침
      // tween은 아님. tween은 mathchsize? matchwidth로
      console.log('start~~!');
      return '20% center'
    },
    end: '80% center',
    markers:true,
    scrub: true, // 부드러운 스크롤 사용하면 boolen값을 적어도 애니메이션이 부드럽게 움직임
    onEnter: (self) => {
      console.log(self);
      h2.textContent = 'enter';
    },
    onLeave: () => {
      h2.textContent = 'leave';
    },
    onEnterBack: () => {
      h2.textContent = 'EnterBack';
    },
    onLeaveBack: () => {
      h2.textContent = 'LeaveBack';
    },
    onToggle: ({direction}) => {
      console.log(direction);

      if (direction === 1) { // down
        h2.style.color = 'red';
      } else { // up
        h2.style.color = 'blue';
      }
    },
    onRefresh: () => { // resize
      console.log('refresh!');
    },
    onUpdate: ({progress}) => {
      let percentage = Math.round(progress * 100);

      h2.textContent = `${percentage}%`;

      if (percentage > 50) {
        gsap.set('.section02', {backgroundColor: 'orange'})
      } else {
        gsap.set('.section02', {backgroundColor: 'blue'})
      }
    }
  }
})


markers();