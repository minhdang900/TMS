import React from 'react';
import { render } from 'react-dom';
import Tablet from './components/AppVinpearl';
import app from './common/app.plugin';
import cookie from 'react-cookie';
import MobileDetect from 'mobile-detect';

import Mobile from './components/AppMobile';
import eCommon from './common/app.common';
import eRating from './model/app.rating';

var md = new MobileDetect(window.navigator.userAgent);
//lock screen
eCommon.blockUI();
if($(window).width() > 768){ // detect iPad
	render(<Tablet appSmileSelect={appSmileSelect} langid={cookie.load('langid') != undefined ? cookie.load('langid'): 1} />, document.getElementById('root'));
	var $$ = Dom7;
	var slide = null;
	app.showIndicator();
	setTimeout(function () {
	   app.hideIndicator();
	    eCommon.unblockUI();
	    var slideLarge = app.swiper('.slide-large', {
	    	pagination:'.large-swiper-pagination',
	    	autoplay: 7000,
	    	speed: 4000,
	    	effect: 'fade', // Could be "slide", "fade", "cube", "coverflow" or
	    					// "flip"
	    });
	    slide = initSwipeSlide();
	}, 3000);

	var mainView = app.addView('.view-main', {
		dynamicNavbar: false,
		domCache: true
	});
	$('.prevButton').on('click', function(e){
		eCommon.rippleEffect(this, e);
		if(slide != null){
			slide.slidePrev();
		}
	});
	$('.nextButton').on('click', function(e){
		eCommon.rippleEffect(this, e);
		if(slide.isEnd){
			callback.trigger('page:init');
		} else {
			slide.slideNext();
		}
		
	});
	$$(document).on('page:reinit', function(e){
		if(e.detail == null){
			$$('.views').find('div[data-page="esmile_page_1"]').removeClass('cached');
			$$('.views').find('div[data-page="esmile_page_1"]').removeClass('page-on-left');
			slide.slideTo(0 , 1000, true);
			return;
		}
		var page = e.detail.page;
		if(page.name == 'esmile_page_1'){
			//slide = initSwipeSlide();
			$(page.fromPage.container).addClass('cached');
		} else if(page.name == 'esmile_page_2'){
			$(page.fromPage.container).addClass('cached');
		} else if(page.name == 'esmile_page_3'){
			$(page.fromPage.container).addClass('cached');
		} else if(page.name == 'esmile_page_4'){
			$(page.fromPage.container).addClass('cached');
			setTimeout(function(){
				$(page.container).addClass('cached');
				callback.trigger('page:reinit');
			}, 3000);
		}
	});
	var callback = $$(document).on('page:init', function(e){
		$('.row_item').removeClass('hidden');
		if(e.detail == null){
			$$('.views').find('div[data-page="esmile_page_1"]').addClass('cached');
			$$('.views').find('div[data-page="esmile_page_4"]').removeClass('cached');
			setTimeout(function(){
				$$('.views').find('div[data-page="esmile_page_4"]').addClass('cached');
				callback.trigger('page:reinit');
			}, 3000);
			return;
		}
		var page = e.detail.page;
		if(page.name == 'esmile_page_1'){
			$$(page.container).removeClass('cached');
		} else if(page.name == 'esmile_page_2'){
			$(page.fromPage.container).addClass('cached');
		} else if(page.name == 'esmile_page_3'){
			$(page.fromPage.container).addClass('cached');
		} else if(page.name == 'esmile_page_4'){
			$(page.fromPage.container).addClass('cached');
			setTimeout(function(){
				$(page.container).addClass('cached');
				callback.trigger('page:reinit');
			}, 3000);
		}
	});
	app.init();
	function initSwipeSlide(){
		var slideSmall = app.swiper('.slide-small', {
			pagination:'.small-swiper-pagination',
			autoplay: 0,
			speed: 1000,
			paginationType: 'progress',
			effect: 'coverflow', // Could be "slide", "fade", "cube", "coverflow" or  "flip"
			onSlideChangeEnd: function(swiper){
				// default
				$('.row_item').removeClass('hidden');
				$('.row_item_other').addClass('hidden');
				$('.row_item_option').addClass('hidden');
				 var typeContent = $(swiper.slides[slide.realIndex]).attr('data-type');
				 if(Number(typeContent) == 2){ // show dialog
					 $('.row_item').addClass('hidden');
					 app.modal({
						    title:  'Comment',
						    text: 'Please share your opinion',
						    afterText:  '<div class="item-input">'+
							                '<textarea id="opinion_text" rows="5" cols="50"></textarea>'+
							              '</div>',
						    buttons: [
						      {
						        text: 'Cancel',
						        onClick: function(){
						        	appSmileSelect(null);
						        }
						      },
						      {
						        text: 'Send',
						        onClick: function() {
						           if($('#opinion_text').val() != ""){
						        	   var link = 'http://' + location.hostname + ":8083/eSurvey/ReceiveRatingCustomer?cmd=0005&lid=2&p0=[p0]&siteid=2&text=[text]";
						        	   var rid = $('.slide-small .swiper-slide-active').attr('data-id');
						        	   var opinion = $('#opinion_text').val();
						        	   var url = link.replace('[p0]', rid).replace('[text]', opinion);
							       		$.get(url, function(response){
							       			console.log('>> Send rating other status: ' + response);
							       		});
						        	   
						           } 
						           appSmileSelect(null);
						        }
						      }
						    ]
						  });
				 } else if(Number(typeContent) == 4){ // show opinion other
					 $('.row_item_other').removeClass('hidden');
					 $('.row_item').addClass('hidden');
				 } else if(Number(typeContent) == 3){ // show opinion YES, NO
					 $('.row_item_option').removeClass('hidden');
					 $('.row_item').addClass('hidden');
				 }
			}
		});
		eCommon.ratingContext = slideSmall;
		return slideSmall;
	}
	function appSmileSelect(item){
		if(slide.isEnd){
			callback.trigger('page:init');
		} else {
			var next = slide.realIndex + 1;
			if(item != null){
			  var typeContent = $(slide.slides[slide.realIndex]).attr('data-type');
			  if(Number(typeContent) == 3 && Number(item.id) == 2 
					   && $(slide.slides[slide.realIndex]).attr('data-id') == '215'){ // Select NO 
				  next = slide.realIndex + 3;
			   }
			}
			slide.slideTo(next , 1000, true);
		}
	}
} else { // detect iPhone
	render(<Mobile />, document.getElementById('root'));
	var $$ = Dom7;
	app.showIndicator();
	setTimeout(function () {
	    app.hideIndicator();
	}, 1500);
	$$('.pull-to-refresh-content').on('ptr:refresh', function(e){
		setTimeout(function(){
			app.pullToRefreshDone();
		}, 1000);
	});
	$$('#date-from').on('change', function(){
		this.setAttribute(
		   "data-date", 
		   moment(this.value, "YYYY-MM-DD").format( this.getAttribute("data-date-format") ));
	});
	$$('#date-to').on('change', function(){
		this.setAttribute(
		   "data-date", 
		   moment(this.value, "YYYY-MM-DD").format( this.getAttribute("data-date-format") ));
	});
	app.onPageInit('dashboard', function(page){
		
	});
	app.init();

	/**
	 * Handle filter
	 */
	$$('.picker-filter .close-picker').on('click', function(){
		//eRating.getRating();
		//setTimeout(eRating.getDetail(), 1000);
	});
	$$('.open-picker').on('click', function(){
		var _= this;
		app.pickerModal('.picker-filter');
	});

	//Add views
	var view1 = app.addView(eCommon.dashboard, {
		 dynamicNavbar: true
	});
	var view2 = app.addView(eCommon.rating, {
	  dynamicNavbar: true
	});
	var view3 = app.addView(eCommon.detail, {
		dynamicNavbar: true
	});
	var view4 = app.addView(eCommon.notify, {
		dynamicNavbar: true
	});

	/**
	 * get SID and Room
	 */
//	eRating.getSid(function(){
//		eRating.getRoom(function(){
//			setInterval(function(){
//				eRating.getRating();
//			},2000);
//			setTimeout(eRating.getDetail(), 2000);
//		})
//	});
} 



