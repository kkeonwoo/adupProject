// $(() => {
//     const panels = document.querySelectorAll(".motion_panel");
//     /**
//      * object to scroll
//      */
//     const scrolling = {
//         enabled: true,
//         events: "click,scroll,wheel,touchmove,pointermove".split(","),
//         prevent: e => e.preventDefault(),
//         disable() {
//             if (scrolling.enabled) {
//                 scrolling.enabled = false;
//                 // passive : 스크롤 성능 향상 옵션
//                 window.addEventListener("scroll", gsap.ticker.tick, {passive: true});
//                 scrolling.events.forEach((e, idx) => (idx ? document : window).addEventListener(e, scrolling.prevent, {passive: false}));
//             }
//         },
//         enable() {
//             if (!scrolling.enabled) {
//                 scrolling.enabled = true;
//                 window.removeEventListener("scroll", gsap.ticker.tick);
//                 scrolling.events.forEach((e, idx) => (idx ? document : window).removeEventListener(e, scrolling.prevent));
//             }
//         }
//     };
    
//     // function goToSection(section) {
//     //     if (scrolling.enabled) { // skip if a scroll tween is in progress
//     //         scrolling.disable();
//     //         gsap.to(window, {
//     //             scrollTo: {y: section, autoKill: false},
//     //             onComplete: scrolling.enable,
//     //             duration: 1
//     //         });
//     //     }
//     // }
    
    
//     panels.forEach((panel) => {

//         ScrollTrigger.create({
//             trigger: panel,
//             start: "top bottom-=1",
//             end: "bottom top+=1",
//             onEnter: () => BlueOrange.goToSection(panel),
//             onEnterBack: () => BlueOrange.goToSection(panel)
//         });
    
//     });

//     const $gnb = $('#gnb'),
//         $depth01Item = $gnb.find('.depth1_item'),
//         $sections = $('.sec');

//         $depth01Item.on('click', function() {
//             let depth1Text = $(this).text();

//             if (depth1Text === 'works') {
//                 BlueOrange.goToSection($sections[3]);
//             } else {
//                 BlueOrange.goToSection(0);
//             }
//         });
// })