$(() => {

    const sections = document.querySelectorAll(".motion_panel");
    /**
     * object to scroll
     */
    const scrolling = {
        enabled: true,
        events: "scroll,wheel,touchmove,pointermove".split(","),
        prevent: e => e.preventDefault(),
        disable() {
            if (scrolling.enabled) {
                scrolling.enabled = false;
                // passive : 스크롤 성능 향상 옵션
                window.addEventListener("scroll", gsap.ticker.tick, {passive: true});
                scrolling.events.forEach((e, idx) => (idx ? document : window).addEventListener(e, scrolling.prevent, {passive: false}));
            }
        },
        enable() {
            if (!scrolling.enabled) {
                scrolling.enabled = true;
                window.removeEventListener("scroll", gsap.ticker.tick);
                scrolling.events.forEach((e, idx) => (idx ? document : window).removeEventListener(e, scrolling.prevent));
            }
        }
    };
    
    
    function goToSection(section) {
        if (scrolling.enabled) { // skip if a scroll tween is in progress
            scrolling.disable();
            gsap.to(window, {
                scrollTo: {y: section, autoKill: false},
                onComplete: scrolling.enable,
                duration: 1
            });
        }
    }
    
    sections.forEach((section, i) => {

        ScrollTrigger.create({
            trigger: section,
            start: "top bottom-=1",
            end: "bottom top+=1",
            onEnter: () => goToSection(section),
            onEnterBack: () => goToSection(section)
        });
    
    });
})