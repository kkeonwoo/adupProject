let split;
// killAll 시키고 새로 다시 실행하기 위해서
// split을 다시 감싸기 위해 함수로 관리
function init() {
    split = new SplitText('p', { type: 'lines'});
    const splitCover = new SplitText('p', { type: 'lines', linesClass: 'cover'});

    split.lines.forEach((line, idx) => {
        
        ScrollTrigger.create({
            trigger: splitCover.lines[idx],
            start: 'top 90%',
            end: 'bottom center',
            animation: gsap.from(line, {
                    opacity: 0,
                    filter: 'blur(10px)',
                    y: 300,
                    transformOrigin: '50% 50% -50',
                    rotateX: -180,
            }),
            // animation: gsap.from(line, {  => from 트윈을 사용하여
            //     opacity: 0,
            //     filter: 'blur(10px)',
            //     y: 300 => y 값을 움직이는 애니메이션을 설정 시
            // }),
            // 1. trigger로 애니메이션이 동작하기 전에 y만큼 이동해 있어서 정확한 위치에 trigger가 작동하지 않음.
            // 2. text 애니메이션을 만들 땐 부모를 감싸서 부모에 trigger를 설정하고
            // 3. text에 애니메이션을 주는 게 정확하게 나올 수 있음.
            markers: true,
            scrub: true,
        })
        
    });
}

// split text 반응형 만들기
// 1. split text 요소를 모두 unwrap 시켜야 함.
//  - 줄바꿈을 기준으로 다시 wrap 해야하기 때문
//  - split.revert() : html 요소를 원래 상태로 되돌림
// 2. scrollTrigger도 없애줘야 함
//  - ScrollTrigger.getAll().forEach((item) => {
//      item.kill();
//    })

function killAll() {
    split.revert();
    ScrollTrigger.getAll().forEach(item => item.kill());
    init(); // resize 시 killAll하고 다시 생성
}

// 여러번 실행하는 이벤트는 성능문제가 발생
// throttle : 사용자가 이벤트를 실행하고 있는 중간에 해당 시간 초에 맞춰서 호출
// debounce : 사용자가 이벤트를 막 끝마쳤을 때 한 번 호출
// setTimeout : 일정시간이 지나면 실행되는 콜백함수. id 값을 반환. id 값으로 clearTimeout
// const id = setTimeout(() => {
//     console.log('hi')
// }, 5000);
// clearTimeout(id);

// 디바운스 동작과정
// 최초 실행 : timeOut을 콜스택에 저장
// 두번 실행 : clearTimeout으로 콜스택에 timeOut을 삭제시키고 다시 등록
// 결국 마지막 timeOut만 설정해둔 시간이 지난 후에 한 번만 실행됨

const debounce = (callback, time = 500) => {
    let timeOut;

    return function(...args) {
        timeOut = setTimeout(() => {
            callback.apply(this, args)
        }, time);
    }
}

window.addEventListener('resize', debounce(killAll, 1000));
window.addEventListener('load', init);
