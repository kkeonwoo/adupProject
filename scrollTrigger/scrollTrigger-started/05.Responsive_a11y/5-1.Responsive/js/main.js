const box = document.querySelector('.box');
const wrapper = document.querySelector('.wrapper');

// 여기에 matchMedia의 디폴트 스코프로 던질 수 있음
const mm = gsap.matchMedia(wrapper);

// mm.add('(max-width:500px)', (context) => {
//     // context = mm 객체에 .add를 했을때 떨어지는 객체
//     // 자유롭게 수정이 가능 (ex. 함수 추가, 이름 부여)
//     // js 처럼 함수를 생성해도 되고
//     // .add를 통해 만들면 gsap에서 자동으로 함수를 만들어줌

//     context.add('spin', () => {
//         gsap.to(box, {
//             rotation: 360,
//             duration:2,
//             repeat: -1,
//             ease:'none'
//         })
//     })
//     box.addEventListener('click', context.spin) // context에 기능을 부여하면 500px보다 화면이 커지면 자동으로 제거되어 따로 관리를 하지 않아도 된다
    
//     return () => {
//         // clean up
//         // 미디어 쿼리가 일치하지 않을떄 정리해야할 함수
//         box.removeEventListener('click', context.spin)
//     }
// })

// mm.add('(min-width:501px)', () => {
//     gsap.to(box, {
//         rotation: -360,
//         duration:2,
//     })
// })

// 조건부로 내용이 조금씩 다른 경우
const options = {
    isMobile: '(max-width:500px)',
    isDesktop: '(min-width:501px)',
}

mm.add(options, (ctx) => {
    const { isMobile, isDesktop } = ctx.conditions;

    gsap.to('.green', {
        rotation: isMobile ? 360 : -360,
    })

})
// 3번째 인자에 스코프를 설정할 수 있음






