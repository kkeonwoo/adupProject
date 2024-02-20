gsap.utils.toArray('.section').forEach((section, index) => {
    const w = section.querySelector('.wrapper');

    if (w) {
        let [x, xEnd] = index % 2 ? ['100%', (w.offsetWidth - innerWidth) * -1] : [(w.offsetWidth) * -1, 0];

        gsap.fromTo(w, { x }, { 
            x: xEnd,
            scrollTrigger: {
                trigger: section,
                start: '20% center',
                end: '80% center',
                markers: true,
                scrub: 1,
            }
        })
    }
})