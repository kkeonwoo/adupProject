const $ = (node) => document.querySelector(node);
const tiger = $('#tiger');
const button = $('#button');
const progress = $('#progressSlider');
const time = $('#time');
// const route = $('#route');
// console.log(route.getTotalLength());
// gsap.fromTo(route,
//     { strokeDashoffset: route.getTotalLength(), duration: 4},
//     { strokeDashoffset: 0, duration: 4}
// )
gsap.to('#mPath', { 
    strokeDashoffset: 0,
    duration: 4,
    
})
const animation = gsap.to(tiger, { 
    x:100,
    duration: 6,
    motionPath: {
        path:'#route',
        align: "#route",
        alignOrigin: [.5, .5]
    },
    // 지속적 호출 -> 애니메이션이 재생 될 때
    onUpdate: update,
    onComplete: () => {
        button.textContent = 'play';
    }
});

function update() {
    time.textContent = animation.time().toFixed(2);
    progress.value = animation.progress();
}

progress.addEventListener('input', (e) => {
    const target = e.currentTarget;
    
    button.textContent = 'play';

    // input 값을 조절할 땐 애니메이션이 멈추도록
    animation.progress(target.value).pause(); // 매서드 체이닝
})

function setButtonState() {
    button.textContent = animation.paused() ? 'play' : 'pause';
}

button.addEventListener('click', () => {
    animation.paused(!animation.paused());

    if (animation.progress() === 1) {
        animation.restart();
    }

    setButtonState();
})

// animation.pause();
// animation.paused(); // getter
// animation.paused(true); // setter

// console.log(animation);
// console.log(animation.pause()); // tween 객체를 반환
// console.log(animation.paused()); // pause된 상태인지 아닌지 return 값이 있는.

// animation.reversed();
// console.log(animation.reversed());

// animation.timeScale(2); // 배속. duration을 조절하지 않고 속도 조절. 1 미만은 slow / 1 이상 fast

// animation.time(3) // animation을 어느 시간부터 재생시킬지
// setInterval(() => {
//     console.log( animation.time()); // animation 진행에 따른 시간값
// }, 100);

// setInterval(() => {
//     console.log( animation.progress());
// }, 100);

// const progress = setInterval(() => {
//     let progressNum = animation.progress().toFixed(1);
//     if(progressNum >= 0.5) {
//         // animation.pause(true);
//         animation.reversed(true);
//         stopInterval();
//     }
// }, 100);

// function stopInterval() {
//     clearInterval(progress);
// }

// 이벤트 위임 event delegation
// 기본 단계
// 1. 가장 큰 부모에 이벤트 생성
// 2. 조건을 통해 하위 항목들 조작

const home = $('#home');
const mountain = $('#mountain');
const river = $('#river');
const company = $('#company');
const svg = $('svg');

svg.addEventListener('click', (e) => {
    const target = e.target.closest('g');
    const id = target.getAttribute('id');

    if (!target || !id || id === 'svg') return;
    
    let progress = 0;
    animation.pause();;
    
    switch (id) {
        case 'home': progress = 0; break;
        case 'mountain': progress = 0.21; break;
        case 'river': progress = 0.47; break;
        case 'company': progress = 1; break;
    }

    gsap.to(animation, { progress: progress, duration: 1});

    setButtonState();
})

// home.addEventListener('click', () => {
//     animation.pause();
//     gsap.to(animation, { progress: 0, duration: 3});
// })

// mountain.addEventListener('click', () => {
//     animation.pause();
//     gsap.to(animation, { progress: .21, duration: 3});
// })

// river.addEventListener('click', () => {
//     animation.pause();
//     gsap.to(animation, { progress: .47, duration: 3});
// })

// company.addEventListener('click', () => {
//     animation.pause();
//     gsap.to(animation, { progress: 1, duration: 3});
// })

// tween(tween, { vars });
// gsap.to(animation, { time: 3, duration: 5});
// gsap.to(animation, { progress: 1, duration: 1});
// gsap.to(animation, { timeScale: 3, duration: 1});