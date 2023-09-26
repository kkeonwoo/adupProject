
const $ = node => document.querySelector(node);

const tl = gsap.timeline({
  defaults:{
    scale:0,
    opacity:0,
    duration:1
  }
});

tl.add('orange')
  .from('.orange',{})
  .addPause()
  .to('.orange',{opacity: 0})

  .add('green')
  .from('.green',{y:100,rotation:360})
  .addPause()
  .to('.green',{opacity: 0})

  .add('pink')
  .from('.pink',{y:-100,rotation:360})
  .addPause()
  .to('.pink',{opacity: 0})

  .add('blue')
  .from('.blue',{scale:2,rotation:-360});


  const prev = $('.prev');
  const next = $('.next');

  prev.addEventListener('click',()=>tl.reverse())
  next.addEventListener('click',()=>tl.play())

  // const getLabelsArray = timeline => Object.keys(timeline.labels).map(v => ({
  //   name: v,
  //   time: timeline.labels[v]
  // }))
  // .sort((a,b) => a.time - b.time);

  console.log(Object.keys(tl.labels)) // key 값을 배열로
  Object.keys(tl.labels).forEach((label, index) => {
    const template = `<div class="dot" data-label="${label}"></div>`

    $('.dotNav').insertAdjacentHTML('beforeend', template);

    gsap.utils.toArray('.dot')[index].addEventListener('click', (e) => {
      const label = e.target.dataset.label;

      tl.play(label);
      // gsap.to(tl, {time: index + 1});
    })
  })

// let labels = getLabelsArray(tl);

// labels.forEach((item, idx) => {
//   let dot = document.createElement('div');
//   dot.setAttribute('class', 'dot');
//   dot.dataset.label = item.name;
//   $('.dotNav').appendChild(dot);

//   dot.addEventListener('click', function() {
//     tl.play(this.dataset.label);
//   })
// })


























