// 소실점을 부모에게 주면 자식이 여러개인 경우 부모의 기준점에 동일하게 먹힘
// trasnformPerspective로 각 자식들에게 설정해서 각각 동일한 모습의 소실점을 같게한다.

gsap.set('.box', {
    transformPerspective: 600,
})

gsap.to('.box', {
    rotationY: 360,
    repeat: -1,
    duration: 8,
    ease:'none',
    transformOrigin: '50% 50% -400'
})




GSDevTools.create()