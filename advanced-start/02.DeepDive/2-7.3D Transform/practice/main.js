

gsap.from('.stage',{autoAlpha:0})  

gsap.registerEffect({
    name: 'text3d',
    extendTimeline: true,
    defaults: {
        deg: 360
    },
    effect:(target, config) => {
        const split = new SplitText(target, {type: 'chars'});
        gsap.set(split.chars, {transformPerspective:400})

        const tl = gsap.timeline();
        tl.to(split.chars, {
            rotationY: config.deg,
            duration: 1.2,
            ease: 'back(3)',
            stagger:{ 
                amount:1
            }
        })

        return tl;
    }
})

const animation = gsap.timeline();

animation.text3d('h1', {deg: 720})


GSDevTools.create()
