const { chars } = new SplitText('h1', { type: 'chars'})

const disX = gsap.utils.distribute({
    base: -300,
    amount: 600,
})

const tl = gsap.timeline({
    repeat: -1
});

tl.from(chars, {
    y: gsap.utils.wrap([-10, 10]),
    opacity: 0,
    filter:'blur(10px)',
    stagger: {
        each: 0.1,
        from: 'center'
    }
})
.to(chars, {
    delay: 1,
    x: disX,
    duration: 3,
    ease: 'power3.inOut'
})
.to(chars, {
    delay: -1,
    opacity: 0,
    filter: 'blur(10px)',
    stargger: {
        each: 0.1,
        from: 'edges'
    }
})


