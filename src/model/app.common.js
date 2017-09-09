var eCommon = {
	dashboard: '#dashboard',
	rating: '#rating',
	detail: '#detail',
	notify: '#notify',
	sid: 2,
	user: {}
}
eCommon.checkNotify = function(callback){
	var _ = this;
	this.request({
			type:'GET',
			data: {username: this.user.username},
			url: '/notify/check'
		}, (res) =>{
		if(Number(res.status) == 1){
			FWPlugin.modal({
		    title:  'Chuyến Mới',
		    text: '<p>'+res.name+'</p><p>Bạn có đồng ý vận chuyển?</p>',
		    buttons: [
		      {
		        text: '<i class="ios-icons">close</i> từ chối',
		        onClick: function() {
		         	_.request({
		         		type: 'GET',
		         		url: '/notify/reply/0'
		         	}, (res)=>{
		         		console.log('not accept');
		         	});
		        }
		      },
		      {
		        text: '<i class="ios-icons">check</i> chấp nhận',
		        onClick: function() {
		        	_.request({
		         		type: 'GET',
		         		url: '/notify/reply/1'
		         	}, (res)=>{
		         		console.log('accept');
		         		callback();
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
	console.log('>>>>>______DangTM ELCOM log_____>>>> ' + this.getTime() + ': ' + str);
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
eCommon.getTime = function(){
	var _=this;
	var date = new Date();
	var hour = date.getHours() - (date.getHours() > 12 ? 12 : 0);
	var period = date.getHours() > 12 ? 'PM' : 'AM';
	return (_.showTime(hour) + ':' +  _.showTime(date.getMinutes()) + period);
}
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
eCommon.getLast30Days = function() {
    var date = new Date();
    date.setDate(date.getDate()- 30);
    return date;
}
export default eCommon;