const tl = gsap.timeline();

const duration = 0.5;
const numberOfTargets = gsap.utils.toArray('.utils > div').length;
const pause = 1.5;
const stagger = duration + pause; // each가 duration보다 크면 차이만큼 pause 되는 시간 발생
const delay = (stagger * (numberOfTargets - 1)) + pause;
// pause, duration을 따로 작성하면 유지보수, 디테일한 설정 가능

gsap.set('.utils > div', { transformOrigin: '50% 50% -50'})

tl.from('.utils > div', {
    rotationX: -90,
    opacity: 0,
    duration: duration,
    stagger: {
        each: stagger,
        repeat: -1,
        repeatDelay: delay // repeatDelay = duration * (numberOfTargets - 1)
    },
})
.to('.utils > div', {
    rotationX: 90,
    opacity: 0,
    duration: duration,
    stagger: {
        each: stagger,
        repeat: -1,
        repeatDelay: delay
    }
}, stagger)


