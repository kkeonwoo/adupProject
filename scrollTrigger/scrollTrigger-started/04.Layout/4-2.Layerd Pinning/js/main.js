gsap.utils.toArray('.section').forEach((section, index) => {
    
    ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        // end: 'bottom center',
        // animation: ,
        pin: true,
        pinSpacing: false,
        markers: true,
        scrub: true,
        snap: {
            snapTo: 1,
            duration: 1,
            ease: "power2.inOut"
        },
    })
});







markers()

