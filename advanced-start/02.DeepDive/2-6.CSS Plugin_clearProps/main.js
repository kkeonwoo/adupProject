const $ = node => document.querySelector(node);

const boxes = gsap.utils.toArray('.box');
// gsap.utils.toArray()
// 해당 선택자를 진짜 배열로 만들어준다.

boxes.forEach((item) => {

    item.addEventListener('click', (e) => {
        gsap.to(e.currentTarget, {
            width: '200px',
            backgroundColor: 'gray'
        })
    })
})

$('#reset').addEventListener('click', () => {
    gsap.set('.box', {clearProps: 'all'})
})

// x, rotation, scale 은 transform에 같이 들어간다.
// 따라서, 3중 1개 속성만 없애고 싶어도 나머지가 같이 사라지게 됨