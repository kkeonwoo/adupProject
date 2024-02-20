const layer = document.querySelectorAll('.layer')

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: '#hero',
        start: 'top',
        end: 'bottom top',
        scrub: true,
        markers: true,
    }
})

layer.forEach((ly, idx) => {
    let depth = ly.dataset.depth;
    
    tl.to(ly, { y: -depth * ly.offsetHeight, ease: 'none'}, 0)
})










