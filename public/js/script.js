var winHeight = 0,
winWidth = 0,
preWidth = 0,
winCenter = 0,
scrollPos = 0,
winAbstand = 0,
SortSet = 0,
effect = new Array(),
headerWidth = 0,
textHeight = new Array(),
headerHeight = 0,
slowSpeed = 1.5, // Scrollgeschwindigkeit
reverseSpeed = 0.5, // Scrollgeschwindigkeit für entgegengesetzt laufende Elemente
blocks = new Array();// Array für die einzelnen Blöcke mit Prarallax-Effekt


function getDim(){
	"use strict";	
	preWidth = winWidth;
	winHeight = $(window).outerHeight();
	winWidth = $(window).outerHeight();
	winCenter = ($(window).outerHeight()/2);
	winAbstand = ($(window).outerHeight()/1.05);
	scrollPos = $(window).scrollTop();
	headerHeight = $('#header').height();
	headerWidth = $('#header').width();
	$('.menu-bg').css({'height':headerHeight,'width':headerWidth});

	var i = 1, // Zählervariable
	superMargin = 0; // Abstand nach oben
	$('#section').children('div').each(function(){
		if($(this).hasClass('content-parallax') || $(this).hasClass('content-parallax-wide')){
			blocks[i] = new Object(),
			blocks[i]['height'] = $(this).outerHeight(), // Sectionhöhe
			blocks[i]['half'] = Math.ceil(blocks[i]['height']/2), // Halbe Sectionhöhe
			blocks[i]['pheight'] = $(this).find('.content-bg').outerHeight(); // Höhe des Paralax-Elements
			blocks[i]['phalf'] = Math.ceil(blocks[i]['pheight']/2), // Halbe Höhe des Paralax-Elements
			blocks[i]['bottom'] = (superMargin+blocks[i]['height']), // Höhe + Position der Section
			blocks[i]['center'] = (superMargin+blocks[i]['half']), // Halbe Höhe + Position der Section
			blocks[i]['centerPos'] = Math.ceil(blocks[i]['half']-blocks[i]['phalf']), // Center-Position innerhalb der Section
			blocks[i]['superMargin'] = superMargin, // Abstand nach oben
			i++; // Zähler + 1
			//console.dir(blocks);
		}
		superMargin = superMargin+$(this).outerHeight(); // Abstand nach oben zum weiterrechnen
	});
}

