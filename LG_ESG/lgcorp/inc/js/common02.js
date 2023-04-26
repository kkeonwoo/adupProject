$(function () {
  if (!$('.esg-container').length) {
    return;
  }

  Promise.all(
    [
      font01.load(),
      font02.load(),
      font03.load(),
      font04.load()
    ]).then(function () {
      document.documentElement.className += " loaded";
      // console.log('Font Family have loaded'); // 성공메세지 출력
    }, function() { // 폰트가 완전히 로드되지 않으면
      document.documentElement.className += " loaded";
      // console.log("Font is not available"); // 실패메세지 출력
  });

	$(".policy-popup .txt-wrap").overlayScrollbars({});

  // policy popup
  var policyPopup = {
    act: function (itemCont) {
      lg.onClick(itemCont, function ($this) {
        let myIdx = $this.index();
        const popLayer = $('.policy-popup');

        const myLayer = popLayer.eq(myIdx);

        myLayer.show().siblings().hide();
        myLayer.find('p.tit').focus();
        popLayer.attr('aria-hidden', 'true');
        myLayer.attr('aria-hidden', 'false');
        myLayer.find('.btn-close').on('focusout', function () { myLayer.find('p.tit').focus();});
        lg.onClick(myLayer.find('.btn-close'), function ($close) {
          $close.closest(myLayer).hide();
          $this.focus();
        });
      });
    }
  }
  
  $(window).scroll(()=>{
    if (!$('.management-list').length) {
      return;
    }
    let windowTop = $(window).scrollTop();
    const headerHt = $('#header').find('.menu-list').innerHeight() + $('#header').find('.sub-list').innerHeight();
    const listStartHt = $('.management-list').parents().offset().top - $('.management-list').parents().outerHeight() - headerHt;
    const listEndHt = $('.management-list').offset().top + $('.management-list').innerHeight();
    
    if(windowTop > listEndHt || windowTop < listStartHt ){
      $('.policy-popup').attr('hidden','false').hide();
      $('.policy-popup').attr('hidden','true');
    } else {
      policyPopup.act($('.management-list li'));
    }
  })

  // Action Up
  var $text = $('.action-up');
  var sections = document.querySelectorAll('.action-up');
  let practiceTabIndex = [];
  let practiceTabIndexProt = [];
  var textAction = {
    gsap: function ($el,idx){
      let gsapTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: $el,
          start: 'top 100%',
          end: 'top 100%',
          scrub: 2,
          toggleClass: { targets: $el, className: 'is-active'},
          toggleActions: 'play none none reverse',
        }
      })
      gsapTimeline.to($el, { autoAlpha: 1, y: 0, duration: 2, delay: idx})
    },
    enter: function () {
      Array.prototype.forEach.call(sections, function (item,idx) {
        if($(item).closest('.practice-tab-content').length) return;
        textAction.gsap(item,idx);
      });
    },
    set: function () {
      gsap.set($text, { opacity: 0, y: 100 });
    },
    tab: function(idx){
      if(practiceTabIndexProt[idx]) return;
      $('.practice-tab-content').eq(idx).find('.action-up').each((idx,item)=>{
        textAction.gsap(item,idx);
      });
    }
  }

  var $img = $('.action-scale');
  var images = document.querySelectorAll('.action-scale');
  var imgAction = {
    enter: function(){
      Array.prototype.forEach.call(images,function(i){
        gsap.to(i,{ scale:1,
          scrollTrigger:{
            trigger: i,
            start: 'top+=30% 80%',
            end: 'top+=30% 60%',
            scrub: 2,
            toggleClass: { targets: i, className: 'is-active'},
            toggleActions: 'play none none reverse',
          }
        })
      })
    },
    set:function(){
      gsap.set($img,{scale:1.2,duration:1})
    }
  }

  if ($text.length) textAction.set(); textAction.enter();
  if ($img.length) imgAction.set(); imgAction.enter();

  $(document).on('click','.ripple-btn',function(e){
    if (this.getElementsByClassName('ripple').length > 0) {
      this.removeChild(this.childNodes[1]);
    }
    let ripples = document.createElement('span');
    let d = Math.max(this.clientWidth, this.clientHeight);
    ripples.style.width = ripples.style.height = d + 'px';
    let x = e.pageX - $(e.target).offset().left - d / 2;
    let y = e.pageY - $(e.target).offset().top - d / 2;
    ripples.style.left = x + 'px';
    ripples.style.top = y + 'px';
    this.appendChild(ripples);
    ripples.classList.add('ripple');
  });

  function set_cookie(name, value) {
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';path=/';
  }
  function get_cookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : 0;
  }

  $(document).on('click','.practice-tab-btn',function(e){
    let index = $(this).index();
    let cookieName = $(e.currentTarget).closest('.practice-tab-header').attr('data-cookie-name');
    set_cookie(cookieName, index)
    console.log(get_cookie(cookieName))
    tabGsapAction(index);
  });

  if($('.practice-tab-btn.active').length){
    let index = $('.practice-tab-btn.active').index();
    let cookieName = $('.practice-tab-btn.active').closest('.practice-tab-header').attr('data-cookie-name');
    index = get_cookie(cookieName);
    tabGsapAction(index);
  }

  function tabGsapAction(index){
    practiceTabIndex[index] ? practiceTabIndexProt[index] = true : practiceTabIndexProt[index] = false;
    practiceTabIndex[index] = true;
    $('.practice-tab-btn').removeClass('active').eq(index).addClass('active');
    $('.practice-tab-content').removeClass('active').eq(index).addClass('active');
    textAction.tab(index);
  }

  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }	
  let isTouchDevice;
  function deviceCheck() {
    if(navigator.maxTouchPoints || 'ontouchstart' in document.documentElement) {
      isTouchDevice = true;
    } else {
      isTouchDevice = false;
    }
  }
  function scrollController(){
    $('#wrap').on('scroll touchmove mousewheel', function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
    gsap.set(window,{duration:1,scrollTo:{autoKill:false,ease:"back.out(1)"}})
    if($('.esg-panel').length){
      gsap.to(window, {
        scrollTo: { 
          y: $($('.esg-panel')[1]).offset().top + $('.header-container').outerHeight() + $('.nav-sub-container').outerHeight(), 
          offsetY: - ($('.header-container').outerHeight() + $('.nav-sub-container').outerHeight()),
        },
        onComplete: ()=>{
          gsapScrollProt = true;
          gsapTouchProt = true;
          $('#wrap').off('scroll touchmove mousewheel');
        },
      })
    } else {
      if (window.matchMedia("(max-width: 1025px)").matches) {
        gsap.to(window, {
          scrollTo: { 
            y: $('.esg-container').find('div').offset().top - $('.nav-sub-container').outerHeight(), 
          },
          onComplete: ()=>{
            gsapScrollProt = true;
            gsapTouchProt = true;
            $('#wrap').off('scroll touchmove mousewheel');
          },
        })
      } else {
        gsap.to(window, {
          scrollTo: { 
            y: $('.esg-container').find('div').offset().top - ($('.header-container').outerHeight() + $('.nav-sub-container').outerHeight() - 1), 
          },
          onComplete: ()=>{
            gsapScrollProt = true;
            gsapTouchProt = true;
            $('#wrap').off('scroll touchmove mousewheel');
          },
        })
      }
    }
  }

  setScreenSize();
  deviceCheck();
  $(window).resize(()=>{
    setScreenSize();
    if(isTouchDevice)return;
    deviceCheck();
  });

  let _lastScrollTop = 0;
  let gsapScrollProt = true;
  $(window).scroll(()=>{
    let _scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (_scrollTop > _lastScrollTop) {
      // downscroll code
      $('html').removeClass('scroll_up');
      $('html').addClass('scroll_down');
      if(isTouchDevice) return;
      if(_scrollTop < $($('.esg-panel')[0]).outerHeight() || _scrollTop < $('.esg-visual-area').outerHeight() && gsapScrollProt){
        gsapScrollProt = false;
        scrollController();
      }
    } else {
      // upscroll code
      $('html').removeClass('scroll_down');
      $('html').addClass('scroll_up');
    }
    _lastScrollTop = _scrollTop;
  });

  var ts;
  let gsapTouchProt = true;
  $(document).bind('touchstart', function (e) {
    ts = e.originalEvent.touches[0].clientY;
  });

  $(document).bind('touchend', function (e) {
    var te = e.originalEvent.changedTouches[0].clientY;
    if (ts > te + 5) {
      // touch down code
      if(!isTouchDevice) return;
      if($(window).scrollTop() < $($('.esg-panel')[0]).outerHeight() || $('.esg-visual-area').outerHeight() && gsapTouchProt){
        gsapTouchProt = false;
        scrollController();
      }
    } else if (ts < te - 5) {
      // touch up code
    }
  });
})