function pageLeave() {

    console.log('leave');
    
}

function pageEnter() {
    const tl = gsap.timeline()
    .from('.visual', { scale: 0.5, duration: 1})
    .to('.visual', { opacity: 1})
    .from('.line', { width: 0})
    .from('.heading span', { y: gsap.utils.wrap([200, -200])})
}

barba.init({
    transitions: [
        {
            name: 'default-transition',
            leave: () => pageLeave(),
            enter: () => pageEnter()
        }
    ]
})