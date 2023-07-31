/* *******************************************************
 * filename : nav.js
 * description : 네비게이션 등 메뉴에 관련된 JS
 * date : 2023-07-28
******************************************************** */
/* *******************************************************
 * 구현 리스트
 * 개별, 통합 레이아웃
 * 모바일
******************************************************** */

let $header = $('#header'),
$gnb = $('#gnb'),
$gnbBg = $header.find('.gnb_overlay_bg'),
$depth1Item = $gnb.find('ul:eq(0)').children('li'),
$depth2Item = $gnb.find('.depth2_area'),
$depth2Height = $depth2Item.outerHeight(),
$focusableEl = $gnb.find('a');
$focusableElLast = $focusableEl.last();

Nav = {
	init: function() {
		Nav.total();
	},
	total: function() {
		$depth1Item.on('mouseenter focusin', function() {
			$header.addClass('gnb_open');
			$(this).addClass('active').siblings().removeClass('active');
			if(!$gnb.is('open')) {
				$gnb.addClass('open');
				$gnbBg.css('height', $depth2Height);
				$depth2Item.stop().show();
			}
		})
		$header.on('mouseleave focusout', function(e) {
			if(e.type == 'mouseleave' || e.target == $focusableElLast[0]) {
				$header.removeClass('gnb_open');
				$gnb.removeClass('open');
				$gnbBg.css('height', 0);
				$depth1Item.removeClass('active');
				$depth2Item.stop().hide();
			}
		})
	},
	each: function() {

	}
}
$(function() {
	Nav.init();
})