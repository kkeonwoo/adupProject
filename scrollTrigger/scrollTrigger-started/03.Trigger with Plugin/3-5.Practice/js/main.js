barba.hooks.leave(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
})

barba.hooks.after(() => {
    scrollbar.update();
    scrollbar.scrollTo(0, 0);
    markers();
})

function main() {
    let count = 5;
    gsap.utils.toArray('nav li').forEach((li, i) => {
        li.addEventListener('mouseenter', () => {
            const exceptMe = `.image_container .cover:not(:nth-child(${i+1}))`;
            const me = `.image_container .cover:nth-child(${i+1})`;

            const navAnimation = gsap.timeline({ defualts: { duration: 0.2}})
            .to('nav li', { opacity: 0.2})
            .to(li, { opacity: 1}, 0)

            gsap.defaults({overwrite: 'auto'}) // auto: 중첩된 항목에 애니메이션을 삭제

            const imageAnimation = gsap.timeline()
            .to(exceptMe, { height: 0, onComplete: () => {
                gspa.set(me, {zIndex: ++count})
            }})
            .set(me, { height: '100%'}, 0)
        })
    })
}
function rome() {
    const card = document.querySelector('.card_container');
    
    ScrollTrigger.create({
        trigger: '.section02',
        start: 'top top',
        end: 'bottom top',
        animation: gsap.fromTo(card, { x: innerWidth}, { x: -(card.offsetWidth - innerWidth)}),
        pin: true,
        // pinSpacing: false,
        markers: true,
        scrub: true,
    })
}
function england() {

}
function india() {

}
function peru() {

}

function pageLeave() {
    const scale = gsap.timeline()
    .to('.image_container', { scale: 1, duration: 1.5, ease: 'power3.inOut'})
    .to('.image_container > div', { filter: 'brightness(1)'})
    
    return scale
}

function pageEnter(target) {
    const tl = gsap.timeline()
    .from('.visual', { filter: 'brightness(0.5)', scale: 0.5, duration: 1})
    .from('.line', { width: 0})
    .from('.heading span', { y: gsap.utils.wrap([200, -200])})
}

barba.init({
    views: [
        { namespace: 'main', beforeEnter: () => main() },
        { namespace: 'rome', beforeEnter: () => rome() },
        { namespace: 'england', beforeEnter: () => england() },
        { namespace: 'india', beforeEnter: () => india() },
        { namespace: 'peru', beforeEnter: () => peru() },
    ],
    transitions: [
        {
            name: 'default-transition',
            leave: () => pageLeave(),
            enter: ({next}) => pageEnter(next.container),
            once: () => markers()
        }
    ]
})