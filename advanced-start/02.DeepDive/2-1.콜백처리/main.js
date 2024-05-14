const $ = node => document.querySelector(node);


//  callback -> 나중에 일어나는 일 

const h1 = $('h1');

// onComplete
// onUpdate
// onStart
// onRepeat

// let count = 0;

gsap.to('.orange', {
    duration:2.5,
    y:100,
    // repeat: -1,
    onComplete: complete,
    onCompleteParams: ['오렌지', 3],
    onUpdate() {
        h1.textContent = `애니메이션 재생 중`
    },
    onStart() {
        console.log('start!');
    },
    // onRepeat() {
    //     ++count;

    //     if(count > 5) {

    //     }
    //     console.log('반복 중');
    // }
})

function complete(color, number) {
    // console.log(color);
    // console.log(this); // tweens

    h1.textContent = `${color} + 애니메이션 재생 끝`

    gsap.to(this.targets()[0], { rotation: 360})
}


const user = {
    name : 'tiger',
    age : '33',
    // 객체 내의 함수 = 메서드
    sayHi: function () { // 일반함수 constructor O
        console.log(this); // 호출한 대상
    }, 
    sayBuy: () => { // 화살표 함수
        console.log(this); // this X window
    },
    sayGood() { // concise method constructor X
        console.log(this); // 호출한 대상
    }
}

user.sayHi();

class Tiger {

    // static method
    static moveY(target, distance) {
        gsap.to(target, { y: distance});
    }

    constructor(target, name) {
        this.animation = gsap.to(target, {
            x: 100,
            onComplete: this.complete,
            callbackScope: this
        })
        this.animation.pause();
        this.name = name;
    }

    // instance method
    start() {
        this.animation.play();
    }

    complete() {
        console.log(this);
        this.render();
    }

    render (){
        h1.textContent = `${this.name} 애니메이션 재생 끝`
    }
}

Tiger.moveY('.orange', 30);

const pink = new Tiger('.pink', '핑핑이');


















