/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
!function(a){var b=navigator.userAgent;a.HTMLPictureElement&&/ecko/.test(b)&&b.match(/rv\:(\d+)/)&&RegExp.$1<45&&addEventListener("resize",function(){var b,c=document.createElement("source"),d=function(a){var b,d,e=a.parentNode;"PICTURE"===e.nodeName.toUpperCase()?(b=c.cloneNode(),e.insertBefore(b,e.firstElementChild),setTimeout(function(){e.removeChild(b)})):(!a._pfLastSize||a.offsetWidth>a._pfLastSize)&&(a._pfLastSize=a.offsetWidth,d=a.sizes,a.sizes+=",100vw",setTimeout(function(){a.sizes=d}))},e=function(){var a,b=document.querySelectorAll("picture > img, img[srcset][sizes]");for(a=0;a<b.length;a++)d(b[a])},f=function(){clearTimeout(b),b=setTimeout(e,99)},g=a.matchMedia&&matchMedia("(orientation: landscape)"),h=function(){f(),g&&g.addListener&&g.addListener(f)};return c.srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",/^[c|i]|d$/.test(document.readyState||"")?h():document.addEventListener("DOMContentLoaded",h),f}())}(window),function(a,b,c){"use strict";function d(a){return" "===a||"	"===a||"\n"===a||"\f"===a||"\r"===a}function e(b,c){var d=new a.Image;return d.onerror=function(){A[b]=!1,ba()},d.onload=function(){A[b]=1===d.width,ba()},d.src=c,"pending"}function f(){M=!1,P=a.devicePixelRatio,N={},O={},s.DPR=P||1,Q.width=Math.max(a.innerWidth||0,z.clientWidth),Q.height=Math.max(a.innerHeight||0,z.clientHeight),Q.vw=Q.width/100,Q.vh=Q.height/100,r=[Q.height,Q.width,P].join("-"),Q.em=s.getEmValue(),Q.rem=Q.em}function g(a,b,c,d){var e,f,g,h;return"saveData"===B.algorithm?a>2.7?h=c+1:(f=b-c,e=Math.pow(a-.6,1.5),g=f*e,d&&(g+=.1*e),h=a+g):h=c>1?Math.sqrt(a*b):a,h>c}function h(a){var b,c=s.getSet(a),d=!1;"pending"!==c&&(d=r,c&&(b=s.setRes(c),s.applySetCandidate(b,a))),a[s.ns].evaled=d}function i(a,b){return a.res-b.res}function j(a,b,c){var d;return!c&&b&&(c=a[s.ns].sets,c=c&&c[c.length-1]),d=k(b,c),d&&(b=s.makeUrl(b),a[s.ns].curSrc=b,a[s.ns].curCan=d,d.res||aa(d,d.set.sizes)),d}function k(a,b){var c,d,e;if(a&&b)for(e=s.parseSet(b),a=s.makeUrl(a),c=0;c<e.length;c++)if(a===s.makeUrl(e[c].url)){d=e[c];break}return d}function l(a,b){var c,d,e,f,g=a.getElementsByTagName("source");for(c=0,d=g.length;d>c;c++)e=g[c],e[s.ns]=!0,f=e.getAttribute("srcset"),f&&b.push({srcset:f,media:e.getAttribute("media"),type:e.getAttribute("type"),sizes:e.getAttribute("sizes")})}function m(a,b){function c(b){var c,d=b.exec(a.substring(m));return d?(c=d[0],m+=c.length,c):void 0}function e(){var a,c,d,e,f,i,j,k,l,m=!1,o={};for(e=0;e<h.length;e++)f=h[e],i=f[f.length-1],j=f.substring(0,f.length-1),k=parseInt(j,10),l=parseFloat(j),X.test(j)&&"w"===i?((a||c)&&(m=!0),0===k?m=!0:a=k):Y.test(j)&&"x"===i?((a||c||d)&&(m=!0),0>l?m=!0:c=l):X.test(j)&&"h"===i?((d||c)&&(m=!0),0===k?m=!0:d=k):m=!0;m||(o.url=g,a&&(o.w=a),c&&(o.d=c),d&&(o.h=d),d||c||a||(o.d=1),1===o.d&&(b.has1x=!0),o.set=b,n.push(o))}function f(){for(c(T),i="",j="in descriptor";;){if(k=a.charAt(m),"in descriptor"===j)if(d(k))i&&(h.push(i),i="",j="after descriptor");else{if(","===k)return m+=1,i&&h.push(i),void e();if("("===k)i+=k,j="in parens";else{if(""===k)return i&&h.push(i),void e();i+=k}}else if("in parens"===j)if(")"===k)i+=k,j="in descriptor";else{if(""===k)return h.push(i),void e();i+=k}else if("after descriptor"===j)if(d(k));else{if(""===k)return void e();j="in descriptor",m-=1}m+=1}}for(var g,h,i,j,k,l=a.length,m=0,n=[];;){if(c(U),m>=l)return n;g=c(V),h=[],","===g.slice(-1)?(g=g.replace(W,""),e()):f()}}function n(a){function b(a){function b(){f&&(g.push(f),f="")}function c(){g[0]&&(h.push(g),g=[])}for(var e,f="",g=[],h=[],i=0,j=0,k=!1;;){if(e=a.charAt(j),""===e)return b(),c(),h;if(k){if("*"===e&&"/"===a[j+1]){k=!1,j+=2,b();continue}j+=1}else{if(d(e)){if(a.charAt(j-1)&&d(a.charAt(j-1))||!f){j+=1;continue}if(0===i){b(),j+=1;continue}e=" "}else if("("===e)i+=1;else if(")"===e)i-=1;else{if(","===e){b(),c(),j+=1;continue}if("/"===e&&"*"===a.charAt(j+1)){k=!0,j+=2;continue}}f+=e,j+=1}}}function c(a){return k.test(a)&&parseFloat(a)>=0?!0:l.test(a)?!0:"0"===a||"-0"===a||"+0"===a?!0:!1}var e,f,g,h,i,j,k=/^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,l=/^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;for(f=b(a),g=f.length,e=0;g>e;e++)if(h=f[e],i=h[h.length-1],c(i)){if(j=i,h.pop(),0===h.length)return j;if(h=h.join(" "),s.matchesMedia(h))return j}return"100vw"}b.createElement("picture");var o,p,q,r,s={},t=!1,u=function(){},v=b.createElement("img"),w=v.getAttribute,x=v.setAttribute,y=v.removeAttribute,z=b.documentElement,A={},B={algorithm:""},C="data-pfsrc",D=C+"set",E=navigator.userAgent,F=/rident/.test(E)||/ecko/.test(E)&&E.match(/rv\:(\d+)/)&&RegExp.$1>35,G="currentSrc",H=/\s+\+?\d+(e\d+)?w/,I=/(\([^)]+\))?\s*(.+)/,J=a.picturefillCFG,K="position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",L="font-size:100%!important;",M=!0,N={},O={},P=a.devicePixelRatio,Q={px:1,"in":96},R=b.createElement("a"),S=!1,T=/^[ \t\n\r\u000c]+/,U=/^[, \t\n\r\u000c]+/,V=/^[^ \t\n\r\u000c]+/,W=/[,]+$/,X=/^\d+$/,Y=/^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,Z=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d||!1):a.attachEvent&&a.attachEvent("on"+b,c)},$=function(a){var b={};return function(c){return c in b||(b[c]=a(c)),b[c]}},_=function(){var a=/^([\d\.]+)(em|vw|px)$/,b=function(){for(var a=arguments,b=0,c=a[0];++b in a;)c=c.replace(a[b],a[++b]);return c},c=$(function(a){return"return "+b((a||"").toLowerCase(),/\band\b/g,"&&",/,/g,"||",/min-([a-z-\s]+):/g,"e.$1>=",/max-([a-z-\s]+):/g,"e.$1<=",/calc([^)]+)/g,"($1)",/(\d+[\.]*[\d]*)([a-z]+)/g,"($1 * e.$2)",/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,"")+";"});return function(b,d){var e;if(!(b in N))if(N[b]=!1,d&&(e=b.match(a)))N[b]=e[1]*Q[e[2]];else try{N[b]=new Function("e",c(b))(Q)}catch(f){}return N[b]}}(),aa=function(a,b){return a.w?(a.cWidth=s.calcListLength(b||"100vw"),a.res=a.w/a.cWidth):a.res=a.d,a},ba=function(a){if(t){var c,d,e,f=a||{};if(f.elements&&1===f.elements.nodeType&&("IMG"===f.elements.nodeName.toUpperCase()?f.elements=[f.elements]:(f.context=f.elements,f.elements=null)),c=f.elements||s.qsa(f.context||b,f.reevaluate||f.reselect?s.sel:s.selShort),e=c.length){for(s.setupRun(f),S=!0,d=0;e>d;d++)s.fillImg(c[d],f);s.teardownRun(f)}}};o=a.console&&console.warn?function(a){console.warn(a)}:u,G in v||(G="src"),A["image/jpeg"]=!0,A["image/gif"]=!0,A["image/png"]=!0,A["image/svg+xml"]=b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"),s.ns=("pf"+(new Date).getTime()).substr(0,9),s.supSrcset="srcset"in v,s.supSizes="sizes"in v,s.supPicture=!!a.HTMLPictureElement,s.supSrcset&&s.supPicture&&!s.supSizes&&!function(a){v.srcset="data:,a",a.src="data:,a",s.supSrcset=v.complete===a.complete,s.supPicture=s.supSrcset&&s.supPicture}(b.createElement("img")),s.supSrcset&&!s.supSizes?!function(){var a="data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==",c="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",d=b.createElement("img"),e=function(){var a=d.width;2===a&&(s.supSizes=!0),q=s.supSrcset&&!s.supSizes,t=!0,setTimeout(ba)};d.onload=e,d.onerror=e,d.setAttribute("sizes","9px"),d.srcset=c+" 1w,"+a+" 9w",d.src=c}():t=!0,s.selShort="picture>img,img[srcset]",s.sel=s.selShort,s.cfg=B,s.DPR=P||1,s.u=Q,s.types=A,s.setSize=u,s.makeUrl=$(function(a){return R.href=a,R.href}),s.qsa=function(a,b){return"querySelector"in a?a.querySelectorAll(b):[]},s.matchesMedia=function(){return a.matchMedia&&(matchMedia("(min-width: 0.1em)")||{}).matches?s.matchesMedia=function(a){return!a||matchMedia(a).matches}:s.matchesMedia=s.mMQ,s.matchesMedia.apply(this,arguments)},s.mMQ=function(a){return a?_(a):!0},s.calcLength=function(a){var b=_(a,!0)||!1;return 0>b&&(b=!1),b},s.supportsType=function(a){return a?A[a]:!0},s.parseSize=$(function(a){var b=(a||"").match(I);return{media:b&&b[1],length:b&&b[2]}}),s.parseSet=function(a){return a.cands||(a.cands=m(a.srcset,a)),a.cands},s.getEmValue=function(){var a;if(!p&&(a=b.body)){var c=b.createElement("div"),d=z.style.cssText,e=a.style.cssText;c.style.cssText=K,z.style.cssText=L,a.style.cssText=L,a.appendChild(c),p=c.offsetWidth,a.removeChild(c),p=parseFloat(p,10),z.style.cssText=d,a.style.cssText=e}return p||16},s.calcListLength=function(a){if(!(a in O)||B.uT){var b=s.calcLength(n(a));O[a]=b?b:Q.width}return O[a]},s.setRes=function(a){var b;if(a){b=s.parseSet(a);for(var c=0,d=b.length;d>c;c++)aa(b[c],a.sizes)}return b},s.setRes.res=aa,s.applySetCandidate=function(a,b){if(a.length){var c,d,e,f,h,k,l,m,n,o=b[s.ns],p=s.DPR;if(k=o.curSrc||b[G],l=o.curCan||j(b,k,a[0].set),l&&l.set===a[0].set&&(n=F&&!b.complete&&l.res-.1>p,n||(l.cached=!0,l.res>=p&&(h=l))),!h)for(a.sort(i),f=a.length,h=a[f-1],d=0;f>d;d++)if(c=a[d],c.res>=p){e=d-1,h=a[e]&&(n||k!==s.makeUrl(c.url))&&g(a[e].res,c.res,p,a[e].cached)?a[e]:c;break}h&&(m=s.makeUrl(h.url),o.curSrc=m,o.curCan=h,m!==k&&s.setSrc(b,h),s.setSize(b))}},s.setSrc=function(a,b){var c;a.src=b.url,"image/svg+xml"===b.set.type&&(c=a.style.width,a.style.width=a.offsetWidth+1+"px",a.offsetWidth+1&&(a.style.width=c))},s.getSet=function(a){var b,c,d,e=!1,f=a[s.ns].sets;for(b=0;b<f.length&&!e;b++)if(c=f[b],c.srcset&&s.matchesMedia(c.media)&&(d=s.supportsType(c.type))){"pending"===d&&(c=d),e=c;break}return e},s.parseSets=function(a,b,d){var e,f,g,h,i=b&&"PICTURE"===b.nodeName.toUpperCase(),j=a[s.ns];(j.src===c||d.src)&&(j.src=w.call(a,"src"),j.src?x.call(a,C,j.src):y.call(a,C)),(j.srcset===c||d.srcset||!s.supSrcset||a.srcset)&&(e=w.call(a,"srcset"),j.srcset=e,h=!0),j.sets=[],i&&(j.pic=!0,l(b,j.sets)),j.srcset?(f={srcset:j.srcset,sizes:w.call(a,"sizes")},j.sets.push(f),g=(q||j.src)&&H.test(j.srcset||""),g||!j.src||k(j.src,f)||f.has1x||(f.srcset+=", "+j.src,f.cands.push({url:j.src,d:1,set:f}))):j.src&&j.sets.push({srcset:j.src,sizes:null}),j.curCan=null,j.curSrc=c,j.supported=!(i||f&&!s.supSrcset||g&&!s.supSizes),h&&s.supSrcset&&!j.supported&&(e?(x.call(a,D,e),a.srcset=""):y.call(a,D)),j.supported&&!j.srcset&&(!j.src&&a.src||a.src!==s.makeUrl(j.src))&&(null===j.src?a.removeAttribute("src"):a.src=j.src),j.parsed=!0},s.fillImg=function(a,b){var c,d=b.reselect||b.reevaluate;a[s.ns]||(a[s.ns]={}),c=a[s.ns],(d||c.evaled!==r)&&((!c.parsed||b.reevaluate)&&s.parseSets(a,a.parentNode,b),c.supported?c.evaled=r:h(a))},s.setupRun=function(){(!S||M||P!==a.devicePixelRatio)&&f()},s.supPicture?(ba=u,s.fillImg=u):!function(){var c,d=a.attachEvent?/d$|^c/:/d$|^c|^i/,e=function(){var a=b.readyState||"";f=setTimeout(e,"loading"===a?200:999),b.body&&(s.fillImgs(),c=c||d.test(a),c&&clearTimeout(f))},f=setTimeout(e,b.body?9:99),g=function(a,b){var c,d,e=function(){var f=new Date-d;b>f?c=setTimeout(e,b-f):(c=null,a())};return function(){d=new Date,c||(c=setTimeout(e,b))}},h=z.clientHeight,i=function(){M=Math.max(a.innerWidth||0,z.clientWidth)!==Q.width||z.clientHeight!==h,h=z.clientHeight,M&&s.fillImgs()};Z(a,"resize",g(i,99)),Z(b,"readystatechange",e)}(),s.picturefill=ba,s.fillImgs=ba,s.teardownRun=u,ba._=s,a.picturefillCFG={pf:s,push:function(a){var b=a.shift();"function"==typeof s[b]?s[b].apply(s,a):(B[b]=a[0],S&&s.fillImgs({reselect:!0}))}};for(;J&&J.length;)a.picturefillCFG.push(J.shift());a.picturefill=ba,"object"==typeof module&&"object"==typeof module.exports?module.exports=ba:"function"==typeof define&&define.amd&&define("picturefill",function(){return ba}),s.supPicture||(A["image/webp"]=e("image/webp","data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))}(window,document);

var _win = $(window);
var depthArr = [];

var winResize = {
	init : function(){
		var _body = $('body');
		/*2023-02-09 웹접근성 메뉴 구조 변경*/
        $('.gnb, .gnb > ul > li, .depth2 > li').removeClass('on');
        if(_win.width()<901){
            _body.addClass('mobile').removeClass('pc');
            winResize.mobileEvent();
            /*2023-03-07 웹접근성 메뉴 구조 변경*/
            winResize.menuResize();
            /*2023-03-07 웹접근성 메뉴 구조 변경*/
        }else{
            _body.removeClass('mobile').addClass('pc');
            winResize.pcEvent();
        }
        /*//2023-02-09 웹접근성 메뉴 구조 변경*/
	},

	pcEvent : function(){
		/*2023-02-14 웹접근성 메뉴 구조 변경*/
        var gnbItem = $('.gnb > ul > li');

        $('.sub_menu .depth3').show();
        $('.sub_menu').attr('style','');

        $('.sub_menu .depth2').each(function(index){ // 빈 li 채우기
            if(_win.width()>=901){
                var _index = $(this).index();
                var menuListNodes = $(this).find('> li');
                var menuListNodes_cnt = menuListNodes.length;
                var i_multiple = 4; //나눌 수
                var remainder = menuListNodes_cnt % i_multiple;
                var addCnt = (i_multiple - remainder) === 4 ? 0 : i_multiple - remainder; //추가해야할 갯수
                for (var i = 0; i < addCnt ; i++) {
                    $(this).append("<li></li>");
                };
            }
        });

        gnbItem.each(function(){
            $(this).on('mouseleave focusout', function(){
                if(_win.width()>=901){
                    var _index = $(this).index();
                    $(this).find('.sub_menu').stop().slideUp();
                    $(this).removeClass('on');
                    $(this).find('a').removeClass('tabStart tabEnd');
                }
            });
            $(this).on('mouseenter focusin', function(){
                if(_win.width()>=901){
                    var _index = $(this).index();
                    $(this).find('.sub_menu').stop().slideDown();
                    $(this).addClass('on').siblings().removeClass('on');
                    $(this).find('.sub_menu .depth2 > li').find('a').first().addClass('tabStart');
                    $('.gnb li.mycardif').find('.depth2 > li').find('a').last().addClass('tabEnd');
                }
            });
        });

        $('.header').on('mouseleave blur', function(){
            if(_win.width()>=901){
                setTimeout(function(){
                    gnbItem.removeClass('on')
                },300)
                $('.sub_menu').stop().slideUp();
            }
        });

        $(window).keydown(function(event){
            var v_keyCode = event.keyCode || event.which;
            if(v_keyCode == 9){
                //메뉴의 마지막 탭인지 확인
                var lastTab = $(':focus').attr('class');
                if(lastTab === 'tabEnd'){
                    $('.sub_menu').hide();
                }
            };
        });
        /*//2023-02-14 웹접근성 메뉴 구조 변경*/

	},
	mobileEvent : function(){
		/*2023-02-17 웹접근성 메뉴 구조 변경*/
        var gnbItem = $('.gnb > ul > li');

        $('.m_top, .gnb, body, .gnb-toggle').removeClass('on');
        gnbItem.removeClass('on').eq(0).addClass('on');
        $('.gnb > ul').scrollTop(0);
        $('.sub_menu .depth3').hide();
        $('.sub_menu').attr('style','');

        gnbItem.each(function(){
            $(this).children('a').off('click focusin');
            $(this).children('a').on('click focusin',function(e){
                e.preventDefault();

                var menuIdx;
                if($('.header').hasClass('mycardif')){
                    menuIdx = $(this).parent().index();
                }else{
                    menuIdx = $(this).parent().index() === 5 ? 4 : $(this).parent().index();
                }

                winResize.menuHeight();

                $('.gnb > ul').off('scroll');
                if(_win.width()<901){
                    var prevTop = $('.gnb > ul').scrollTop();

                    gnbItem.removeClass('on');
                    gnbItem.not('.mycardif').eq(menuIdx).addClass('on');
                    $('.menu-tit').removeClass('on');
                    $('.gnb > ul').stop().animate({scrollTop: depthArr[menuIdx]},1000,function(){
                        winResize.mobileScroll();

                        var cntTop = $('.gnb > ul').scrollTop();
                        if(prevTop > cntTop){
                            gnbItem.not('.mycardif').eq(menuIdx).find('.menu-tit').addClass('on');
                        }
                    });
                }
            });
        });
        /*2023-02-17 웹접근성 메뉴 구조 변경*/

        $('.gnb').find('.depth2 > li').each(function(){
            if($(this).children().not('a').length>0){
                $(this).addClass('hasChild');
                $(this).children('a').attr('href','javascript:void(0)');
            }
            $(this).children('a').off('click');
            $(this).children('a').on('click', function(e){
                if(_win.width()<901){
                    $(this).closest('li').toggleClass('on');
                    $(this).next('.depth3').stop().slideToggle();
                }
            });
        });

        winResize.mobileScroll();

        $('.gnb > ul > li:eq(0)').find('> a').addClass('mobilePopStart');
        $('.sub_menu').find('a').last().addClass('mobilePopEnd');
        $('.sub_menu').find('a').last().closest('.hasChild').find('> a').addClass('mobilePopParentEnd');

        /*2023-02-17 웹접근성 메뉴 구조 변경*/
        $(window).keydown(function(event){
            var v_keyCode = event.keyCode || event.which;
            //메뉴의 마지막 탭인지 확인
            var lastTab = $(':focus').attr('class');
            if(v_keyCode == 9){
                if(lastTab === 'mobilePopEnd'){
                    if(!$('.header').hasClass('mycardif')){
                        $('.gnb_Appdown').focus();
                    }else{
                        $('.gnb-toggle').focus();
                    }
                }else if(lastTab === 'mobilePopParentEnd'){
                    if(!$(this).parent().hasClass('on')){
                        $('.gnb_Appdown').focus();
                    }
                }else if(lastTab === 'icon_home'){
                    $('.gnb > ul > li:eq(0) > a').focus();
                }
            };

            if(event.shiftKey && event.keyCode == 9){
                if(lastTab === 'mobilePopStart'){
                    if(!$('.header').hasClass('mycardif')){
                        $('.logo').focus();
                    }else{
                        $('.icon_home').focus();
                    }
                }
            };
        });
        /*//2023-02-17 웹접근성 메뉴 구조 변경*/
	},
	mobileScroll : function(){
		/*2023-02-14 웹접근성 메뉴 구조 변경*/
        $('.gnb > ul').on('scroll', function(){
            if(_win.width()<901){
                winResize.menuHeight();

                for(var i = 0; i < $('.gnb > ul > li:not(.mycardif)').length+1; i++){

                    if($(this).scrollTop() < depthArr[i] && $(this).scrollTop() >= depthArr[i-1]){
                        $('.menu-tit').removeClass('on');
                        $('.mobile .gnb > ul > li:not(.mycardif)').removeClass('on').eq(i-1).addClass('on');
                        $('.mobile .gnb > ul > li:not(.mycardif)').eq(i-1).find('.menu-tit').addClass('on');
                    }else if($('.mobile .gnb > ul').scrollTop() <= 0){
                        $('.mobile .gnb > ul > li, .menu-tit').removeClass('on');
                        $('.mobile .gnb > ul > li').eq(0).addClass('on');
                        $('.mobile .gnb > ul > li').eq(0).find('.menu-tit').addClass('on');
                    }
                }

            }
        });
        /*//2023-02-14 웹접근성 메뉴 구조 변경*/
	},
	menuHeight : function(){
		depthArr = [];
		depthArr.push(0);

		var total = 0;
		/*2023-02-09 웹접근성 메뉴 구조 변경*/
        $('.gnb > ul > li:not(.mycardif)').each(function(){
            total = total + $(this).height() + 20
            depthArr.push(total);
        });
        /*//2023-02-09 웹접근성 메뉴 구조 변경*/
	},
    /*2023-03-07 웹접근성 메뉴 구조 변경*/
    menuResize : function(){
        menuArr = [];
        /*2023-03-17 웹접근성 메뉴 구조 변경*/
        menuOffset = $('.gnb > ul > li:eq(0) > a').length ? $('.m_top').outerHeight() + 18 : 78;
        menuArr.push(menuOffset);
        /*//2023-03-17 웹접근성 메뉴 구조 변경*/

        var menuPosition = menuOffset;
        $('.gnb > ul > li:not(.mycardif) > a').each(function(index){
            menuPosition = menuPosition + $(this).outerHeight(true);
            menuArr.push(menuPosition);

            $(this).css({top:menuArr[index]})
        });
    },
    /*//2023-03-07 웹접근성 메뉴 구조 변경*/

}

$(function(){
	winResize.init();

	// mobile gnb toggle
    $('.gnb-toggle').on('click', function(){
        /*2023-02-14 웹접근성 메뉴 구조 변경*/
        if($(this).hasClass('on')){
            $(this).removeClass('on').text('전체메뉴 열기');
            $('.m_top, .sub_menu').attr('aria-hidden', 'true');
            $('.m_top, .gnb, body').removeClass('on')
            $('body').removeClass('hidden');
            setTimeout(function(){
                $('.mobile .gnb > ul').scrollTop(0);
                $('.menu-tit, .mobile .gnb > ul li').removeClass('on');
                $('.mobile .gnb > ul > li').eq(0).addClass('on');
                $('.sub_menu .depth3').hide();
            },900)
        }else{
            $(this).addClass('on').text('전체메뉴 닫기');;
            $('.m_top, .sub_menu').attr('aria-hidden', 'false');
            $('.m_top, .gnb').addClass('on')
            setTimeout(function(){
                $('body').addClass('on');
            },900)
        }
        /*//2023-02-14 웹접근성 메뉴 구조 변경*/
    });

	// swipe
    /* 2024-02-23 홈페이지 리뉴얼 수정 */
	var swiper = new Swiper(".main-swipe-wrap .main-swiper", {
		slidesPerView: 'auto',
        spaceBetween: 10,
        loop: true,
		observer: true,
        observeParents: true,
		pagination: {
            el: ".main-swipe-wrap .swiper-pagination",
			type: "progressbar",
		},
        navigation: {
            nextEl: ".main-swipe-wrap .main-swiper + .btn_wrap .swiper-button-next",
            prevEl: ".main-swipe-wrap .main-swiper + .btn_wrap .swiper-button-prev",
        },
        breakpoints: {
            900: {
                spaceBetween: 200,
                centeredSlides: true,
            },
        }
	});

    let swiperLength = $('.lifeBn .swiper-slide:not(.swiper-slide-duplicate)').length;
    let $cur = $('.lifeBn .cur');
    let $tot = $('.lifeBn .tot');
    let swiperActIdx, perView;

    // swipe
	var lifeBnSwiper = new Swiper(".lifeBn .main-swiper", {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 0,
        loop: true,
		observer: true,
        observeParents: true,
		pagination: {
			el: ".lifeBn .main-swiper + .swiper_controller .swiper-pagination",
            type: 'progressbar',
		},
        navigation: {
            nextEl: ".lifeBn .main-swiper + .swiper_controller .swiper-button-next",
            prevEl: ".lifeBn .main-swiper + .swiper_controller .swiper-button-prev",
        },
        breakpoints: {
            900: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 72,
            },
            661: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 64,
            }
        },
        on: {
            slideChange: function() {
                swiperIdxUpdate();
            }
        }
	});
    
    // 초기값 세팅
    perView = lifeBnSwiper.slidesPerViewDynamic();
    swiperActIdx = (lifeBnSwiper.realIndex / perView) + 1;
    $cur.text(swiperActIdx);
    $tot.text(Math.ceil(swiperLength / perView));

    // slidesPerView 값 대응
    $(window).on('resize', function() {
        perView = lifeBnSwiper.slidesPerViewDynamic();
        swiperActIdx = Math.floor((lifeBnSwiper.realIndex / perView) + 1);
        $cur.text(swiperActIdx);
        $tot.text(Math.ceil(swiperLength / perView));
    })

    $('.lifeBn .btn.btn_round').on('click', () => {
        swiperIdxUpdate();
    })
    
    function swiperIdxUpdate() {
        swiperActIdx = (lifeBnSwiper.realIndex / perView) + 1;
        $cur.text(swiperActIdx);
    }
    /* // 2024-02-23 홈페이지 리뉴얼 수정 */

	// bottom banner
	$('.slider > .page-btns > .page-btn').click(function(){
		var $clicked = $(this);
		var $slider = $(this).closest('.slider');

		var index = $(this).index();
		var isLeft = index == 0;

		var $current = $slider.find(' > .slides > .bn.active');
		var $post;

		if ( isLeft ){
			$post = $current.prev();
		}
		else {
			$post = $current.next();
		}

		if ( $post.length == 0 ){
			if ( isLeft ){
				$post = $slider.find(' > .slides > .bn:last-child');
			}
			else {
				$post = $slider.find(' > .slides > .bn:first-child');
			}
		}

		$current.removeClass('active');
		$post.addClass('active');

		updateCurrentPageNumber();
	});

    /* google analytics click 이벤트 캐치때문에 자동 이미지 교체는 중지 시킴!
	setInterval(function(){
		$('.slider > .page-btns > .n-btn').click();
	}, 2500);
    */

	// 슬라이더 페이지 번호 지정
	function pageNumber__Init(){
		var totalSlideNo = $('.slider > .slides > .bn').length;

		$('.slider').attr('data-slide-total', totalSlideNo);

		$('.slider > .slides > .bn').each(function(index, node){
			$(node).attr('data-slide-no', index + 1);
		});
	};

	pageNumber__Init();

	// 슬라이더 이동시 페이지 번호 변경
	function updateCurrentPageNumber(){
		var totalSlideNo = $('.slider').attr('data-slide-total');
		var currentSlideNo = $('.slider > .slides > .bn.active').attr('data-slide-no');

		$('.slider > .page-btns > .page-no > .total-slide-no').html(totalSlideNo);
		$('.slider > .page-btns > .page-no > .current-slide-no').html(currentSlideNo);
	};

	updateCurrentPageNumber()

    /*2023-02-09 웹접근성 메뉴 구조 변경*/
    $(window).keydown(function(event){
        var v_keyCode = event.keyCode || event.which;
        if (v_keyCode == 9) {
            //메뉴의 마지막 탭인지 확인
            var lastTab = $(":focus").parent().attr("class");

            if (lastTab == "popEnd") {
                uiStyle.fullLayer.closeLayer("pop_allmenu");
                event.preventDefault();
                $("#layermask").hide().remove();
                $(".layerwrap").hide();
                $(".openSitemap.layerpop").focus();
            }
        }
    });
    /*//2023-02-09 웹접근성 메뉴 구조 변경*/

});

/*2023-03-02 웹접근성 메뉴 구조 변경*/
function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setScreenSize();
window.addEventListener('resize', setScreenSize);
/*//2023-03-02 웹접근성 메뉴 구조 변경*/

$(window).resize(function(){
	winResize.init();
})

