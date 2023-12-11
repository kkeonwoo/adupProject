/* *******************************************************
 * filename : nav.js
 * description : 네비게이션 등 메뉴에 관련된 JS
 * date : 2023-07-28
******************************************************** */

// // gnb PC
let $header = $('#header'),
	headerHt = $header.outerHeight(),
	$gnb = $('#gnb'),
	$firstItem = $gnb.find('a').first(),
	$LastItem = $gnb.find('a').last(),
	$depth1List = $gnb.find('.depth1_list'),
	$depth1Item = $gnb.find('.depth1_item'),
	$depth1Link = $depth1Item.children('a'),
	$depth2Item = $gnb.find('.depth2_list');


const Nav = {
	init: function() {
		$header.is('.type1') && this.type1();
		$header.is('.type2') && this.type2();
		$header.is('.type3') && this.type3();
		$header.is('.type4') && this.type4();
	},
	type1: function() {
		/**
		 * nav open function
		 * @param {event} e 
		 * @param {dom} t 
		 */
		const openMenu = (e, t) => {
			let dep1 = t ? t : e.currentTarget,
				dep2 = $(dep1).find('.depth2_list'),
				dep2Ht = fn.exists(dep2) && this.maxHeight(dep2);

			$header.children('div').css({ height: headerHt + dep2Ht });
			$depth2Item.stop().hide();
			$(dep2).stop().show();
		};
		const closeMenu = () => {
			$header.children('div').css({ height: headerHt });
			$depth2Item.stop().hide();
		};

		// open event
		$depth1Item.on('mouseenter focusin', openMenu);
		$depth1Link.on('keydown', function(e) {
			let dep1Idx = $(this).closest('.depth1_item').index();
			
			if (e.keyCode === 9 && e.shiftKey) openMenu(e, $('.depth1_item').eq(dep1Idx - 1).get(0));
		})

		// close event
		$header.on('mouseleave', closeMenu);
		$firstItem.on('keydown', (e) => { if(e.keyCode === 9 && e.shiftKey) closeMenu(); })
		$LastItem.on('focusout', closeMenu);
	},
	type2: function() {
		let $depth2Wrap = $('.gnb_depth2_wrapper'),
			$depth2List = $depth2Wrap.find('.depth2_list');

		const openMenu = () => { $depth2Wrap.stop().slideDown(); }
		const closeMenu = () => { $depth2Wrap.stop().slideUp(); }

		// open event
		$depth1Item.on('mouseenter focusin', openMenu);
		$depth2Wrap.on('mouseenter', openMenu);
		
		// close event
		$depth1Item.on('mouseleave', closeMenu);
		$depth2Wrap.on('mouseleave', closeMenu);

		// focus event
		$depth1Link.on('keydown', function (e) {
			let dep1Idx = $(this).closest('.depth1_item').index();
			
			if ( e.keyCode === 9 ) {
				if ( e.shiftKey ) {
					if (dep1Idx <= 0) return;
					e.preventDefault();
					$depth2List.eq(dep1Idx - 1).find('li').last().find('.depth2_link').get(0).focus();
				} else {
					e.preventDefault();
					$depth2List.eq(dep1Idx).find('.depth2_link').get(0).focus();
				}
			}
		})
		$depth2List.each((idx, item) => {
			let $depth2Item = $(item).find('li');
			
			$depth2Item.first().find('a').on('keydown', function(e) {
				if ( e.keyCode === 9 && e.shiftKey ) {
					e.preventDefault();
					$('.depth1_item').eq(idx).find('a').focus();
				}
			})
			$depth2Item.last().find('a').on('keydown', function(e) {
				if ( e.keyCode === 9 && idx < $depth2List.length - 1 && !e.shiftKey) {
					e.preventDefault();
					$('.depth1_item').eq(idx + 1).find('a').focus();
				}
			})
		})
		$firstItem.on('keydown', (e) => { if(e.keyCode === 9 && e.shiftKey) closeMenu(); })
		$LastItem.on('keydown', (e) => { if(e.keyCode === 9 && !e.shiftKey) closeMenu(); });
	},
	type3: function() {
		const openMenu = (e) => {
			let dep1 = e.currentTarget,
				dep2 = $(dep1).find('.depth2_list');

			$depth2Item.stop().hide();
			dep2.stop().show();
		}
		const closeMenu = () => {
			$depth2Item.stop().hide();
		}

		$depth1Item.on('mouseenter focusin', openMenu);
		$depth1Item.on('mouseleave', closeMenu);
		$firstItem.on('keydown', (e) => { if(e.keyCode === 9 && e.shiftKey) closeMenu(); })
		$LastItem.on('focusout', closeMenu);
	},
	type4: function() {
		let $depth1Area = $('.depth1_area'),
			$depth2Area = $('.depth2_area'),
			$depth2List = $depth2Area.find('.depth2_list'),
			$bgOverlay = $('.gnb_overlay_bg'),
			depth2Ht = this.maxHeight($depth2List);

			
		const openMenu = () => { 
			$bgOverlay.animate({ height : depth2Ht })
			$header.stop().animate({ height : headerHt + depth2Ht })
		}
		const closeMenu = () => { 
			$bgOverlay.animate({ height : 0 })
			$header.stop().animate({ height : headerHt })
		}

		// open event
		$depth1List.on('mouseenter focusin', openMenu);

		// close event
		$header.on('mouseleave', closeMenu);
		$firstItem.on('keydown', (e) => { if(e.keyCode === 9 && e.shiftKey) closeMenu(); })
		$LastItem.on('focusout', closeMenu);

		// focus event
		$depth1Link.on('keydown', function (e) {
			let dep1Idx = $(this).closest('.depth1_item').index();
			
			if ( e.keyCode === 9 ) {
				if ( e.shiftKey ) {
					if (dep1Idx <= 0) return;
					e.preventDefault();
					$depth2List.eq(dep1Idx - 1).find('li').last().find('.depth2_link').get(0).focus();
				} else {
					e.preventDefault();
					$depth2List.eq(dep1Idx).find('.depth2_link').get(0).focus();
				}
			}
		})
		$depth2List.each((idx, item) => {
			let $depth2Item = $(item).find('li');
			
			$depth2Item.first().find('a').on('keydown', function(e) {
				if ( e.keyCode === 9 && e.shiftKey ) {
					e.preventDefault();
					$('.depth1_item').eq(idx).find('.depth1_link').focus();
				}
			})
			$depth2Item.last().find('a').on('keydown', function(e) {
				if ( e.keyCode === 9 && idx < $depth2List.length - 1 && !e.shiftKey) {
					e.preventDefault();
					$('.depth1_item').eq(idx + 1).find('.depth1_link').focus();
				}
			})
		})
	},
	maxHeight: function(obj) {
		const heightArray = $(obj).map(function () {
			return $(this).outerHeight(true);
		});
		const maxHeight = Math.max(...heightArray);

		return maxHeight;
	}
}

$(function() {
	Nav.init();
})