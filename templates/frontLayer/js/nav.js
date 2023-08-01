/* *******************************************************
 * filename : nav.js
 * description : 네비게이션 등 메뉴에 관련된 JS
 * date : 2023-07-28
******************************************************** */
/* *******************************************************
 * 구현 리스트
 * 모바일
******************************************************** */

let firstTabStop, lastTabStop;

// gnb PC
let $header = $('#header'),
$gnb = $('#gnb'),
$gnbBg = $header.find('.gnb_overlay_bg'),
$depth1List = $gnb.find('ul:eq(0)'),
$depth1Item = $gnb.find('ul:eq(0)').children('li'),
$depth2Item = $gnb.find('.depth2_area'),
$focusableEl = $gnb.find('a');
$focusableElLast = $focusableEl.last();

// gnb Mobile
let $gnbM = $('#gnbM'),
$btnMenuOpen = $('.menu_open'),
$depth1ItemM,
$depth2ItemM,
$focusableElM,
$focusableElLastM,
menuState = false;

Nav = {
	init: function() {
		// 모바일 버전
		if(fn.exists('#gnbM')) {
			if($gnbM.data('menu-clone')) {
				Nav.cloneMenu();
			}
			Nav.toggleNavButton();
			Nav.mobDepth2Click();
			Nav.focusMobMenu();
		}

		// pc 버전
		if($gnb.is('.total_menu')) {
			// 통합 레이아웃
			Nav.total();
		} else if($gnb.is('.each_menu')) {
			// 개별 레이아웃
			Nav.each();
		}
	},
	total: function() {
		$gnbBg.css({ height: Nav.maxHeight($depth2Item) });
		$depth2Item.css({ height: Nav.maxHeight($depth2Item) });

		$depth1Item.on('mouseenter focusin', function() {
			$header.addClass('gnb_open');
			$(this).addClass('active').siblings().removeClass('active');
			if(!$gnb.is('open')) {
				$gnb.addClass('open');
				$gnbBg.stop().slideDown();
				$depth2Item.stop().show();
			}
		})
		$header.on('mouseleave focusout', function(e) {
			if(e.type == 'mouseleave' || e.target == $focusableElLast[0]) {
				$header.removeClass('gnb_open');
				$gnb.removeClass('open');
				$gnbBg.stop().slideUp();
				$depth2Item.stop().hide();
				$depth1Item.removeClass('active');
			}
		})
	},
	each: function() {
		$depth1Item.on('mouseenter focusin', function() {
			$(this).addClass('active').siblings().removeClass('active');
		})
		$depth1Item.on('mouseleave', function() {
			$(this).removeClass('active');
		})
		$focusableElLast.on('focusout', function() {
			$depth1Item.removeClass('active');
		})
	},
	cloneMenu: function() {
		$depth1List.clone().appendTo($gnbM);

		if(fn.exists($gnbM.find('ul'))) {
			$depth1ItemM = $gnbM.find('ul:eq(0)').children('li'),
			$depth2ItemM = $gnbM.find('.depth2_area'),
			$focusableElM = $header.find('#gnbM a, .menu_open'),
			$focusableElLastM = $focusableElM.last();
		}

		return $depth1ItemM, $depth2ItemM, $focusableElM, $focusableElLastM;
	},
	toggleNavButton: function() {
		$btnMenuOpen.on('click', function() {
			menuState ? Nav.closeMobMenu() : Nav.openMobMenu();
		})
	},
	openMobMenu: function() {
		menuState = true;
		
		if($gnbM.is('.gnb_full')) {
			$gnbM.stop().slideDown();
		} else if($gnbM.is('.gnb_slide')) {
			$gnbM.stop().show("slide", { direction: "right" }, 400);
		}
		$header.addClass('gnb_mob_open');
	},
	closeMobMenu: function() {
		menuState = false;
		
		if($gnbM.is('.gnb_full')) {
			$gnbM.stop().slideUp();
		} else if($gnbM.is('.gnb_slide')) {
			$gnbM.stop().hide("slide", { direction: "right" }, 400);
		}
		Nav.closeMobDepth2();
		$header.removeClass('gnb_mob_open');
	},
	mobDepth2Click: function() {
		$depth1ItemM.on('click', function() {
			if($(this).hasClass('active')) {
				Nav.closeMobDepth2();
			} else {
				$(this).addClass('active').siblings().removeClass('active');
				$depth2ItemM.stop().slideUp();
				$(this).find('.depth2_area').stop().slideDown();
			}
		})
	},
	closeMobDepth2: function() {
		$depth1ItemM.removeClass('active');
		$depth2ItemM.stop().slideUp();
	},
	focusMobMenu: function() {
		firstTabStop = $btnMenuOpen,
		lastTabStop = $focusableElLastM[0];

		$focusableElM.each((idx, el) => {
			$(el).on('keydown', function(e) {
				Nav.trapTabKey(e);
			})
		})
	},
	addClassName: function(object, className = 'active') {
		$(object).addClass(className);
	},
	removeClassName: function(object, className = 'active') {
		$(object).removeClass(className);
	},
	trapTabKey: function(e) {
		// Check for TAB key press
		if (e.keyCode === 9) {
			// SHIFT + TAB
			if (e.shiftKey) {
				if (document.activeElement === firstTabStop) {
					e.preventDefault();
					lastTabStop.focus();
				}
			} else {
				if (document.activeElement === lastTabStop) {
					e.preventDefault();
					firstTabStop.focus();
				}
			}
		}
		// ESCAPE
		if (e.keyCode === 27) {
			// mobile header event
			$header.hasClass('gnb_mob_open') && Nav.closeMobMenu();

			firstTabStop.focus();
		}
	},
	maxHeight: function(object) {
		const heightArray = object.map(function () {
			return $(this).outerHeight(true);
		}).get();
		const maxHeight = Math.max.apply(Math, heightArray);

		return maxHeight;
	}
}
$(function() {
	Nav.init();
})