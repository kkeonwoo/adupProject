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
            if (!ScrollTrigger.getById('section03')) {
                ScrollTrigger.create({
                    trigger: '.depth_wrapper',
                    start: 'top top',
                    end: 'bottom bottom',
                    markers: true,
                    id: 'section03',
                    onLeaveBack:()=> transition(2,'up'),
                    onLeave:()=> transition(4,'down')
                })
    
                markers()
            }
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
function globalEnter(){
// console.log('globalEnter');
    gsap.to('h2',{opacity:1,y:0})
}

function globalLeave(){
// console.log('globalLeave');
    gsap.to('h2',{opacity:0,y:30})
}

function transition(index,dir){

const {page01,page02,page03,page04} = pages;

currentPageIndex = index;


gsap.to('.wrapper',{
    y: -innerHeight * (index - 1),
    duration:1.5,
    ease:'expo.inOut',
    onStart:()=>{

    globalLeave()

    switch (dir === 'up' ? index + 1 : index - 1) {
        case 1: page01.leave(); return;
        case 2: page02.leave(); return;
        case 3: page03.leave(); return;
        case 4: 
        page04.leave(); 
        state.isPlaying = false;
        return;
    }
    },
    onComplete:()=>{
    state.isPlaying = true;
    
    globalEnter()

    switch (index) {
        case 1: page01.enter(); return;
        case 2: page02.enter(); return;
        case 3: 
        page03.enter(); 

        if(dir === 'up'){
            scrollbar.scrollTo(0,scrollbar.limit.y - 1,600)
        }
        
        state.isPlaying = false;
        state.isGoingUp = false;
        return
        ;
        case 4: page04.enter(); return;
    
    }
    }
})
}

function handleWheel(e) {
    let direction = e.deltaY < 0 ? 'up' : 'down'


    if(state.isPlaying) {

        state.isPlaying = false;

        if (currentPageIndex === 3) return;

        if (direction === 'up') {
            if (currentPageIndex <= 1) return;
            --currentPageIndex
        } else {
            if (currentPageIndex >= sections.length) return;
            ++currentPageIndex
        }
        
        transition(currentPageIndex, direction);
    }

}

container.addEventListener('wheel', handleWheel)
