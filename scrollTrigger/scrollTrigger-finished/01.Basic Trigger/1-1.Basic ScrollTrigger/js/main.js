


// scrollTrigger 설정
//  1. tween 안에 연결
const tween = gsap.to('.tiger',{
  x:500,
  rotation:360,
  duration:3,
  // scrollTrigger:{
  //   trigger:'.tigerSection',
  //   start:'10% center', // default 'top(trigger) bottom(viewport)'
  //   end:'30% 10%', // default 'bottom(trigger) top(viewport)'
  //   markers:true, 
  //   id:'tiger'// scrolltrigger 고유 식별자, markers에 이름 남길 수 있다.
  // }
})



  //  2. 생성자로 만들어서 
ScrollTrigger.create({
  trigger:'.tigerSection',
  start:'top center',
  end:'bottom center',
  markers:true,
  animation: tween, // 컨트롤할 트윈 참조
          //       enter  leave enterback leaveback
  toggleActions: 'restart pause reverse pause'
})