function parallaX(){
	var scrollPos = $(window).scrollTop(), // Scroll-Position auslesen
	i = 1, // Zähler-Variable
	scrollSpeed = slowSpeed; // den ScrollSpeed für die Section festlegen
	if($(this).hasClass('reverse')) scrollSpeed = reverseSpeed; // falls reverse gesetzt ist anderen ScrollSpeed verwenden

	// Parallax-Effekte der Sections berechen
	// Nur wenn ein Parallaxer Inhalt vorhanden ist
	$('.content-parallax, .content-parallax-wide').each(function(){
		// Nur wenn die Section innerhalb des Browserfensters ist
		if(scrollPos<blocks[i]['bottom'] && (scrollPos+winHeight)>blocks[i]['superMargin']){
			if($(this).hasClass('header') || $(this).hasClass('bgparallax')){ // Hier wird eine Sonderreglung für den header definiert
				var position = Math.ceil(scrollPos/scrollSpeed); // Das Bild soll nicht in der Mitte des Bildschirms auf halber Höhe stehen, sondern oben anstoßen und nur wegscrollen
			}else if($(this).hasClass('footer')){
				var position = Math.ceil(((scrollPos-blocks[i]['bottom'])+winHeight)/scrollSpeed)+(blocks[i]['height']-blocks[i]['pheight']); // Position des parallax-scrollenden Objektes
			}else{
				//console.log(Math.ceil((((scrollPos - blocks[i]['center']) + winCenter)/scrollSpeed)+((blocks[i]['centerPos'])/scrollSpeed)));
				//console.log('ScrollPos: '+scrollPos+' blocksCenter:'+blocks[i]['center']+' WinCenter:'+winCenter+' ScrollSpeed:'+scrollSpeed+' blocksCenterPos:'+blocks[i]['centerPos']);
				//console.log('Height: '+blocks[i]['height']+' Half:'+blocks[i]['half']+' PHeight:'+blocks[i]['pheight']+' PHalf:'+blocks[i]['phalf']+' superMargin:'+blocks[i]['superMargin']);
				var position = Math.ceil((((scrollPos - blocks[i]['center']) + winCenter)/scrollSpeed)+((blocks[i]['centerPos'])/scrollSpeed));
			}
		}else{
			var position = 0; // Position 0
		}
		
		// New Multiple Parallax Calculation
		// Inside the multi parallax section are markers for each parallax scrollable item
		// Scroll marks these Items
		$(this).children('.multiparallax').children('.scroll').each(function(){
			// for each "scroll" item in the "multiparallax" section
			// there are a lot of classes used inside, so we need to split the class-attribute
			// save all classes inside an array called className
			className = $(this).attr('class').split(' ');
			
			for(mi=0; mi<className.length; mi++){
				console.log(className[mi]);
				console.log(position);
				vposition = position; // save the position variable inside the verticle position variable
				// then we need to split the className at the minus-symbol to get the speed-class
				if(className[mi].split('-')[0]=='speed'){ // if our actual class is the speed class
					if(className[mi].split('-')[1]=='full') { // if the speed class transportes the value "full"
						vposition = position; // vposition is at full speed
					}else{
						vposition = (position*parseFloat('0.'+className[mi].split('-')[1])); // vposition gets the percentage speed
					}
					// next part defines a reverse speed
					if($(this).hasClass('reverse')){ // if we get the class "reverse"
						vposition = 0-vposition; // we calculate it the other way
					}
					$(this).css('top', vposition); // setting the top-position of the item
				}
				// at this point we calculate the horizontal position
				// we need to split the className at the minus-symbol to get the hspeed-class
				// here hspeed is used to mark the horizontal speed, ya know ;)
				if(className[mi].split('-')[0]=='hspeed'){ // if our actual class is the hspeed class
					if(className[mi].split('-')[1]=='full') { // if the hspeed class transportes the value "full"
						hposition = position; // hposition is at full speed
					}else{
						hposition = (position*parseFloat('0.'+className[mi].split('-')[1])); // hposition gets the percentage speed
					}
					// next part defines a reverse speed
					if($(this).hasClass('hreverse')){ // if we get the class "hreverse"
						hposition = 0-hposition; // we calculate it the other way
					}
					$(this).css('left', hposition); // setting the left-position of the item
				}
				
				// getting the rotating elements and set the degrees
				// only the image itself should be rotated 
				// maybe it's useless to do all the browserspecific transforms - we'll see later
				// for the ClockWise rotate
 				$(this).children('.img_wrap').children('.rotatecw').css({
					'transform': 'rotate('+scrollPos+'deg)',
					'-moz-transform': 'rotate('+scrollPos+'deg)',
					'-ms-transform': 'rotate('+scrollPos+'deg)',
					'-o-transform': 'rotate('+scrollPos+'deg)',
					'-webkit-transform': 'rotate('+scrollPos+'deg)'
				});
				// here comes the CounterClockWise part
				$(this).children('.img_wrap').children('.rotateccw').css({
					'transform': 'rotate('+(0-scrollPos)+'deg)',
					'-moz-transform': 'rotate('+(0-scrollPos)+'deg)',
					'-ms-transform': 'rotate('+(0-scrollPos)+'deg)',
					'-o-transform': 'rotate('+(0-scrollPos)+'deg)',
					'-webkit-transform': 'rotate('+(0-scrollPos)+'deg)'
				});
			}
		});
		
		// Original Part without Multiple Parallax Effect
		//console.log(position);
		$(this).children('.content-bg').css('top', position); //Position innerhalb der Section
		if($(this).hasClass('bgparallax')){
			if($(this).hasClass('fast')){
				$(this).css('background-position', '0 '+(0-position)+'px');
			}else{
				$(this).css('background-position', '0 '+position+'px');
			}
		}
		i++;
	});
}

/**	SCROLL ON PAGELOAD FUNCTION **/
// to top right away
if ( window.location.hash ) scroll(0,0);
// void some browsers issue
setTimeout( function() { scroll(0,0); }, 1);

$(function() {

    // your current click function
    $('.scroll').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 100 + 'px'
        }, 900);
    });

    // *only* if we have anchor on the url
	setTimeout( function() {
		if(window.location.hash) {
			// smooth scroll to the anchor id
			$('html, body').animate({
				scrollTop: $(window.location.hash).offset().top - 100 + 'px'
			}, 900);
		}
	}, 2);
});

