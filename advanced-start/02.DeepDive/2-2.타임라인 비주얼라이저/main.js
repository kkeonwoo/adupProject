const $ = node => document.querySelector(node);



gsap.to('svg',{autoAlpha:1})

const pixelPerSecond = 200;

const animation = gsap.timeline();

animation.to('#star', {duration:1, x:1150})
         .to('#circle', {duration:2, x:1150})
         .to('#square', {duration:1, x:1150})

const children = animation.getChildren();
const childrenList = children.length;

console.log(children);

children.forEach((tween, idx) => {
    gsap.set('#tween' + idx, {x: tween.startTime() * pixelPerSecond})
    gsap.set('#rect' + idx, {width: tween.duration() * pixelPerSecond})
})

// for(let i=0; i < childrenList; i++) {
//     gsap.set('#tween' + i, {x: children[i].startTime() * pixelPerSecond})
//     gsap.set('#rect' + i, {width: children[i].duration() * pixelPerSecond})
// }

const time = $('#time');
const maxX = animation.duration() * pixelPerSecond;

function handleMoveHead() {
    time.textContent = animation.time().toFixed(1);
    gsap.set('#playhead', { x: animation.progress() * maxX });
    // update 되면서 setting을 계속하며 이동하는 것처럼 보임
}

// eventCallback 으로 timeline 밖에서 콜백을 작성할 수 있다.
animation.eventCallback('onUpdate', handleMoveHead);

const dragger = Draggable.create('#playhead', {
    type: 'x',
    cursor: 'pointer',
    trigger: '#timeline', // 기준
    bounds: { minX: 0, maxX: maxX}, // boundary 범위 설정
    onDrag(event) {  // onDrag : 드래그 시 일어나는 콜백
        animation.pause();
        animation.progress( this.x / maxX );
        console.log(this.x); // this = Draggable
        // this.x = 0 ~ 800 -> 0 ~ 1 로 변환
    }
});

$('#play').addEventListener('click', () => {animation.play()});
$('#pause').addEventListener('click', () => {animation.pause()});
$('#reverse').addEventListener('click', () => {animation.reverse()});












