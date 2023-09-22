
const $ = node => document.querySelector(node);

const planet = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto'
]

const space = $('.space');
const list = planet.map((t, i) => {
  return `<div class="solar_system" data-planet-name="${t}">
    <div class="planet ${t}">
      <h2>${t}</h2>
    </div>
  </div>`
})

list.forEach((planet) => {
  space.insertAdjacentHTML('beforeend', planet);
})

const z = gsap.utils.distribute({
  base: -18400,
  amount: 18400
})

gsap.set('.planet', {
  z: z,
  // scaleX: 0.8,
  rotateX: 4,
})

let count = 0;
let trigger = false;
const rightButton = $('.right');

rightButton.addEventListener('click', () => {
  if(count > 7) return;
  
  if(!trigger) {
    ++count;

    gsap.to('.planet', {
      z: "+=2300", // += 현재 가지고 있는 값에서 value만큼 계산
      ease: 'power3.inOut',
      duration: 2,
      onComplete() {
        trigger = false;
      }
    })
    trigger = true;
  }
})

const leftButton = $('.left');

leftButton.addEventListener('click', () => {
  if(count < 1) return;
  
  if(!trigger) {
    --count;

    gsap.to('.planet', {
      z: "-=2300", // += 현재 가지고 있는 값에서 value만큼 계산
      ease: 'power3.inOut',
      duration: 2,
      onComplete() {
        trigger = false;
      }
    })
    trigger = true;
  }
})

// map  -> 배열의 능력 (새로운 배열을 반환)
// const todo = [
//   '밥먹기',
//   '일하기',
//   '게임하기',
//   '코딩하기'
// ]

// const list = todo.map((item, index) => {
//   return `<div class="${item}" data-index="${index}">${item}</div>`;
// });

// console.log( list );

// forEach -> 배열의 능력 (값을 반환하지 x)
// list.forEach((item, index) => {
//   console.log(item, index);
// })
// insertAdjacentHTML (dom 뿌려주는)










