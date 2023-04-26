// FontFaceObserver - 폰트깜빡임 방지 스크립트
var font01 = new FontFaceObserver('LGSmHaTL');
var font02 = new FontFaceObserver('LGSmHaTR');
var font03 = new FontFaceObserver('LGSmHaTSB');
var font04 = new FontFaceObserver('LGSmHaTB');

Promise.all(
	[
		font01.load(),
		font02.load(),
		font03.load(),
		font04.load()
	]).then(function () {
		document.documentElement.className += " fonts-loaded";
		// console.log('Font Family have loaded'); // 성공메세지 출력
	}, function() { // 폰트가 완전히 로드되지 않으면
		document.documentElement.className += " fonts-loaded";
		// console.log("Font is not available"); // 실패메세지 출력
});

function isIE () {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

// page ui script run
var dimm = $('.dimm');
$(function() {

	// // 디자인 스크롤 적용 (계열사 링크, 매거진)
	// $(".affiliates-list-wrap, .list-magazine, body.affiliates-open").overlayScrollbars({});
	// // 디자인 가로 스크롤 - 마우스 휠 동작
	// $(".affiliates-list-wrap div").on("mousewheel", function(event, delta){
	// 	this.scrollLeft -= (delta * 30);
	// 	event.preventDefault();
	// });

	// 주요계열사 앵커 이동 스크립트
	var a_link01 = $("#link01").position();
	var a_link02 = $("#link02").position();
	var a_link03 = $("#link03").position();
	var a_link04 = $("#link04").position();
	var a_link05 = $("#link05").position();

	$("#link01").attr({ role: 'text', tabindex: 0 });
	$("#link02").attr({ role: 'text', tabindex: 0 });
	$("#link03").attr({ role: 'text', tabindex: 0 });
	$("#link04").attr({ role: 'text', tabindex: 0 });
	$("#link05").attr({ role: 'text', tabindex: 0 });

	$("#link01").css('outline', 0);
	$("#link02").css('outline', 0);
	$("#link03").css('outline', 0);
	$("#link04").css('outline', 0);
	$("#link05").css('outline', 0);


	$('.a_link01').click(function() {
		$('html, body').animate({
			scrollTop: a_link01.top - 140
		}, 500, function () {
			$("#link01").focus();
		});
		$('.subsidiary-link-wrap .link').removeClass('on');
		$(this).addClass('on');
		return false;
	});
	$('.a_link02').click(function() {
		$('html, body').animate({
			scrollTop: a_link02.top - 140
		}, 500, function () {
			$("#link02").focus();
		});
		$('.subsidiary-link-wrap .link').removeClass('on');
		$(this).addClass('on');
		return false;
	});
	$('.a_link03').click(function() {
		$('html, body').animate({
			scrollTop: a_link03.top - 140
		}, 500, function () {
			$("#link03").focus();
		});
		$('.subsidiary-link-wrap .link').removeClass('on');
		$(this).addClass('on');
		return false;
	});
	$('.a_link04').click(function() {
		$('html, body').animate({
			scrollTop: a_link04.top - 130
		}, 500, function () {
			$("#link04").focus();
		});
		$('.subsidiary-link-wrap .link').removeClass('on');
		$(this).addClass('on');
		return false;
	});
	$('.a_link05').click(function() {
		$('html, body').animate({
			scrollTop: a_link05.top - 140
		}, 500, function () {
			$("#link05").focus();
		});
		$('.subsidiary-link-wrap .link').removeClass('on');
		$(this).addClass('on');
		return false;
	});

	// 보도자료 동영상 뷰 이동
	var a_movie = $(".ui-movie-view").position();
	$('.ui-movie-list > li > a').on('click', function(){
		$('html, body').animate({
			scrollTop: a_movie.top - 61
		}, 500);
	});

	//계열사링크
	var layer = $('.affiliates-area');
	lg.onClick($('.ui-btn-link-menu'), function() {

		$('.skipnav').attr('aria-hidden', 'true');
		$('.header-content').attr('aria-hidden', 'false');
		$('.nav-sub-container').attr('aria-hidden', 'true');
		$('#container').attr('aria-hidden', 'true');
		$('#footer').attr('aria-hidden', 'true');
		$('.gnb-container').attr('aria-hidden', 'true');


		dimm.show();
		lg.showCall(layer, function() {

			var tabCallBtn = $('.ui-tab-affiliates .tab-item');
			lg.onClick(tabCallBtn, function($tab) {
				var myidx = $tab.index();
				switch (myidx) {
					case 0: tabs.firstAct(); break;
					case 1: tabs.secondAct(); break;
					case 2: tabs.thirdAct(); break;
					default: break;
				}
			});

			$('.ui-btn-link-menu').hide();
			tabCallBtn.first().focus();
			$('.ui-btn-link-close').off('keydown').on('keydown', function(e){
				switch(e.keyCode) {
					case 16: return true;
					case 9: tabCallBtn.first().focus(); break;
				}
			})

			layer.attr('aria-hidden', false);

			lg.onClick(layer.find('.ui-btn-link-close'), function() {
				layer.hide(); dimm.hide();
				$('.skipnav').attr('aria-hidden', 'false');
				$('.header-content').attr('aria-hidden', 'false');
				$('.gnb-container').attr('aria-hidden', 'false');
				$('.nav-sub-container').attr('aria-hidden', 'false');
				$('#container').attr('aria-hidden', 'false');
				$('#footer').attr('aria-hidden', 'false');

				$('.ui-btn-link-menu').show(); // 포커스 보내기 전에 숨겼던 버튼 보이기
				$('.ui-btn-link-menu').focus();
				layer.attr('aria-hidden', 'true');
			});

			var tabs = {
				firstAct: function() {
					tabCallBtn.removeClass('on');
					tabCallBtn.eq(0).addClass('on');
					if (swiper) swiper.destroy();
					$('.affiliates-group-01').parent().css('display', 'inline-block'); $('.affiliates-group-02').parent().hide(); $('.affiliates-group-03').parent().hide();
					//$('#affiliates-list').addClass('swiper-wrapper');
					jQuery(".affilates-list-nav").show();
					applySwiper();
				},
				secondAct: function() {
					tabCallBtn.removeClass('on');
					tabCallBtn.eq(1).addClass('on');
					if (swiper) swiper.destroy();
					$('.affiliates-group-01').parent().hide(); $('.affiliates-group-02').parent().css('display', 'inline-block'); $('.affiliates-group-03').parent().hide();
					//$('#affiliates-list').addClass('swiper-wrapper');
					jQuery(".affilates-list-nav").show();
					applySwiper();

				},
				thirdAct: function() {
					tabCallBtn.removeClass('on');
					tabCallBtn.eq(2).addClass('on');
					if (swiper) swiper.destroy();
					$('.affiliates-group-01').parent().hide(); $('.affiliates-group-02').parent().hide(); $('.affiliates-group-03').parent().css('display', 'inline-block');

					applySwiper();

					jQuery(".affilates-list-nav").hide();

				}
			};

			tabs.firstAct();

			var swiper;
			/*
			function applySwiper () {

				if (isIE() && isIE() <= 9) {

					$('#header .swiper-container').removeClass('swiper-container');
					$('#header .swiper-wrapper').removeClass('swiper-wrapper');
					$('#header .swiper-slide').removeClass('swiper-slide');
					$('#header .affiliates-list').css('overflow-y', 'scroll');
					$('#header .btn-prev').hide();
					$('#header .btn-next').hide();

				} else {
					$('#header .swiper-slide').css('width', 'auto');
					$('#header .swiper-container').css('margin-top', '10px');
					$('#header .swiper-wrapper').css('width', 'auto');
					swiper = new Swiper('#header .swiper-container', {
						slidesPerView: 'auto',
						freeMode: true,
						//slidesPerView: lg.deviceWidth() >= breakPoint ? 3 : 2,
						//spaceBetween: lg.deviceWidth() >= breakPoint ? 0 : 10,
						navigation: {
							nextEl: '#header .btn-next',
							prevEl: '#header .btn-prev',
						},
					});
				}
			}
			*/

			function applySwiper () {

				if (isIE() && isIE() <= 9) {

					//$('.swiper-container').removeClass('swiper-container');
					//$('.swiper-wrapper').removeClass('swiper-wrapper');
					//$('.swiper-slide').removeClass('swiper-slide');

					$('.first').removeClass('first');
					$('.first-wrapper').removeClass('first-wrapper');
					$('.first-slide').removeClass('first-slide');

					$('.affiliates-list').css('overflow-y', 'scroll');
					$('.btn-prev').hide();
					$('.btn-next').hide();

				} else {
					//$('.swiper-slide').css('width', 'auto');
					//$('.swiper-container').css('margin-top', '10px');
					//$('.swiper-wrapper').css('width', 'auto');

					$('.first-slide').css('width', 'auto');
					$('.first').css('margin-top', '10px');
					$('.first-wrapper').css('width', 'auto');

					swiper = new Swiper('#header .first', {
						slidesPerView: 'auto',
						freeMode: true,
						//slidesPerView: lg.deviceWidth() >= breakPoint ? 3 : 2,
						//spaceBetween: lg.deviceWidth() >= breakPoint ? 0 : 10,
						navigation: {
							nextEl: '#header .btn-next',
							prevEl: '#header .btn-prev',
						},
					});
				}
			}


			$('.affilates-list-scrollbar').hide();
		});
	});

	// sns 공유버튼
	var sns = $('.ui-btn-share');
	var snsClose = $('.ui-btn-share-close');
	lg.onClick(sns, function($sns) {$sns.addClass('on'); $('.share-box > li.url > a').focus()});
	lg.onClick(snsClose, function() {sns.removeClass('on');	sns.focus()});

	// 매거진 - 다른매거진 보기 리스트 컨트롤
	var magazineOpen = $('.ui-list-magazine .btn-open-list');
	lg.onClick(magazineOpen, function($this) {
		if($this.hasClass('on')) {$this.removeClass('on')} else {$this.addClass('on')}
	});

	// 달력 ui - 시작날짜 달력
	var start = $('#uiStartDay');
	// start.val(lg.todayCall()); 오늘날짜를 불러오는 부분 불필요 하여 삭제 20190424
	lgUi.openCalendar({
		id: start,
		btn: start.next('.btn-date')
	});
	// 달력 ui - 종료날짜 달력
	var end = $('#uiEndDay');
	// end.val(lg.todayCall()); 오늘날짜를 불러오는 부분 불필요 하여 삭제 20190424
	lgUi.openCalendar({
		id: end,
		btn: end.next('.btn-date')
	});

	// 검색박스(보도자료) - 토글
	var open = $('.btn-open-form-search');
	var close = $('.ui-search-close-media');
	lg.onClick(open, function($this) {
		$this.addClass('on');
		$('.search-input-wrap select').focus();
	});
	lg.onClick(close, function() {
		open.removeClass('on').focus();
	});

	// 검색박스(보도자료) - 초기화
	var reset = $('.btn-reset');
	lg.onClick(reset, function() {
		var box = $('.search-on-wrap');
		var select = box.find('.selectbox');
		var inputText = $('.search-select-input-wrap input[type="text"]');
		select.each(function() {
			$(this).val($(this).find('option:first-child').val());
		});
		start.val(lg.todayCall());
		end.val(lg.todayCall());
		inputText.val('');
	});

	// 검색영역(CSR)
	var searchOpenBtn = $('.btn-search-on');
	var searchCloseBtn = $('.ui-search-close-csr');
	var searchBox = $('.search-on-btn-wrap');
	lg.onClick(searchOpenBtn, function() {
		searchBox.addClass('on');
		$('.search-on-wrap > .tag-wrap > a:first-child').focus();
	});
	lg.onClick(searchCloseBtn, function() {
		searchBox.removeClass('on');
		searchOpenBtn.focus();
	});

	//header
	var statusWid = lg.deviceWidth();
	var breakPoint = 1025;
	if(statusWid < breakPoint) {lgUi.narrowGnb('KOR')} //영어 ENG
	else {lgUi.wideGnb('KOR')} //영어 ENG

	//sub visual
	var imgbox = $('.visual-area > div:first-child');
	var txtbox = $('.visual-area > div:last-child');
	imgbox.addClass('ui-scale');
	lg.timeCall(500, function() {txtbox.stop().animate({'margin-top' : '0px', 'opacity' : '1'}, 500, 'easeOutQuad')});

	//scroll anchor
	lgUi.topAnchor();

	$(window).on('resize', function() {
		if(statusWid < breakPoint) {
			if(lg.deviceWidth() >= breakPoint) {location.reload();}
		} else if (statusWid >= breakPoint) {
			if(lg.deviceWidth() < breakPoint) {location.reload();}
		}
	});
});

// source
var krSource = '';
var enSource = '';
var langSource = '';

if($('html').attr('lang') == 'kr') {
	langSource = '<button class="lang" type="button"><span class="txt fonts-load"><span class="hide-txt cl">언어선택 국문</span><span class="hide-txt op">언어선택 국문</span>KOR<span class="hide-txt cl">축소됨</span><span class="hide-txt op">확장됨</span></span></button><a class="lang" href="#"><span class="txt fonts-load"><span class="hide-txt">영문</span>ENG</span></a>';
} else {
	langSource = '<button class="lang" type="button"><span class="txt fonts-load"><span class="hide-txt cl">언어선택 영문</span><span class="hide-txt op">언어선택 영문</span>ENG<span class="hide-txt cl">축소됨</span><span class="hide-txt op">확장됨</span></span></button><a class="lang" href="#"><span class="txt fonts-load"><span class="hide-txt">국문</span>KOR</span></a>';
}

// util
var lg = {
	deviceWidth: function() {var winW = window.innerWidth > 0 ? window.innerWidth : screen.width; return winW},
	deviceHeight: function() {var winH = $(window).height() > 0 ? $(window).height() : screen.availHeight; return winH},
	onClick: function(element, clickAfter) {element.off('click').on('click', function() {clickAfter && clickAfter($(this))})},
	focusIn: function(element, inAfter) {element.on('focusin', function() {inAfter && inAfter($(this))})},
	focusOut: function(element, outAfter) {element.on('focusout', function() {outAfter && outAfter($(this))})},
	timeCall: function(time, timeAfter) {setTimeout(function() {timeAfter && timeAfter()}, time);},
	todayCall: function() {
		var today = new Date(), dd = today.getDate(), mm = (today.getMonth()) + 1, yyyy = today.getFullYear();
		if(dd < 10) {dd = ('0' + dd)} if(mm < 10) {mm = '0' + mm}
		return yyyy + '.' + mm + '.' + dd;
	},
	bodyStop: function(top) {
		$('body').css({'width' : '100%', 'height' : '100%', 'position' : 'fixed', 'top' : top + 'px', 'left' : '0', 'overflow-y' : 'scroll', 'overflow-x' : 'hidden'});
		dimm.show();
	},
	bodyClear: function(top) {$('body').removeAttr('style'); dimm.hide(); $(window).scrollTop(top)},
	showCall: function(element, showAfter) {element.show().ready(function() {showAfter && showAfter($(this))})},
	hideCall: function(element, hideAfter) {element.hide().ready(function() {hideAfter && hideAfter($(this))})}
}

// 투자정보
var sbtn = $('.finance-search-wrap .btn-form-search');
var selectbox = $('.finance-search-wrap select');
if (sbtn.css('display') == 'none') {
	selectbox.on('change', function() {
		var optVal = selectbox.find('option:selected').index();
		$('.finance-tb-wrap').hide(); $('.finance-tb-wrap').eq(optVal).show();
	});
} else {
	lg.onClick(sbtn, function() {
		var optVal = selectbox.find('option:selected').index();
		$('.finance-tb-wrap').hide(); $('.finance-tb-wrap').eq(optVal).show();
	});
}
$('.finance-tb-wrap').hide(); $('.finance-tb-wrap').eq(0).show();

// ui module
var lgUi = {
	openCalendar: function(object) {
		var id = object.id, btn = object.btn;
		var options = {
			dateFormat: 'yymmdd', // 입력되는 날짜형식 수정 20190424
			prevText: '이전 달',
			nextText: '다음 달',
			monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
			showMonthAfterYear: true,
			yearSuffix: '년',
			beforeShow: function() {
				lg.timeCall(0, function() {
					var datePrve = $('.ui-datepicker-prev'), dateNext = $('.ui-datepicker-next');
					datePrve.attr('tabindex','0').focus();
					lg.focusOut(datePrve, function() {dateNext.attr('tabindex','0').focus()});
				});
			}
		}
		btn.attr('tabindex', '0');
		lg.onClick(btn, function() {id.datepicker(options).datepicker('show')});
	},
	languageSelect: function(value) {
		var languageBox = $('.ui-language-select');
		var liveAnchor = languageBox.find('> button.lang');
		lg.onClick(liveAnchor, function() {
			if(languageBox.hasClass('open')) {languageBox.removeClass('open')} else {languageBox.addClass('open')}
				});
			},
	wideGnb: function(language) {
		//gnb
		dimm.hide();
		lg.bodyClear(0);
		var gnb = $('.menu-list');
		var item = gnb.find('> a');
		var liveGnb = gnb.find('> a.on');
		var liveSub = gnb.find('.sub-list > a.on');
		var interaction = {
			active: function(ele) {item.removeClass('active'); item.removeClass('on'); ele.addClass('active')},
			inactive: function() {item.removeClass('active'); liveGnb.addClass('on'); liveSub.addClass('on')},
			myPosition: function(itemName) {
				var myidx = itemName.index();
				var divName = itemName.next('.sub-list');
				var leftValue = 0;
				switch (myidx) {
					case 0: leftValue = (item.eq(0).offset().left) + 11; break;
					case 2: leftValue = (item.eq(1).offset().left) + 11; break;
					case 4: leftValue = (item.eq(2).offset().left) + 11; break;
					case 6: leftValue = (item.eq(3).offset().left) + 11; break;
					case 8: leftValue = ((item.eq(4).offset().left) - ($('.menu-list .sub-list').eq(4).outerWidth()) + 100); break;
					default: break;
				}
				divName.css({'left' : leftValue + 'px', 'opacity' : '1'});
			}
		}
		item.each(function() {interaction.myPosition($(this))});
		$(window).resize(function() {item.each(function() {interaction.myPosition($(this))})});
		item.hover(function() {interaction.active($(this))}, function() {
			gnb.hover(function() {}, function() {interaction.inactive()});
		});
		lg.focusIn(item, function($this) {interaction.active($this)});
		lg.focusIn($('#container'), function() {interaction.inactive()});
		//언어바꾸기
		lgUi.languageSelect(language);
		lgUi.stickySide();
		//top scoll bar
		var scollSize = $(document).height() - $(window).height();
		var delayBar;
		$(window).on('scroll',function() {
			$('.scrolling-bar').css({'z-index' : '101', 'opacity' : '1', 'width' : (($(window).scrollTop() / scollSize) * 100) + '%'});
      clearTimeout(delayBar); delayBar = setTimeout(function() {$('.scrolling-bar').css({'opacity' : '0', 'z-index' : '0'}, 400)}, 400);
		});
	},
	narrowGnb: function(language) {
		//mobile sub menu
		var mobileMenuBtn = $('.ui-menu-sub-list .select-menu');
		mobileMenuBtn.attr('title', '모바일 서브메뉴 축소됨');
		lg.onClick(mobileMenuBtn, function($this) {
			if ($this.hasClass('active')) {
				$this.removeClass('active');
				mobileMenuBtn.attr('title', '모바일 서브메뉴 축소됨');
			} else {
				$this.addClass('active');
				mobileMenuBtn.attr('title', '모바일 서브메뉴 확장됨');
			}
		});
		//gnb
		var gnb = $('.menu-list');
		var item = gnb.find('> a');
		var liveGnb = gnb.find('> a.active');
		var liveSub = gnb.find('.sub-list > a.on');
		var interaction = {
			active: function(ele) {item.removeClass('active'); ele.addClass('active')},
			inactive: function() {item.removeClass('active'); liveGnb.addClass('active'); liveSub.addClass('on')}
}
		lg.onClick($('.ui-btn-all-menu'), function($this) {
			dimm.show();
			lg.bodyStop(0);
			lg.showCall($('.gnb-container'), function() {
				$('.lang').focus();
				lg.onClick($('.btn_close_all_menu'), function() {
					lg.hideCall($('.gnb-container'), function() {
						interaction.inactive(); $this.focus();
						$('.skipnav').attr('aria-hidden', 'false');
						$('.header-content').attr('aria-hidden', 'false');
						$('.nav-sub-container').attr('aria-hidden', 'false');
						$('.affiliates-area').attr('aria-hidden', 'false');
						$('#container').attr('aria-hidden', 'false');
						$('#footer').attr('aria-hidden', 'false');
						$('.gnb-container').attr('aria-hidden', 'true');
					});
					dimm.hide();
					lg.bodyClear(0);
				});
				lg.onClick(item, function($this) {
					if ($this.hasClass('active') || $this.hasClass('on')) {
						$this.removeClass('active');
						$this.removeClass('on');
						if ($this.attr('role')) $this.attr('title', '메뉴 축소됨');
					} else {
						$this.addClass('active');
						if ($this.attr('role')) $this.attr('title', '메뉴 확장됨');
					}
				});
				$('.skipnav').attr('aria-hidden', 'true');
				$('.header-content').attr('aria-hidden', 'true');
				$('.nav-sub-container').attr('aria-hidden', 'true');
				$('.affiliates-area').attr('aria-hidden', 'true');
				$('#container').attr('aria-hidden', 'true');
				$('#footer').attr('aria-hidden', 'true');
				$('.gnb-container').attr('aria-hidden', 'false');
				$('.btn_close_all_menu').on('focusout', function() {$('.lang').focus();});
			});
		});
		//언어바꾸기
		lgUi.languageSelect(language);
		lgUi.stickyHeader();
		//lgUi.stickySide();
	},
	stickyHeader: function() {
		var box = $('#header');
		var logoArea = $('.ui-header-container');
		var menuArea = $('.ui-menu-sub-list');
		box.css({'width': '100%', 'position' : 'fixed', 'top' : '0', 'left' : '0', 'z-index' : '101'});
		$('#container').css('margin-top', (box.outerHeight()) + 'px');
		var previousScrollPosition = 0;
		var tabs = $('.ui-public-tab .ui-tab-list');
		var tabsTop = 0;
		if (tabs.length > 0) {tabsTop = tabs.offset().top}
		var history = $('.history-time-line');
		var historyTop = 0;
		var pointGroup = new Array();
		var timeLine = $('.tab-history > .tab-item');
		if (history.length > 0) {
			historyTop = history.offset().top;
			if(timeLine.eq(0).hasClass('on')) {pointGroup = [1370, 3914, 6106]}	//1번탭 찹업과 개척
			//else if (timeLine.eq(1).hasClass('on')) {pointGroup = [3334, 5262]} //2번탭 전진과 혁신
			else if (timeLine.eq(1).hasClass('on')) {pointGroup = [2994, 5262]} //2번탭 전진과 혁신
			else if (timeLine.eq(2).hasClass('on')) {pointGroup = [2910, 8280, 13410,18200]} //3번탭 일등 LG를 향하여
		}
		var fixedCall = {basic: function(ele, top) {ele.stop().animate({'top' : top + 'px'}, 50)}}
		$(window).on('scroll', function() {

			var winTop = $(window).scrollTop();
			var currentScrollPosition = (winTop + $(window).height());
			if (currentScrollPosition > previousScrollPosition) {
				if (winTop > 50) {if ($('.affiliates-area').css('display') != 'block') {fixedCall.basic(box, -50)}}
				if (winTop > (tabsTop - 50)) {tabs.addClass('fixed-tab'); fixedCall.basic(tabs, 50)}
				if (winTop > (historyTop - 100)) {history.addClass('fixed-history-time'); fixedCall.basic(history, 110)}
			} else if(currentScrollPosition < previousScrollPosition) {
				fixedCall.basic(box, 0);
				if (winTop > (tabsTop - 50)) {fixedCall.basic(tabs, 100)}
				else {tabs.removeClass('fixed-tab'); tabs.removeAttr('ui-tab-liststyle')}
				if (winTop > (historyTop - 100)) {fixedCall.basic(history, 160)}
				else {history.removeClass('fixed-history-time'); history.removeAttr('style')}
			}

			for (var i = 0; i <= pointGroup.length; i++) {
				if (i == 0) {
					if (winTop <= pointGroup[0]) {
						history.find('> a').removeClass('on');
						history.find('> a').eq(0).addClass('on');
						history.find('> a').attr('title', '');
						history.find('> a').eq(0).attr('title', '선택됨');
					}
				} else {
					var wt = winTop;
					if (currentScrollPosition < previousScrollPosition) {
						if (i !== 0) wt = wt + 50;
					}
					
					//console.log('i is ' + i, wt, pointGroup[i - 1], pointGroup[i], wt >= pointGroup[i - 1] && wt <= pointGroup[i]);
					if (wt >= pointGroup[i - 1]) {
						if (!pointGroup[i] || (pointGroup[i] && wt <= pointGroup[i])) {
							history.find('> a').removeClass('on');
							history.find('> a').eq(i).addClass('on');
							history.find('> a').attr('title', '');
							history.find('> a').eq(i).attr('title', '선택됨');
						}
					}
				}
			}

			previousScrollPosition = currentScrollPosition;
			//}
		});

		history.find('> a').each(function (i, a) {
			$(a).on('click', function () {

				var currentScrollTop = $(window).scrollTop(),
					targetScrollTop = $('#scroll_' + i).offset().top - 67 - 61 - $('.nav-sub-container').outerHeight() - $('.header-container').outerHeight();

				var targetText = $.trim($(a).text());

				if (targetScrollTop > currentScrollTop) {

					if (!$('.tab-scoll').hasClass('fixed-tab')) {
						targetScrollTop = targetScrollTop - 80;
					} else {
						targetScrollTop = targetScrollTop - 20;
					}

					if ($('.history-time-line').hasClass('fixed-history-time')) {
						targetScrollTop = targetScrollTop + 67;
					}

					// go down
					$('html, body').stop().animate({'scrollTop' : targetScrollTop }, 900, null, function () {
						$('.year-' + targetText).focus();
						$('.year-' + targetText).css('outline', 'none');
					});
				} else {

					targetScrollTop = targetScrollTop + 0;
					if (i === 0) {
						//targetScrollTop = targetScrollTop + 10;
					}

					// go up
					$('html, body').stop().animate({'scrollTop' : targetScrollTop }, 900, null, function () {
						if (i === 0) {
							setTimeout(function () {
								$('.history-time-line').addClass('fixed-history-time');
								$('.history-time-line').css('top', '160px');
							}, 50);
						}
						$('.year-' + targetText).focus();
						$('.year-' + targetText).css('outline', 'none');
					});
				}
			});
		});
	},
	stickySide: function() {
		var timeline = $('.history-time-line');
		var usp = $('.ui-scroll-point');
		if (usp.length > 0) {
			var scrollPointGroup = new Array();
			for (var i = 0; i < usp.length; i++) {
				if(i == 0) {scrollPointGroup[i] = (usp.eq(i).offset().top) - 71}
				else {scrollPointGroup[i] = (usp.eq(i).offset().top) - 110}
			}
		}
		if (timeline.length > 0) {
			var lineTop = (timeline.offset().top) - 120;
			$(window).on('scroll', function() {
				var wst = $(window).scrollTop();
				if (wst > lineTop) {timeline.addClass('ui-fixed')} else {timeline.removeClass('ui-fixed')}
				for (var i = 0; i < scrollPointGroup.length; i++) {
					if(timeline.hasClass('fixed-history-time') ){return false;}
					if(wst > scrollPointGroup[i]) {timeline.find('> a').removeClass('on'); timeline.find('> a').eq(i).addClass('on');}
				}
			});
			lg.onClick(timeline.find('> a'), function($my) {
				var idx = $my.index();
				timeline.find('> a').removeClass('on'); $my.addClass('on');

				$('html, body').stop().animate({'scrollTop' : (scrollPointGroup[idx] + 2) + 'px'}, 100);
			});
		}
	},
	topAnchor: function() {
		var goTop = $('.ui-btn-top'); goTop.stop().animate({'opacity' : '1'}, 0);
		var gap;
    document.addEventListener('scroll',function(e){
      clearTimeout(gap);
			gap = setTimeout(function() {lg.timeCall(500, function() {goTop.stop().animate({'opacity' : '1'}, 500);}); lg.onClick(goTop, function() {$('html, body').stop().animate({'scrollTop' : '0'}, 100)})}, 100);
			goTop.stop().animate({'opacity' : '1'}, 0);
		});
	},
	introImgLoad: function(wrap, box) {
		var wrapPoint = new Array();
		for (var i = 0; i < wrap.length; i++) {wrapPoint[i] = (wrap.eq(i).offset().top) - ($(window).height())}
		$(window).on('scroll', function() {
			var scPoint = $(window).scrollTop();
			for (var i = 0; i < wrapPoint.length; i++) {
				if (scPoint > wrapPoint[i] && wrap.eq(i).hasClass('ui-item-wrap')) {
					var delay = 0;
					wrap.eq(i).find(box).each(function() {
						var $this = $(this);
						var myIdx = $this.parent().index();
						if (myIdx == 0) {delay = 0} else {delay = (300 * myIdx)}
						lg.timeCall(delay, function() {
							$this.stop().animate({'top' : '0px', 'opacity' : '1'}, 200, 'easeOutQuad');
						});
					});
					wrap.eq(i).removeClass('ui-item-wrap');
				}
			}
		});
	},
	magazineLoad: function(ul) {
		var listPoint = new Array();
		var list = ul.find('> li');
		for (var i = 0; i < ul.find('> li').length; i++) {
			listPoint[i] = (list.eq(i).offset().top) - ($(window).height());
		}
		$(".ui-list-item .img").eq(0).css("opacity",1);
		$(".ui-list-item .info-area").eq(0).css("opacity",1);

		$(window).on('scroll', function() {
			var scPoint = $(window).scrollTop();
			for (var i = 0; i < listPoint.length; i++) {
				if (scPoint > listPoint[i] && list.eq(i).hasClass('ui-list-item')) {
					var delay = 0;
					list.eq(i).find('> div').each(function() {
						var $this = $(this);
						var myIdx = $this.index();
						if (myIdx == 0) {delay = 0} else {delay = (800 * myIdx)}
						lg.timeCall(delay, function() {
							$this.stop().animate({'top' : '0px', 'opacity' : '1'}, 1200, 'easeOutQuad');
						});
					});
					list.eq(i).removeClass('ui-list-item');
				}
			}
		});
	},
	historyLoad: function() {
		var heading = $('.history-list h3');
		var headingPoint = new Array();
		for (var i = 0; i < heading.length; i++) {headingPoint[i] = (heading.eq(i).offset().top) - ($(window).height())}
		var box = $('.history-box');
		var historyPoint = new Array();
		for (var i = 0; i < box.length; i++) {historyPoint[i] = (box.eq(i).offset().top) - ($(window).height())}
		$(window).on('scroll', function() {
			var scPoint = $(window).scrollTop();
			for (var i = 0; i < headingPoint.length; i++) {
				if (scPoint > headingPoint[i] && heading.eq(i).hasClass('ui-point-item')) {
					heading.each(function() {$(this).stop().animate({'top' : '0px', 'opacity' : '1'}, 1200, 'easeOutQuad')});
					heading.eq(i).removeClass('ui-point-item');
				}
			}
			for (var i = 0; i < historyPoint.length; i++) {
				if (scPoint > historyPoint[i] && box.eq(i).hasClass('ui-point-item')) {
					var delay = 0;
					box.eq(i).find('> div').each(function() {
						var $this = $(this);
						var myIdx = $this.index();
						if (myIdx == 0) {delay = 0} else {delay = (800 * myIdx)}
						lg.timeCall(delay, function() {
							$this.stop().animate({'top' : '0px', 'opacity' : '1'}, 1200, 'easeOutQuad');
						});
					});
					box.eq(i).removeClass('ui-point-item');
				}
			}
		});
	},
	boxTypeLoad: function(ul) {
		var onPoint = new Array();
		var list = ul.find('> li');
		for (var i = 0; i < ul.find('> li').length; i++) {
			onPoint[i] = (list.eq(i).offset().top) - ($(window).height());
		}
		$(window).on('scroll', function() {
			var scPoint = $(window).scrollTop();
			var myDelay = 0;
			list.each(function() {
				var $this = $(this);
				var iidx = $this.index();
				if (iidx%3 == 0) {myDelay = 0} else if (iidx%3 == 1) {myDelay = 400} else {myDelay = 800}
				if (scPoint > onPoint[iidx] && $(this).hasClass('ui-list-item')) {
					lg.timeCall(myDelay, function() {$this.stop().animate({'top' : '0px', 'opacity' : '1'}, 600, 'easeOutQuad')});
				}
			});
		});
	}
}

var firstWindowWidth = $(window).width(),
	//firstWindowHeight = $(window).height(),
	isOrientChange;

function imageLoad (img) {
	if ($(img).width() > $(img).height() && $(img).width() > $('.slide-container').width()) {
		$(img).css('width', '100%');
	} else {
		$(img).css('width', '');
	}

	$(window).on('resize', function () {

		if (isOrientChange) {
			return;
		}

		// 모바일 화면에서는 스크롤 시에도 resize 이벤트가 발생하기에 이를 방지하기 위함.
		if ( firstWindowWidth == $(window).width() /*&& firstWindowHeight == $(window).height()*/ ) {
			return;
		}

		if ($(img).width() > $(img).height() && $(img).width() > $('.slide-container').width()) {
			$(img).css('width', '100%');
		} else {
			$(img).css('width', '');
		}
	});
}

// 모바일 가로/세로 모드 변경시.
$(window).on('orientationchange', function () {
	isOrientChange = true;

	orientationChanged().then(function() {
		isOrientChange = false;
		$(window).trigger('resize');
		firstWindowWidth = $(window).width();
		//firstWindowHeight = $(window).height();
	});
});

// Wait until innerheight changes, for max 120 frames
function orientationChanged() {
	//const timeout = 120;
	var timeout = 120;
	
	return new window.Promise(function(resolve) {

		function go (i, height0) {
			window.innerHeight != height0 || i >= timeout ?
				resolve() :
				window.requestAnimationFrame(function() { go(i + 1, height0); });
		}

		/*const go = (i, height0) => {
			window.innerHeight != height0 || i >= timeout ?
				resolve() :
				window.requestAnimationFrame(() => go(i + 1, height0));
		};*/
		go(0, window.innerHeight);
	});
}

// slide module
$.fn.lgContentsImageSlide = function(data) {
	var box = this;

	box.addClass('swiper-wrapper');
	box.parent().addClass('swiper-container');

	var slideW = $('.ui-slide').width();
	var listboxW = (slideW * 3);
	var lastEq = (data.length - 1);
	if (isIE() && isIE() <= 9) {
		$('.ui-slide > div').css({'width' : slideW + 'px', 'overflow' : 'hidden'});
		box.css('width', listboxW + 'px');
	}

	var slideAct = function() {
	if(data.length > 0) {
		var imgs = {
			indicator: function() {
				$('.slide-dot').empty();
				for (var i = 0; i < data.length; i++) {
					$('.slide-dot').append('<button class="btn-dot" type="button"><span class="hide-txt">' + (i+1) + '/' + data.length + '</span></button>');
				}
			},
			grid: function(eq, ynBoolean) {
					var img = '<img src="' + data[eq].img + '" onerror="this.src=' + data[eq].errorImg + '" alt="' + data[eq].title + '" style="display: inline-block;" onload="imageLoad(this)">';
					var item = '<div class="slide-item swiper-slide" aria-hidden="' + ynBoolean + '" data-index="' + eq + '" >' + img + '</div>';
				box.append(item);
			},
			realGrid: function(idx) {
				box.empty();
				var prevIdx = 0, nextIdx = 0;
				if (idx == 0) {prevIdx = lastEq} else {prevIdx = (idx - 1)} imgs.grid(prevIdx, 'false');
				imgs.grid(idx, 'true');
				if (idx == lastEq) {nextIdx = 0} else {nextIdx = (idx + 1)} imgs.grid(nextIdx, 'false');
				if (isIE() && isIE() <= 9) {
					box.css('margin-left', (slideW * -1) + 'px');
					$('.slide-dot > button').removeClass('active'); $('.ui-select-txt').remove();
					$('.slide-dot > button').eq(idx).addClass('active').append('<span class="hide-txt ui-select-txt">선택됨</span>');
				}
			},
			prevEvent: function() {
				var firstIdx = parseInt(box.find('> .slide-item:first-child').attr('data-index'));
				box.stop().animate({'margin-left' : '0px'}, 200, function() {imgs.realGrid(firstIdx)});
			},
			nextEvent: function() {
				var lastIdx = parseInt(box.find('> .slide-item:last-child').attr('data-index'));
				box.stop().animate({'margin-left' : ((slideW * 2) * -1) + 'px'}, 200, function() {imgs.realGrid(lastIdx)});
			},
		}

		if (isIE() && isIE() <= 9) {
			imgs.indicator();
			imgs.realGrid(0);

			lg.onClick($('.btn-prev'), function() {if(box.css('margin-left') == (slideW * -1) + 'px') {imgs.prevEvent()}});
			lg.onClick($('.btn-next'), function() {if(box.css('margin-left') == (slideW * -1) + 'px') {imgs.nextEvent()}});
			lg.onClick($('.slide-dot > button'), function($this) {var myi = $this.index(); imgs.realGrid(myi)});

			if ( box.find('.slide-item').eq(2).attr('data-index') == 0 ){
				$('.slide-dot').remove();
				$('.slide-nav').remove();
				return false;
			}

			box.swipe({
				swipeStatus: function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {

					var swipeEvents = {
						moveSwipe: function() {
							switch (direction) {
								case 'left': box.css('margin-left', ((slideW * -1) - distance) + 'px'); break;
								case 'right': box.css('margin-left', ((slideW * -1) + distance) + 'px'); break;
								default: break;
							}
						},
						stopSwipe: function() {
							if (distance < 100) {box.stop().animate({'margin-left' : (slideW * -1) + 'px'}, 100)}
							else {
								switch (direction) {
									case 'left': imgs.nextEvent(); break;
									case 'right': imgs.prevEvent(); break;
									default: break;
								}
							}
						}
					}
					if (phase!='cancel' && phase!='end') {swipeEvents.moveSwipe()}
					if (phase=='cancel') {swipeEvents.stopSwipe()}
					if (phase=='end') {swipeEvents.stopSwipe()}

				},
				threshold: slideW,
				maxTimeThreshold: 5000,
				fingers: 'all',
				allowPageScroll:'vertical'
			});

		} else {

			data.forEach(function (d, i) {
				imgs.grid(i, 'true');
			});

			/**
			 * 테스트용 <a> link 삽입
			 */
			$('.view-img .swiper-container .slide-item').each(function (i, item) {
				var img = $(item).find('img'),
					link = $('<a target="_blank" aria-hidden="true" tabindex="-1">CLICK</a>');

				link.appendTo(item);
				link.attr('href', img.attr('src'));
				link.hide();
			});

			$('<div class="swiper-pagination"></div>').appendTo($('.swiper-container').parent());

			new Swiper('.view-img .swiper-container', {
				slidesPerView: 1,
				loop: true,
				spaceBetween: 10,
				autoHeight: true,
				updateOnImagesReady: true,
				navigation: {
					nextEl: '.view-img .btn-next',
					prevEl: '.view-img .btn-prev',
				},
				pagination: {
					el: '.view-img .swiper-pagination',
					type: 'bullets',
					bulletActiveClass: 'custom-swiper-active',
					clickable: true
				},
				on: {
					'slideChangeTransitionEnd': function () {
						setAccessibility(this);
					},
					'imagesReady': function () {
						var bullets = $('.swiper-container').parent().find('.swiper-pagination .swiper-pagination-bullet');
						bullets.attr('tabindex', 0);
						setAccessibility(this);
					},
					'init': function () {
						setAccessibility(this);
					}
				},
				a11y: {
					'prevSlideMessage': '이전 슬라이드로 이동',
					'nextSlideMessage': '다음 슬라이드로 이동',
					'paginationBulletMessage': '슬라이드 {{index}}'
				}
			});

			function setAccessibility (swiper) {
				$(swiper.slides).each(function (i, slide) {
					if ($(slide).hasClass('swiper-slide-active')) {
						if ($(slide)[0].nodeName.toLowerCase() !== 'div') {
							$(slide).attr('tabindex', 0);
						}
						$(slide).attr('aria-hidden', false);
					} else {
						if ($(slide)[0].nodeName.toLowerCase() !== 'div') {
							$(slide).attr('tabindex', -1);
						}
						$(slide).attr('aria-hidden', true);
					}
				});
				$(swiper.pagination.bullets).each(function (i, bullet) {
					if ($(bullet).hasClass('custom-swiper-active')) {
						$(bullet).attr('title', '선택됨');
					} else {
						$(bullet).attr('title', '');
					}
				});
			}
		}


//		if(box.find('.slide-item').length == 3){
//			$('.slide-dot').remove();
//			return false;
//		}




		}
	}
	slideAct();

	if (isIE() && isIE() <= 9) {
		$(window).resize(function() {
			slideW = $('.ui-slide').width();
			listboxW = (slideW * 3);
			$('.ui-slide > div').css({'width' : slideW + 'px', 'overflow' : 'hidden'});
			box.css('width', listboxW + 'px');
			slideAct();
		});
	}

}

// intro popup
var introPopup = {
	act: function(itemCont) {
		lg.onClick(itemCont, function($this) {
			var sp = $(window).scrollTop();
			var grands = $this.closest('.item-wrap').parent().attr('id');
			var myIdx = $this.parent().index();
			var popLayer = $('.popup-subsidiary');



			$('.dimm').css('z-index','101');
			lg.bodyStop(sp * -1);
			var myLayer;
			switch (grands) {
				case 'electron': myLayer = popLayer.eq(myIdx); break;
				case 'chemistry': myLayer = popLayer.eq(3 + myIdx); break;
				case 'communication': myLayer = popLayer.eq(6 + myIdx); break;
				case 'company': myLayer = popLayer.eq(13 + myIdx); break;
				case 'lxholdings': myLayer = popLayer.eq(14 + myIdx); break;
				default: break;
			}

			myLayer.show();
			console.log(myLayer.children('.pop-txt-wrap').outerHeight());
			var $num = myLayer.children('.pop-tit-wrap').outerHeight() * 2;
			myLayer.children('.pop-txt-wrap').css({'max-height':$num+50});
			myLayer.find('.tit').focus();
			popLayer.attr('aria-hidden', 'true');
			myLayer.attr('aria-hidden', 'false');
			//var areaGroup = [$('.skipnav'), $('.header-content'), $('.affiliates-area'), $('.gnb-container'), $('.nav-sub-container'), $('#container'), $('#footer')];
			//areaGroup.each(function() {$(this).attr('aria-hidden', 'true')});
			myLayer.find('.btn-close').on('focusout', function() {myLayer.find('p.tit').focus()});
			lg.onClick(myLayer.find('.btn-close'), function($close) {
				$close.closest(myLayer).hide();
				lg.bodyClear(sp);
				$this.focus();
				$('.dimm').css('z-index','99');
			});
		});
	}
}


$(window).resize(function() { });


/**
* 공지정보 관리 규정 - select script
*/
(function () {
  var select = $('.investment-mo-search select.selectbox');
  if (!select.length) {
     return;
  }

  var naviHeight = $('.nav-sub-container').height(); // 50

  select.on('change', function () {
     var targetVal = $(this).val();
     location.hash = '';

     location.href = location.href.replace('#', '') + '#' + targetVal;
     $(window).scrollTop( $('#' + targetVal).position().top - naviHeight  );
  });

  $('.investment-tab-item a').on('click',function(event){
	    event.preventDefault();
	    var targetVal = $(this).attr('href');
	    if(targetVal == "#agree01"){
	     naviHeight = 145
	    }else{
	     naviHeight = 120
	    }
	    location.hash = '';
	    $(window).scrollTop( $(targetVal).position().top - naviHeight  );
		setTimeout(function () {
			$(targetVal).attr('tabindex', -1);
			$(targetVal).focus();
		}, 200);
	   })
})();


/**
 *  사회공헌 페이지 - searchText 여부(#소외계층지원 등을 클릭)에 따라, scroll 포지션 이동.
 */
$(function () {
    // 사회공헌 페이지에서만 동작하도록.
    if (!$('.csr-social-contribution-wrap').length) {
        return;
    }

	$("#searchContent .selectbox").on( "change", function() {
		$('.btn02').trigger('click')
	});

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null) {
           return null;
        }
        return decodeURI(results[1]) || 0;
    }

    if ($.urlParam('searchText')) {
    	window.onload = function () {
    		$(window).scrollTop(362);
    	}
    }
});

