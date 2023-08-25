$(document).ready(() => {
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector(".smooth-scroll"),
        smooth: true
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".smooth-scroll", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
    });

    const scrolling = {
        firstRun: true,
        enabled: true,
        events: "click,scroll,wheel,touchmove,pointermove".split(","),
        prevent: e => e.preventDefault(),
        disable() {
            if (BlueOrange.scrolling.enabled) {
                BlueOrange.scrolling.enabled = false;
                window.addEventListener("scroll", gsap.ticker.tick, {passive: true});
                BlueOrange.scrolling.events.forEach((e, idx) => (idx ? document : window).addEventListener(e, BlueOrange.scrolling.prevent, {passive: false}));
            }
        },
        enable() {
            if (!BlueOrange.scrolling.enabled) {
                BlueOrange.scrolling.enabled = true;
                window.removeEventListener("scroll", gsap.ticker.tick);
                BlueOrange.scrolling.events.forEach((e, idx) => (idx ? document : window).removeEventListener(e, BlueOrange.scrolling.prevent));
            }
        },
        onFirstRun() {
            ScrollTrigger.removeEventListener("refresh", BlueOrange.scrolling.onFirstRun);
            BlueOrange.scrolling.firstRun = false;
        }
    }
    function goToSection(section) {
        locoScroll.scrollTo(section);
        if (scrolling.enabled) {
            scrolling.disable();
        }
    }

    function moveSection() {
        if(fn.exists('.people')) return;
    
        const panels = document.querySelectorAll(".motion_panel");
    
        panels.forEach((panel) => {
    
            ScrollTrigger.batch(panel,{
                trigger: panel,
                start: "top bottom-=1",
                end: "bottom top+=1",
                onEnter: (batch) => {
                    if (!BlueOrange.scrolling.firstRun) {
                        goToSection(panel);
                    }
                },
                onEnterBack: (batch) => goToSection(panel),
                onUpdate: () => fn.isScrollTop(),
            });
        });
        
    }
    moveSection();

    function moveSectionHorizon() {
        let pinWrapWidth = people.pinWrap.offsetWidth;
        let horizontalScrollLength = pinWrapWidth - people.pinBoxes[0].offsetWidth;
        
        let mainSt = gsap.to(".img_list", {
            scrollTrigger: {
                trigger: ".gsap_area",
                scrub: true,
                pin: true,
                start: "top top",
                end: pinWrapWidth,
                onUpdate: people.moveImgVer,
                onLeave: () => $('html, body').addClass('scroll_down'),
                onEnterBack: () => $('html, body').removeClass('scroll_down'),
            },
            x: -horizontalScrollLength,
            ease: "none",
        });

        people.button(pinWrapWidth);
    }
    function moveImgVer() {
        const wdwHghHalf = $(window).outerWidth()/2;
        const boxHghHalf = $(people.pinBoxes[0]).outerWidth()/2;
        const half = wdwHghHalf - boxHghHalf;
        people.pinBoxes.forEach((t,i)=>{
            let y;
            y = (Math.abs($(t).offset().left - half) / 10);
            $(t).css({'transform':`translateY(${y}px)`});
        })
    }
    function button(w) {
        $('.people .btn_round').on('click', function(e) {
            let $target = $(e.target);
            let scrollTop = window.scrollY;
            let x = w / 10;

            if ($target.hasClass('btn_next')) {
                if( scrollTop < w) {
                    BlueOrange.goToSection(scrollTop + x);
                }
            } else  {
                if ( scrollTop > 0) {
                    BlueOrange.goToSection(scrollTop - x);
                }
            }
        })
    }


    ScrollTrigger.addEventListener("refresh", BlueOrange.scrolling.onFirstRun);
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
})
