import eCommon from '.././common/app.common';
var eAPI = {
	ip: '103.254.12.200',
	port:'8083'
}
eAPI.getURLSid = function(){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/ReceiveRatingCustomer?cmd=0004';
}
eAPI.getLocation = function(){
		return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/ReceiveRatingCustomer?siteid='+eCommon.sid+'&cmd=0001';
}
eAPI.checkNotifications= function(){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=006';
}
eAPI.viewNotifications= function(){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=008&type=-1&id=-1';
}
eAPI.getContentMobile = function(){
	
}
eAPI.getOrder= function(type){
	// type = -1 is get all order 
	// type = 0 is check order
	// type = 1 is confirm processing
	// type = 2 is confirm done
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/Order?cmd=0004&type=' + type;
}

eAPI.getConfirm= function(){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=015';
}
eAPI.deleteOrder= function(){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=016';
}
eAPI.deleteNotify= function(){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=020';
}
eAPI.getSurvey= function(lid, dateFrom, dateTo){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=010&from='+dateFrom+'&to='+dateTo+'&lid=' + lid;
}
eAPI.getDetail= function(lid, dateFrom, dateTo){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=018';
}
eAPI.getRating= function(){
	return 'http://' + eAPI.ip + ':' + eAPI.port + '/eSurvey/WS?cmd=014';
}
export default eAPI;