/**
 *  gnb 메뉴 hover 시 상단 슬라이드 메뉴 숨기기
 */

$(function () {
    $('.ui-gnb-container .item').on('mouseover', function () {
       if ($('.affiliates-area').is(':visible')) {
           $('.btn-close-affiliates').trigger('click');
       }
    });
});

/**
 *  특정 도메인으로 리다이렉트
 */
 (function () {
    if (location.href.indexOf('m.lg.co.kr') > -1) {
        location.href = 'http://www.lg.co.kr';
    }
 })();

/**
 *  ESG 페이지
 */
$(function () {
	$("#wrap").addClass("loaded");

	if (!$('.esg-container').length) {
		return;
	}

	$(".policy-popup .txt-wrap").overlayScrollbars({});

	// policy popup
	var policyPopup = {
	    act: function (itemCont) {
	        lg.onClick(itemCont, function ($this) {
	            let myIdx = $this.index();
	            const popLayer = $(".policy-popup");

	            const myLayer = popLayer.eq(myIdx);

	            myLayer.show().siblings().hide();
	            myLayer.find("p.tit").focus();
	            popLayer.attr("aria-hidden", "true");
	            myLayer.attr("aria-hidden", "false");
	            myLayer.find(".btn-close").on("focusout", function () {
	                myLayer.find("p.tit").focus();
	            });
	            lg.onClick(myLayer.find(".btn-close"), function ($close) {
	                $close.closest(myLayer).hide();
	                $this.focus();
	            });
	        });
	    },
	};

	$(window).scroll(() => {
	    if (!$(".management-list").length) {
	        return;
	    }
	    let windowTop = $(window).scrollTop();
	    const headerHt = $("#header").find(".menu-list").innerHeight() + $("#header").find(".sub-list").innerHeight();
	    const listStartHt = $(".management-list").parents().offset().top - $(".management-list").parents().outerHeight() - headerHt;
	    const listEndHt = $(".management-list").offset().top + $(".management-list").innerHeight();

	    if (windowTop > listEndHt || windowTop < listStartHt) {
	        $(".policy-popup").attr("hidden", "false").hide();
	        $(".policy-popup").attr("hidden", "true");
	    } else {
	        policyPopup.act($(".management-list li"));
	    }
	});

	// Action Up
	var $text = $(".action-up");
	var sections = document.querySelectorAll(".action-up");
	let practiceTabIndex = [];
	let practiceTabIndexProt = [];
	var textAction = {
	    gsap: function ($el, idx) {
	        let gsapTimeline = gsap.timeline({
	            scrollTrigger: {
	                trigger: $el,
	                start: "top 100%",
	                end: "top 100%",
	                scrub: 2,
	                toggleClass: { targets: $el, className: "is-active" },
	                toggleActions: "play none none reverse",
	            },
	        });
	        gsapTimeline.to($el, { autoAlpha: 1, y: 0, duration: 2, delay: idx });
	    },
	    enter: function () {
	        Array.prototype.forEach.call(sections, function (item, idx) {
	            if ($(item).closest(".practice-tab-content").length) return;
	            textAction.gsap(item, idx);
	        });
	    },
	    set: function () {
	        gsap.set($text, { opacity: 0, y: 100 });
	    },
	    tab: function (idx) {
	        if (practiceTabIndexProt[idx]) return;
	        $(".practice-tab-content")
	            .eq(idx)
	            .find(".action-up")
	            .each((idx, item) => {
	                textAction.gsap(item, idx);
	            });
	    },
	};

	var $img = $(".action-scale");
	var images = document.querySelectorAll(".action-scale");
	var imgAction = {
	    enter: function () {
	        Array.prototype.forEach.call(images, function (i) {
	            gsap.to(i, {
	                scale: 1,
	                scrollTrigger: {
	                    trigger: i,
	                    start: "top+=30% 80%",
	                    end: "top+=30% 60%",
	                    scrub: 2,
	                    toggleClass: { targets: i, className: "is-active" },
	                    toggleActions: "play none none reverse",
	                },
	            });
	        });
	    },
	    set: function () {
	        gsap.set($img, { scale: 1.2, duration: 1 });
	    },
	};

	if ($text.length) textAction.set();
	textAction.enter();
	if ($img.length) imgAction.set();
	imgAction.enter();

	$(document).on("click", ".ripple-btn", function (e) {
	    if (this.getElementsByClassName("ripple").length > 0) {
	        this.removeChild(this.childNodes[1]);
	    }
	    let ripples = document.createElement("span");
	    let d = Math.max(this.clientWidth, this.clientHeight);
	    ripples.style.width = ripples.style.height = d + "px";
	    let x = e.pageX - $(e.target).offset().left - d / 2;
	    let y = e.pageY - $(e.target).offset().top - d / 2;
	    ripples.style.left = x + "px";
	    ripples.style.top = y + "px";
	    this.appendChild(ripples);
	    ripples.classList.add("ripple");
	});

	function set_cookie(name, value) {
	    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";path=/";
	}
	function get_cookie(name) {
	    var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
	    return value ? value[2] : 0;
	}

	$(document).on("click", ".practice-tab-btn", function (e) {
	    let index = $(this).index();
	    let cookieName = $(e.currentTarget).closest(".practice-tab-header").attr("data-cookie-name");
	    set_cookie(cookieName, index);
	    console.log(get_cookie(cookieName));
	    tabGsapAction(index);
	});

	if ($(".practice-tab-btn.active").length) {
	    let index = $(".practice-tab-btn.active").index();
	    let cookieName = $(".practice-tab-btn.active").closest(".practice-tab-header").attr("data-cookie-name");
	    index = get_cookie(cookieName);
	    tabGsapAction(index);
	}

	function tabGsapAction(index) {
	    practiceTabIndex[index] ? (practiceTabIndexProt[index] = true) : (practiceTabIndexProt[index] = false);
	    practiceTabIndex[index] = true;
	    $(".practice-tab-btn").removeClass("active").eq(index).addClass("active");
	    $(".practice-tab-content").removeClass("active").eq(index).addClass("active");
	    textAction.tab(index);
	}

	function setScreenSize() {
	    let vh = window.innerHeight * 0.01;
	    document.documentElement.style.setProperty("--vh", `${vh}px`);
	}
	let isTouchDevice;
	function deviceCheck() {
	    if (navigator.maxTouchPoints || "ontouchstart" in document.documentElement) {
	        isTouchDevice = true;
	    } else {
	        isTouchDevice = false;
	    }
	}

	setScreenSize();
	deviceCheck();
	$(window).resize(() => {
	    setScreenSize();
	    if (isTouchDevice) return;
	    deviceCheck();
	});

	$(()=>{
		if(!$(".esg-visual-area").length) return;
		let $contentWrap = $('.content-wrap');
		
		ScrollTrigger.create({
			trigger: $contentWrap,
			onEnter: () => goToContent($contentWrap)
		});

		let goToContentProt = true;
		function goToContent(eachPanel) {
			if(goToContentProt && window.scrollY > $(".esg-visual-area").outerHeight()){
				goToContentProt = false;
				return
			}
			$("#wrap").on("scroll touchmove mousewheel", function (event) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			});
			let windowScrollY;
			if (!window.matchMedia("(max-width: 1025px)").matches) {
				windowScrollY = $(eachPanel).offset().top - ($('.header-container').outerHeight() + $('.nav-sub-container').outerHeight()) + 1;
			} else {
				windowScrollY = $(eachPanel).offset().top - $('.header-container').outerHeight() + 1;
			}
			gsap.to(window, {
				scrollTo: {
					y: windowScrollY,
					autoKill: false,
					ease: "Power3.easeInOut"
				},
				duration: 0.85,
				onComplete: () => {
					$("#wrap").off("scroll touchmove mousewheel");
				}
			});
		}
	})
})