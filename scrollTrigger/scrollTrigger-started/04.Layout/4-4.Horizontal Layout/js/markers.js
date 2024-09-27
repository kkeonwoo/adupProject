

const markers = () => {

  if (document.querySelector('.gsap-marker-scroller-start')) {
    const markers = gsap.utils.toArray('[class *= "gsap-marker"]');

    const scrollMarkers = markers.filter((m) => m.className.includes('scroller'));

    scrollbar.addListener(({ offset }) => {
      gsap.set(scrollMarkers, { marginLeft: -offset.y }); // 수평방향이니 marginLeft로 변경
      // start, end marker는 잘 찾지만
      // scroller-start, scroller-end는 위치를 못찾으니
      // markers 배열에서 해당 요소만 set을 받도록 세팅

    });
  }
}










