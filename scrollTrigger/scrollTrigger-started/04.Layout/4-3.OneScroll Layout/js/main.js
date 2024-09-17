// fullpage 효과 구현하기
// fullpage event = wheel ( 마우스 상하 움직임 체크 )

// 휠을 세게 돌렸을 때 한번에 많이 이동하는 것을 방지하기 위해
// 애니메이션 중인지 체크할 변수 필요
const state = {
    isPlaying : true
}
let currentPageIndex = 1;

const sections = gsap.utils.toArray('.section');

const pages = {
    page01: {
        enter:()=>{

        },
        leave:()=>{

        }
    },
    page02: {
        enter:()=>{

        },
        leave:()=>{

        }
    },
    page03: {
        enter:()=>{

        },
        leave:()=>{

        }
    },
    page04: {
        enter:()=>{

        },
        leave:()=>{

        }
    }
}

function transition(index, dir) {
        
    const { page01, page02, page03, page04 } = pages;

    // fullpage는 100vh 기준으로 이동
    // wrapper를 innerHeight만큼 움직이면 됨
    gsap.to('.wrapper', {
        y: -innerHeight * (index - 1),
        duration: 1.5,
        ease: 'expo.inOut',
        // 현재 페이지를 떠날 시점에 일어나는 애니메이션
        onStart:()=>{
            switch (dir === 'up' ? index + 1 : index - 1) { // currentpage 값을 올릴땐 더하고 내릴 땐 빼줘야 제대로 나옴
                case 1: page01.leave();break;
                case 2: page02.leave();break;
                case 3: page03.leave();break;
                case 4: page04.leave();break;
            }
        },
        // 다음 페이지 도착했을 시점에 일어나는 애니메이션
        onComplete: () => {
            state.isPlaying = true;

            switch (index) {
                case 1: page01.enter();break;
                case 2: page02.enter();break;
                case 3: page03.enter();break;
                case 4: page04.enter();break;
            }
        }
    })

}

function handleWheel(e) {
    let direction = e.deltaY < 0 ? 'up' : 'down'


    if(state.isPlaying) {

        state.isPlaying = false;

        if (direction === 'up') {
            if (currentPageIndex <= 1) return;
            --currentPageIndex
        } else {
            if (currentPageIndex >= sections.legnth) return;
            ++currentPageIndex
        }
    
    transition(currentPageIndex, direction);
    }

}

container.addEventListener('wheel', handleWheel)

// markers()

