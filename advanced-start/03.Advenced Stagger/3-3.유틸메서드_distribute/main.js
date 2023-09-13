const value = gsap.utils.distribute({ // 값을 분배
    base: 0,
    amount: 400,
    ease: 'power3', // 값의 분배도 가속도를 조절할 수 있다.
    from: 'center'
})

gsap.to('.bar', {
    height: value,
    duration: 2,
    stagger: {
        each: 0.1,
        // ease: 'power3.inOut'
        from: 'center'
    },
})

GSDevTools.create()







