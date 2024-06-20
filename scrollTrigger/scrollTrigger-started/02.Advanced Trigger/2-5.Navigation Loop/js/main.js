


const navColor = ["#ebdec1", "#e9aab1", "#92e0d3", "#52becb", "#f17683"];
const nav = document.querySelector('.nav');
// section의 상단에서 떨어진 값을 배열로 만들어 저장해두고
// li를 클릭했을때 가져다 쓰게 만들기
// 그러나 이 방법은 resize 시 변하는 값을 계속 찾아야하는 번거로움이 있어서 권장 x
// const section = gsap.utils.toArray('.section').map((section) =>  section.getBoundingClientRect().top);

gsap.utils.toArray('.section').forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        start: () => `top ${nav.offsetHeight}px`, // 화살표함수는 return 구문 생략 가능
        end: () => `bottom ${nav.offsetHeight}px`,
        // js파일을 읽을 때 루프 실행하면서 트윈도 설정됨
        // 따라서 ~부터가 초기에 한번 읽었을때 0번의 값이 설정되어 글리치 발생
        animation: gsap.to(nav, { backgroundColor: navColor[i], immediateRender: false}),
        markers: true,
        toggleActions: 'restart none none reverse'
    });
})

gsap.utils.toArray('.nav li').forEach((li, idx) => {
    li.addEventListener('click', () => {
        // ScrollTrigger.getAll()은 ScrollTrigger의 모든 정보를 가져올 수 있다.
        // 그 중 start ScrollTrigger의 시작점을 알 수 있음
        let sectionTop = ScrollTrigger.getAll()[idx].start + nav.offsetHeight
        scrollbar.scrollTo(0, sectionTop, 1500)
    })
})






markers();
