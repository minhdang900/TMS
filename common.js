/**
 * date 23/03/2017
 * @author DangTM
 * 
 */
var eCommon = function(){	
}
/**
 * getDateTime 
 * @return string format: DD/MM/YYYY HH:MM:SS
 */
eCommon.prototype.getDateTime = function() {
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
eCommon.prototype.random = function(){
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
eCommon.prototype.log = function(message){
	console.log("####################################################################################");
	console.log("###########");
	console.log('__________>> DangTM ELCOM logger >>>___', this.getDateTime(), message);
	console.log("###########");
	console.log("####################################################################################");
}
module.exports = new eCommon();