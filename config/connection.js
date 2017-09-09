 var sql = require('mssql');
 
function Connection() {
	var connect = null;
	var config =   {
	  user: 'dang',//'dang',
	  password: '123',
	  server: '118.69.72.254', 
	  port: 1314,
	  database: 'ABADB'
	
  }
  this.getConnection = function(callback) {
	 if(connect != null){
		var request = new sql.Request();
		callback(null, request);
		return; 
	 }
	 connect = sql.connect(config, err => {
		var request = new sql.Request();
		callback(err, request);
	 });
	sql.on('error', err => {
		//connect.close(); 
		//connect = null;
		console.dir(err); 
	});
  }
  this.getTransaction = function(callback){ 
	     if(connect != null){
		    var transaction = new sql.Transaction();
			callback(null, transaction);
			return; 
		 }
		 connect = sql.connect(config, err => {
			var transaction = new sql.Transaction();
			callback(err, transaction);
		 });
		sql.on('error', err => {
			connect.close();
			connect = null;
			console.dir(err); 
	    });
  }
}
 
module.exports = new Connection();