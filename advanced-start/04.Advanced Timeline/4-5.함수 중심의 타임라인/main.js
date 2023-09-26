const $ = e => document.querySelector(e)

const orange = $('.orange')
const blue = $('.blue')
const pink = $('.pink')
const green = $('.green')
const quote = $('.quote')

// text plugin
// replace DOM Element's text
gsap.registerPlugin(TextPlugin);

gsap.set([green,quote],{y:120})
gsap.defaults({
  duration:1
})

function tigerAnimation() {
  const orangeAnimation = gsap.timeline()
  .to(orange,{scale:2})
  .to(orange,{rotation:360})
  .to(orange,{scale:1})
  
  const blueAnimation = gsap.timeline()
  .to(blue,{scale:2})
  .to(blue,{rotation:360})
  .to(blue,{scale:1})
  
  const pinkAnimation = gsap.timeline()
  .to(pink,{scale:2})
  .to(pink,{rotation:360})
  .to(pink,{scale:1})

  return [orangeAnimation, blueAnimation, pinkAnimation]
}

// 배열 구조 분해 할당
const [orangeA, blueA, pinkA] = tigerAnimation();


function quoteAnimation(message) {
  const tl = gsap.timeline()
  .set(quote, {text: message})
  .to([green,quote],{y:0,stagger:0.2,repeat:1,yoyo:true,repeatDelay:1})

  return tl // 함수로 관리하려면 내보내줘야함
}

const master = gsap.timeline()
.add(orangeA)
.add(quoteAnimation('orange tiger!'))
.add(blueA)
.add(quoteAnimation('blue tiger!'))
.add(pinkA)
.add(quoteAnimation('pink tiger!'))











