gsap.defaults({
    ease: "none"
})

function drawSVG(el) {

    let pathLength;

    if(typeof el !== 'string') {
        throw new TypeError('drawSVG 함수에 전달된 인수는 string 타입이어야 합니다.')
    }
    if(el.includes(',')) {
        const arr = el.split(',').map(t => {
            pathLength = document.querySelector(t).getTotalLength();
            gsap.set(t, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            })
            return pathLength;
        });
        return arr;
    }

    pathLength = document.querySelector(el).getTotalLength();
    
    gsap.set(el, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
    })

    return pathLength;
}

drawSVG('.path, .line01, .line02, .line03, .line04, .line05')

const line = gsap.timeline({
    defaults: {
        strokeDashoffset: 0
    }
})
.to('.line01', {}, 0.84)
.to('.line02', {}, 1.2)
.to('.line03', {}, 1.92)
.to('.line04', {}, 2.46)
.to('.line05', {}, 3.08)

const pulse = gsap.timeline({
    defaults: {
        scale: 2, 
        autoAlpha: 1, 
        transformOrigin: 'center', 
        ease: 'elastic(2.5, 1)'
    }
})
.to('.ball02, .text01', {}, 0.84)
.to('.ball03, .text02', {}, 1.2)
.to('.ball04, .text03', {}, 1.92)

const master = gsap.timeline()
.to('.ball01', { autoAlpha: 1})
.to('.path', { strokeDashoffset: 0, duration: 4}, 0) // 선 길이를 늘려서 0으로 가면 그려짐
.to('.ball01', {
    motionPath: {
        path: '.path',
        align: '.path',
        alignOrigin: [0.5, 0.5]
    },
    duration: 4
}, 0)
.add(pulse, 0)
.add(line, 0)

master.eventCallback('onUpdate', function() {
    console.log( this._time);
    
})

ScrollTrigger.create({
    trigger: '#svg',
    start: 'top center',
    end: 'bottom center',
    animation: master,
    scrub: true,
})

// GSDevTools.create()
markers()

