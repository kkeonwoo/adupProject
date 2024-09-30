const sectionColors = [
  '#f2eee5',
  '#e5c1c5',
  '#c3e2dd',
  '#6eceda',
  '#FB9DA7',
  '#FCCCD4',
  '#FBDEA2',
  '#F2E2C6',
  '#8EB695',
];

gsap.set('.section', { backgroundColor: gsap.utils.wrap(sectionColors) });

gsap.utils.toArray('.section').forEach((item, index) => {
  let h2 = `
  <h2>section${index + 1}</h2>
  `;
  item.insertAdjacentHTML('beforeend', h2);
});

gsap.registerPlugin(ScrollTrigger);



const container = document.querySelector('#container');

const options = {
  damping: 0.1,
  alwaysShowTracks: true,
};

const pluginOptions = {}

class hori extends Scrollbar.ScrollbarPlugin {
  static pluginName = 'hori-scroller' // 플러그인 이름 필수!

  transformDelta(delta, fromEvent) {
    const {x, y} = delta;

    return {
      y: 0,
      x: Math.abs(x) > Math.abs(y) ? x : y
    }
  }
}

Scrollbar.use(hori, OverscrollPlugin) // 플러그인 정의 후 사용하겠다는 표시가 필요

const scrollbar = Scrollbar.init(container, {
  ...options,
  plugins: {
    overscroll: {
      effect: 'glow',
      damping: 0.1,
      maxOverscroll: 100,
      glowColor: '#ff0000',
      // scrollover 되었을 때 델타값
      // onScroll (position) {
      //   console.log(position);
      // }
    }
  }
});

ScrollTrigger.scrollerProxy(container, {
  scrollLeft(value) {
    if (arguments.length) {
      scrollbar.scrollLeft = value; // setter
    }
    return scrollbar.scrollLeft; // getter
  },
});

scrollbar.addListener(ScrollTrigger.update);
ScrollTrigger.defaults({ scroller: container });