function setEffect(){
	"use strict";
	var i = 0;	
	if ($(window).width() > 1024){
		$('.frame-default,.menu-pages-item,.flyin,.frame-type-youtubevideo_pi1,.frame-type-text').each(function(){
			if(i % 2 === 0){
				$(this).addClass('op').addClass('op-right').addClass('op'+i);
			}else{
				$(this).addClass('op').addClass('op-left').addClass('op'+i);
			}
			i++;
		});
	}
}
function lazyEffect(){
	"use strict";
	var i = 0;	
	if ($(window).width() > 1024){
		$('.frame-default.op,.menu-pages-item.op,.flyin.op,.frame-type-youtubevideo_pi1.op,.frame-type-text.op').each(function(){
			effect[i] = new Object(),
			effect[i]['abstand'] = $(this).offset().top;
		//	console.log((Math.floor(effect[i]['abstand']))+'//'+Math.floor((scrollPos+winAbstand)));
			if ((effect[i]['abstand']) < (scrollPos+winAbstand)){
				$(this).removeClass('op');
				if($(this).hasClass('op-left')){
					$(this).removeClass('op-left').addClass('op-active-left');
				}else if ($(this).hasClass('op-right')){
					$(this).removeClass('op-right').addClass('op-active-right');
				}
			}
			i++;
		});
	}else{		
		$('.frame-default.op,.menu-pages-item.op,.flyin.op').removeClass('op-left').removeClass('op-right').addClass('op-active-left');
	}
}



function sortSteps(a, b){
	return ($(b).attr('data-step')) < ($(a).attr('data-step')) ? 1 : -1;    
}
	


$(document).ready(function(){
	"use strict";	
	$('#menu .men-button').click(function(){
		$(this).parent().toggleClass('active');
		//$(this).parent().parent().children('#logo').toggleClass('active');
	});
	
$('#pid13 .frame-layout-230 a[href*="#"]').on('click',function(e) {
	 e.preventDefault();
	 var target = this.hash;
	 var $target = $(target);
	 $('html, body').stop().animate({
	  'scrollTop': $target.offset().top-100
	 }, 900);
	});

	$('.header-slider').slick({
		dots: true,
		//lazyLoad: 'progressive',
		arrows: false,
		autoplay: true,
		autoplaySpeed: 6000,
		infinite: true,
		speed: 400,
		fade: true,
		pauseOnFocus: false,
		pauseOnHover: false,
		cssEase: 'linear'
	});
	$('.header-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
		//	$('#header :first-child() .slick-active .slide-img').removeAttr('style').addClass('test');
			$('#header .slick-active .slide-img').css({'transform':'scale(1)'});
		});
	$('.header-slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
			$('#header .slick-active .slide-img').css({'transform':'scale(1.2)'});
		});

	
	
	if(($(window).width() < 1023) && (SortSet == 0)){
		sortSteps($('.step-1'),$('.step-5'));
		$(".step-outer").sort(sortSteps).appendTo('.info-g').wrapAll('.frame-csc-col-width-33');	
		SortSet = 1;
	}else if(($(window).width() >= 1023) && (SortSet == 1)){		
		SortSet = 0;
	}
	
	getDim();
	setEffect();
	if($(window).width() > 800){
		parallaX(); // Parallax berechnen	
		//navigation();
	}else{
		$('.background.parallax').attr('style','');
	}
	
	// NEWS FILTER
	$(".filter button").click(function() {
		"use strict";
		$(".filter button").removeClass("act");
		$(this).addClass("act");
		var filter = $(this).attr("data-filter").toUpperCase();
		var elemArray = [];
		$(".news .article").each(function(e){
			var searchstring = $(this).attr("data-filter");
			if (searchstring.toUpperCase().indexOf(filter) > -1) {
				$(this).css("display", "inline-block");
				elemArray[e] = "set";
			} else {
				$(this).css("display", "none");
			}
		});
		if(elemArray.length <=0){
			if($(".n-infotext").length <=0){
				$(".news").append('<div class="n-infotext"><p>Es tut uns leid, es wurde kein Artikel gefunden.</p></div>');
			}
		}else{
			$(".n-infotext").remove();
		}
	});
	$(".filter .f-all").click();
	
	lazyEffect();
});



$(window).load(function(){
	"use strict";
	$('#header :first-child() .slick-active .slide-img').css({'transform':'scale(1.2)'});
	getDim();	
//	lazyEffect();
});


$(window).scroll(function(){
	"use strict";
	getDim();
	if($(window).width() > 800){
		parallaX(); // Parallax berechnen	
		//navigation();
	}else{
		$('.background.parallax').attr('style','');
	}
	lazyEffect();
});

$(window).resize(function(){
	"use strict";
	getDim();
	if($(window).width() > 800){
		parallaX(); // Parallax berechnen	
		//navigation();
	}else{
		$('.background.parallax').attr('style','');
	}
	
	if(($(window).width() < 1023) && (SortSet == 0)){
		sortSteps($('.step-1'),$('.step-5'));
		$(".step-outer").sort(sortSteps).appendTo('.info-g').wrapAll('.frame-csc-col-width-33');	
		SortSet = 1;
	}else if(($(window).width() >= 1023) && (SortSet == 1)){		
		SortSet = 0;
	}
});

	