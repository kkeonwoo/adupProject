// const value = {
//     number: 0
// }

// gsap.to(value, {
//     number: 100, // gsap은 객체의 key:value를 직접 가져와 tween으로 사용 가능
//     duration: 3,
//     ease: 'none',
//     snap: 'number', // 정수를 반환하는 snap의 기능
//     onUpdate: () => {
//         console.log(value.number);
//     }
// })

// gsap의 snap
// 원하는 시점에서 원하는 효과를 부여할 수 있음
// x 값이 0, 50, 150, 500 일때 스냅이 걸리게 설정 가능
// gsap.to('.box', {
//     x:500,
//     duration: 3,
//     snap: {
//         x: { values: [0, 50, 150, 500], radius: 20}
//     }
// });

// const video = document.querySelector('#video');

// ScrollTrigger.create({
//     trigger: '.section03',
//     start: 'top center',
//     end: 'bottom center',
//     // animation: ,
//     markers: true,
//     onToggle: ({isActive}) => {
//         console.log(isActive);

//         isActive? video.play() : video.pause();
//     }
// })

// 영상을 스크롤에 따라 움직이게 하기
// 1. 영상 1프레임을 하나의 이미지로 만들어야함 (어도비 프리미어프로 / video to jpg converter)
// 2. canvas 사용

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const frameCount = 141;

const currentFrame = (idx) => {
    // padStart($1, $2) - $1 자리만큼 $2로 채워주는 기능
    return `./assets/frames/ezgif-frame-${(idx + 1).toString().padStart(3, '0')}.jpg`
}

const videoSection = {
    frame: 0
}

// const images = [];

// for (let i = 0; i < frameCount; i++) {
//     const img = new Image();
//     img.src = currentFrame(i);
//     images.push(img);
// }

const images = Array(frameCount).fill(null).map((_, i) => {
    const img = new Image();
    img.src = currentFrame(i);
    return img;
})

const tl = gsap.timeline()
.to(videoSection, { frame: frameCount - 1, snap: 'frame', ease: 'none',})
.to('#canvas', { filter: 'brightness(2)', scale: 3}, 0)

ScrollTrigger.create({
    trigger: '.section02',
    start: 'top top',
    end: '+=3000',
    animation: tl,
    pin: true,
    scrub: true,
    onUpdate: render
})

// gsap.to(videoSection, {
//     frame: frameCount - 1,
//     snap: 'frame',
//     ease: 'none',
//     onUpdate: render,
//     scrollTrigger: {
//         trigger: '.section02',
//         start: 'top top',
//         pin: true,
//         end: '+=3000',
//         scrub: true,
//     }
// })

images[0].onload = render; // 처음 이미지 로드 시 한 번만 로드

function render () {
    ctx.drawImage(images[videoSection.frame], 0, 0)
}

markers()