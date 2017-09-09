// Initialize your app
var app = new Framework7();
// Export selectors engine
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
	var date = eCommon.getLast30Days();
	var today = new Date();
	$$('#date-from').val(moment().subtract('days', 30).format('YYYY-MM-DD'));
	$$('#date-to').val(moment().format('YYYY-MM-DD'));
	$$('#date-from').attr(
			   "data-date", 
			   moment().subtract('days', 30).format( $$('#date-from').attr("data-date-format") ));
	$$('#date-to').attr(
			   "data-date", 
			   moment().format( $$('#date-from').attr("data-date-format") ));
});
app.init();

/**
 * Handle filter
 */
$$('.picker-filter .close-picker').on('click', function(){
	eRating.getRating();
	setTimeout(eRating.getSurvey(), 1000);
	setTimeout(eOrder.getOrder(), 2000);
});
/**
 * get SID and Room
 */
eRating.getSid(function(){
	eRating.getRoom(function(){
		eRating.getRating();
		
		setTimeout(eRating.getSurvey(), 1000);
		
		setTimeout(eOrder.getOrder(), 2000);
		
		setInterval(eOrder.checkOrder, 3000);
		
		setInterval(function(){
			eRating.getRating();
			setTimeout(eRating.getSurvey(), 1000);
			setTimeout(eOrder.getOrder(), 2000);
		}, 5000);
	})
});

$$('.open-picker').on('click', function(){
	var _=this;
	app.pickerModal('.picker-filter');
});


//Add views
var view1 = app.addView(eCommon.dashboard, {
	 dynamicNavbar: true
});
var view2 = app.addView(eCommon.rating, {
  dynamicNavbar: true
});
var view3 = app.addView(eCommon.survey, {
	dynamicNavbar: true
});
var view4 = app.addView(eCommon.order, {
	dynamicNavbar: true
});