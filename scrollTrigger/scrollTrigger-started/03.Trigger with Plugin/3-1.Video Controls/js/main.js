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

const img = new Image();
img.src = './assets/frames/ezgif-frame-001.jpg'

function render () {
    ctx.drawImage(img, 0, 0)
}

markers()