gsap.from('.stage > div', {
    duration: 2,
    opacity: 0,
    scale: 0,
    ease:"power3.inOut", // opacity, duration에 대한 가속도
    stagger: {
        each:0.2,
        ease:"power3.inOut", // 등장하는 것에 대한 가속도
        from: 'center'
    },
})











