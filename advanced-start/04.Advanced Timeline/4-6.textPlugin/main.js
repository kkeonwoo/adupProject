// text plugin
// replace DOM Element's text
gsap.registerPlugin(TextPlugin);

// gsap.from('.big', {
//     duration: 2,
//     text: 'hello~',
// })

// gsap.to('.big', {
//     duration: 2,
//     text: {
//         value: 'this is the new text',
//         // delimiter: ' ', // 띄어쓰면 띄어쓰기 단위로 애니메이션
//         // padSpace: true, // 글자가 다 지워졌을때 빈공간을 유지
//     },
//     repeat: 1,
//     yoyo: true,
//     repeatDelay: 1,
// })

gsap.to('.cursor', {
    opacity: 0,
    repeat: -1,
    yoyo: true,
    duration: 0.3,
    repeatDelay: 0.4,
})

const text = ['html', 'css', 'javascript', 'react', 'gsap']

function typing(arr) {
    const tl = gsap.timeline()
    .to('.big', {
        duration: arr[0] === 'javascript' ? 0.6 : 0.3,
        text: arr[0],
        repeat: 1,
        yoyo: true,
        repeatDelay: 1,
    })

    // text.shift() // 배열의 첫번째 아이템 제거
    // return 첫번째 아이템
    arr.push(arr.shift());
    // tl이 text의 첫번째 아이템을 애니메이션 하므로
    // 애니메이션이 끝난 후 첫번째 아이템을 제거하면
    // 두번째 텍스트가 애니메이션 됨

    gsap.delayedCall(3, typing, [arr]) // like 재귀함수

}

typing(text);