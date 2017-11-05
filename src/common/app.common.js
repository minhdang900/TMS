import FWPlugin from ".././common/app.plugin";
import Cookie from "react-cookie";
import ReactDOM from 'react-dom';
import Widget from '.././common/app.widget';
var eCommon = {
	dashboard: '#dashboard',
	rating: '#rating',
	detail: '#detail',
	notify: '#notify',
	sid: 2,
	ratingContext: null,
	titleDialog:'',
	textDialog: '',
	
	user: {},
	isShowNotify: false,
	num_notify: 0,
	socket: null,
}
eCommon.isAndroid = function() {
	return /Android/i
			.test(navigator.userAgent) ? !0 : !1
}
eCommon.isIOS = function() {
	return /iPhone|iPad|iPod/i
			.test(navigator.userAgent) ? !0 : !1
}
/**
 * OUTPUT {'lat':'10.0','lon':'122.084'}
 */
eCommon.getLocation = function(callback){
	if(this.isAndroid){
		Widget.callAndroid({cmd:'get', key:'LOCATION', value:'', action: 'TSM.getData'});
	    var time = setInterval(function(){
	    	eCommon.logs('LOCATION ' + TSM.TRANSPORTER );
			 if(TSM.TRANSPORTER != null){
				 if(TSM.TRANSPORTER == -1){
					clearInterval(time);
					TSM.TRANSPORTER = null;  
					callback({lat: -1, lon: -1});
					return;
				}
	            clearInterval(time);
	            var result = TSM.TRANSPORTER;
	            callback(result);
	            TSM.TRANSPORTER = null;   
			 } 
		 }, 1);
//	    setTimeout(function(){
//	    	 clearInterval(time);
//	    	 callback({lat: -2, lon: -2});
//	         TSM.TRANSPORTER = null;  
//	    }, 1000);
	} else {
		callback({'lat':'-3','lon':'-3'}); 
	} 
	
}
eCommon.checkNotify = function(callback){
	var _ = this;
	var user = this.user || Cookie.load("user");
	if(_.isShowNotify || !user.login){
		callback(false);
		return;
	}
	this.request({
			type:'GET',
			data: {username: user.username},
			url: '/notify/check'
		}, (res) =>{
		_.num_notify = res.num_notify;
		if(_.num_notify > 0){
			$('#num_notify').find('span.bagde').html(_.num_notify);
			$('#num_notify').find('span.bagde').removeClass('hidden');
		}
		if(Number(res.status) == 1){
			var trip = res.trip;
			_.isShowNotify = true;
			FWPlugin.modal({
		    title:  'CHUYẾN MỚI',
		    text: '<p><i class="fa fa-key" aria-hidden="true"></i> '+trip[0].trip_num+'</p><p><i class="fa fa-truck" aria-hidden="true"></i> '+trip[0].name+'</p><p>Bạn có đồng ý vận chuyển?</p>',
		    buttons: [ 
		      {
		        text: '<i class="ios-icons">close</i> TỪ CHỐI',
		        onClick: function() {
		         	_.request({
		         		type: 'GET',
		         		url: '/notify/reply',
		         		data: {id: trip[0].id, status: 0, username: _.user.username}
		         	}, (res)=>{
		         		_.isShowNotify = false;
		         		trip[0].status = '4';
		         		callback(trip[0]);
		         	});
		        }
		      },
		      {
		        text: '<i class="ios-icons">check</i> CHẤP NHẬN',
		        onClick: function() {
		        	_.request({
		         		type: 'GET',
		         		url: '/notify/reply',
		         		data: {id: trip[0].id, status: 1, username: _.user.username}
		         	}, (res)=>{
		         		eCommon.logs('accept');
		         		_.isShowNotify = false;
		         		trip[0].status = '1';
		         		callback(trip[0]);
		         	});
		        }
		      },
		    ]
		  });
		}
	});
}
eCommon.logs = function(str){
	if(typeof(str) == "object"){
		str = JSON.stringify(str);
	}
	console.log("*************************************************************************************");
	console.log("**********");
	var tmp = '>>>>>______DangTM ELCOM log_____>>>> ' + this.getTime() + ': ' + str;
	console.log(tmp);
	console.log("**********");
	console.log("*************************************************************************************");
	//this.request({type:'POST', url:'/logs', data: {log: str}}, function(res){});
	
}
eCommon.random = function(){
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
eCommon.getTime = function() {
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return day + "_" + month + "_" + year + "T" + hour + "_" + min + "_" + sec;

}
eCommon.getDateTime = function() {
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;

}
eCommon.request = function(obj, success, error){
	$.ajax({
		url: obj.url,
		type: obj.type || 'GET',
		data: obj.data || "",
		success: success || function(res){
			eCommon.logs(res);
		},
		error: error || function(jqXHR, exception){
			eCommon.logs(eCommon.ajaxError(jqXHR, exception));
		}
	});
}
eCommon.ajaxError = function(jqXHR, exception){
	var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connect. Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    }
    return msg;
}
//eCommon.getTime = function(){
//	var _=this;
//	var date = new Date();
//	var hour = date.getHours() - (date.getHours() > 12 ? 12 : 0);
//	var period = date.getHours() > 12 ? 'PM' : 'AM';
//	return (_.showTime(hour) + ':' +  _.showTime(date.getMinutes()) + period);
//}
eCommon.showTime = function(time){
	return time < 10 ? '0' + time : time;
}
eCommon.getDateBetween = function(dateFrom, dateTo){
	var from = dateFrom.split('-');
	var to = dateTo.split('-');
    var currentDate = new Date(from[2], from[1] - 1, from[0]);
    var end = new Date(to[2], to[1] - 1, to[0]);
    var between = [];
	while (currentDate <= end) {
		var obj = new Date(currentDate);
		var day = obj.getDate();
		var month = obj.getMonth() + 1;
		if (day < 10) {
			day = "0" + day;
		}
		if (month < 10) {
			month = "0" + month;
		}
	    between.push(day + '-' + month + '-' + obj.getFullYear());
	    currentDate.setDate(currentDate.getDate() + 1);
	}
	return between;
}
eCommon.getLastMonth = function() {
    var date = new Date();
    date.setMonth(date.getMonth());// return month 0->11
    date.setDate(0);// return last day of the previous month
    return date;
}
eCommon.getLast30Days = function() {
    var date = new Date();
    date.setDate(date.getDate()- 30);
    return date;
}
eCommon.getToday = function(){
	return new Date();
}
eCommon.getYesterday = function() {
    var date = new Date();
    date.setDate(date.getDate()-1);
    return date;
}
eCommon.getLast7Days = function() {
    var date = new Date();
    date.setDate(date.getDate()-7);
    return date;
}
eCommon.getThisWeek = function() {
    var date = new Date();
    date.setDate(date.getDate()-6);
    return date;
}
eCommon.rippleEffect = function($othis, e){
	var $this = $($othis);
	if($this.find(".ink").length === 0){
	   $this.prepend("<span class='ink'></span>");
    }
    var ink = $this.find(".ink");
    ink.removeClass("animate");
     
    if(!ink.height() && !ink.width()){
        var d = Math.max($this.outerWidth(), $this.outerHeight());
        ink.css({height: d, width: d});
    }
     
    var x = e.pageX - $this.offset().left - ink.width()/2;
    var y = e.pageY - $this.offset().top - ink.height()/2;
     
    ink.css({top: y+'px', left: x+'px'}).addClass("animate");
}
eCommon.blockUI = function(){
	$.blockUI({ 
        message: '<div><img style="width:100%;height:100%;border-radius: 73px; background-color:transparent" src="/styles/logo/ehotelsmile.png"></div>', 
		 css: { 
				padding:        0, 
				margin:         0, 
				width:          '30%', 
				top:            '30%', 
				left:           '35%', 
				textAlign:      'center', 
				color:          '#000', 
				border:         '0px solid #aaa', 
				backgroundColor: 'transparent', 
				cursor:         'wait' 
			},
			overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:         1, 
		        cursor:          'wait' 
		    }, 
			baseZ:			'9999',
    }); 
}
eCommon.unblockUI = function(){
	$.unblockUI();
}
export default eCommon;