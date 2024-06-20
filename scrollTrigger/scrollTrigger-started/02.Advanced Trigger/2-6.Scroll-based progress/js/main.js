const progress = document.querySelector('.progress')

ScrollTrigger.create({
    trigger: '.progressHolder',
    // 'top ' top 뒤에 띄워쓰기를 해줘야 인식한다.
    start: 'top ' + (document.querySelector('.section01').offsetHeight - 150),
    endTrigger:'.section03', // endPoint 타겟 지정
    end: 'bottom bottom', // 설정한 endTrigger 기준 bottom bottom이 된다
    animation: gsap.to(progress, { scaleX: 1, ease: 'none'}),
    once: true, // scrollTrigger를 kill. 애니메이션이 끝나지 않으면 계속 동작하지만 끝나면 더이상 실행되지 않는다
    onUpdate: ({progress}) => {
        document.querySelector('.percent span').textContent = Math.round(progress * 100)
    },
    pin: true,
    scrub: true,
    markers: true,
    id: 'pro' // getById를 통해 스크롤 트리거를 가져올 수 있음
})

const circle = document.querySelector('.circleContainer circle')
const rect = document.querySelector('.rectContainer rect')
const circleLength = circle.getTotalLength() + 1;
const rectLength = rect.getTotalLength() + 1;

gsap.set(circle, {
    strokeDashoffset: circleLength,
    strokeDasharray: circleLength,
})
gsap.set(rect, {
    strokeDashoffset: rectLength,
    strokeDasharray: rectLength,
})

const progressSVG = gsap.timeline({
    defaults: {
        strokeDashoffset: 0, 
        ease: 'none'
    }
})
.to(circle, {})
.to(rect, {}, '<')

ScrollTrigger.create({
    trigger: '.scroll-content',
    start: 'top top',
    end: 'bottom bottom',
    animation: progressSVG,
    markers: true,
    scrub: true,
})














markers()


