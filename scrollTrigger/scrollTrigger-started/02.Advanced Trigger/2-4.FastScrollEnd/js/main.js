const goToTop = gsap.timeline()
.to('.goToTop img', { y: 0, opacity: 1, ease:'back(3)'})
.to('.goToTop a', { y: 0, opacity: 1, ease:'back(3)'}, '-=0.3')

// 일반적으로 goToTop은 전체 스크롤에서 특정 퍼센트일때 튀어나오도록 구현

ScrollTrigger.create({
    trigger: '.scroll-content', // smooth scrollbar에서 생성된 요소
    start: '75% center',
    end: 'bottom center',
    animation: goToTop,
    markers: true,
    toggleActions: 'play none none reverse',
    // toggleClass: 'active' // trigger에 클래스 부여
    toggleClass: {
        targets: ['.goToTop', '.scroll-content'], // 원하는 대상에 class 부여할 경우
        className: 'active'
    },
    fastScrollEnd: true
    // scrub을 설정한 애니메이션은 fastScrollEnd를 사용할 수 없음
})

const topButton = document.querySelector('.goToTop');

topButton.addEventListener('click', () => {
    scrollbar.scrollTo(0, 0, 1500, {
        callback: () => {
            console.log('done!');
        }
    });
})








markers()