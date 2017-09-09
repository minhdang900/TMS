var connection = require('../config/connection');
var sql = require('mssql');
var common = require('../common');
function ABADB() {
  this.login = function(username, password, callback){
	  connection.getConnection(function(err, con){
			// call proceduce
		  	con.input('User', sql.VarChar(30), username);
		    con.input('Pass', sql.VarChar(30), password);
		    con.execute('CheckedUserLogin').then((result, err) => {
		    	if(err){
		    		console.dir(err);
		    	}
		       console.dir(result);
		       callback(result);
		    }).catch(function(err) { 
		      console.log(err);
		    });
	  });
  };
  this.checkNotify = function(username, callback){
	  connection.getConnection(function(err, con){
		  	con.input('Username', sql.VarChar(20), username);
		    con.execute('Check_Notify').then((result, err) => {
		    	if(err){
		    		console.dir(err);
		    	}
				if(typeof result === 'undefined'){ 
					callback([]);
					return;
				}
		       callback(result.recordsets);
		    }).catch(function(err) { 
		      console.log(err);
		    });
	  });
	  
  }
  this.driverAssigned =  function(callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "SELECT t.TripID, TripNumber, Route, DriverUser, TripDate, IsConfirmed, TypeGoods, CustomerName, s.Name as Address, "
		    			+ " (SELECT Count(*)  FROM Messager WHERE Receiver=t.DriverUser and Status=0) as num_notify "
		    			+ " FROM Trips t, Trip_WareHouse s "
		    			+ " WHERE IsConfirmed = 0 and s.TripID = t.TripID";
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    	}
				if(typeof result === 'undefined'){
					callback([]);
					return;
				}
				
				callback(result.recordset);
			});
	  });
  }
  this.reply = function(username, tripId, status, reason, callback){ 
	  connection.getConnection(function(err, con){
		    con.input('DriverUser', sql.VarChar(50), username);
		    con.input('TripID', sql.BigInt, tripId);
		    con.input('Status', sql.Int, status);
		    con.input('Reason', sql.NVarChar, "No content");
		    con.execute('Proc_AcceptTrip').then((result, err) => {
		    	if(err){
		    		console.dir(err);
		    		callback(0);
		    		return;
		    	}
		       callback(1);
		    }).catch(function(err) { 
		      console.log(err);
		    });
	  });
  }
  this.notification = function(username, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "SELECT MsgID, Title, FORMAT(CreateDate, 'dd/MM/yyyy hh:mm:ss') as CreateDate, Message, Sender, Status FROM Messager WHERE Status < 2 AND Receiver=@username Order By CreateDate DESC";
		  	con.input('username', sql.VarChar(50), username);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    	}
				if(typeof result === 'undefined'){
					callback([]);
					return;
				}
				common.log('This is reuslt GET NOTIFYCATIONS');
				console.dir(result);
				callback(result.recordset);
			});
	  });
  }
  this.setNotification = function(id, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = 'Update Messager SET Status=1 where MsgID=@ID';
		  	con.input('ID', sql.BigInt, id);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    	}
				if(typeof result === 'undefined'){
					callback([]);
					return;
				}
				common.log('This is reuslt SET NOTIFYCATIONS');
				console.dir(result);
				callback(result);
			});
	  });
  }
  this.delNotification = function(id, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = 'Update Messager SET Status=2 where MsgID=@ID';
		  	con.input('ID', sql.BigInt, id);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: "FAIL", error_code: 112});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback({status: 0, message: "FAIL"});
					return;
				}
				callback({status: 1, message: "SUCCESS"});
			});
	  });
  }
  this.getTrips = function(username, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "SELECT t.TripID, t.TripNumber, t.Route,  FORMAT(t.TripDate, 'dd/MM/yyyy hh:mm:ss') as TripDate, t.IsConfirmed"
		    	+' FROM Trips t'
		    	+' WHERE t.DriverUser=@username AND cast(GETDATE() as date) <= cast(t.TripDate as date) and t.IsConfirmed != 0 Order By t.TripDate DESC';
		  	con.input('username', sql.VarChar(50), username);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 112});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback([]);
					return;
				}
				
				callback(result.recordset);
			});
	  });
  }
  this.leavePark = function(username, num_km, location, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "INSERT INTO TripDate(Driver, KM_Leave, LocationLeave) Values(@Driver, @KM_Leave, @Location)";
		  	con.input('Driver', sql.VarChar(50), username);
		  	con.input('KM_LEAVE', sql.Int, num_km);
		  	con.input('Location', sql.VarChar(50), location);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 500});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback({status: 0, message: 'FAIL', error_code: 500});
					return;
				}
				callback({status: 1, message: 'CONFIRM LEAVE SUCCESS'});
			});
	  });
  }
  this.backPark = function(username, num_km, location, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "UPDATE TripDate SET KM_End=@KM_End, LastUpdate=GETDATE(), LocationEnd=@Location " +
		    		" Where Driver = @Driver and cast(DateAssigned as date) = cast(GETDATE() as date)";
		  	con.input('Driver', sql.VarChar(50), username);
		  	con.input('KM_End', sql.Int, num_km);
		  	con.input('Location', sql.VarChar(50), location);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 501});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback({status: 0, message: 'FAIL', error_code: 501});
					return;
				}
				callback({status: 1, message: 'CONFIRM GO BACK SUCCESS'});
			});
	  });
  }
  this.departureTrips = function(id, num_km, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "UPDATE Trips SET KM_Start=@KM_Start, TimeLeave=GETDATE(), IsConfirmed = 8" +
		    		" Where TripID = @ID";
		    con.input('ID', sql.BigInt, id);
		    con.input('KM_Start', sql.Int, num_km);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 5076});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback({status: 0, message: 'FAIL', error_code: 5076});
					return;
				}
				callback({status: 1, message: 'DEPARTURE SUCCESS'});
			});
	  });
  }
  this.stock = function(id, num_km, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "UPDATE Trips SET KM_Stock=@KM_Stock, TimeStock=GETDATE(), IsConfirmed = 9 " +
		    		" Where TripID = @ID";
		    con.input('ID', sql.BigInt, id);
		    con.input('KM_Stock', sql.Int, num_km);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 5077});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback({status: 0, message: 'FAIL', error_code: 5077});
					return;
				}
				callback({status: 1, message: 'DEPARTURE SUCCESS'});
			});
	  });
  }
 
  this.receiveGoods = function(id, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "UPDATE Trips SET TimeReceiveGoods=GETDATE(), IsConfirmed = 10 " +
		    		" Where TripID = @ID";
		    con.input('ID', sql.BigInt, id);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 5078});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback({status: 0, message: 'FAIL', error_code: 5078});
					return;
				}
				callback({status: 1, message: 'RECEIVE GOODS SUCCESS'});
			});
	  });
  }
  this.receiveGoodsDone = function(id, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "UPDATE Trips SET TimeReceiveDone=GETDATE(), IsConfirmed = 1 " +
		    		" Where TripID = @ID";
		    con.input('ID', sql.BigInt, id);
			con.query(query, (err, result) => {
				if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 504});
		    		return;
		    	}
				if(typeof result === 'undefined'){
					callback({status: 0, message: 'FAIL', error_code: 5078});
					return;
				}
				callback({status: 1, message: 'RECEIVE GOODS DONE'});
			});
	  });
  }
  this.startTrips = function(id, location, callback){
	  connection.getConnection(function(err, con){
		  	con.input('TripID', sql.BigInt, id);
		  	con.input('Location', sql.VarChar(150), location);
		  	con.execute('Proc_StartTrip').then((result, err) => {
		    	if(err){
		    		common.log('Something wrong when START TRIP');
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 504});
		    		return;
		    	}
		       common.log('This is result START TRIP');
		       console.dir(result);
		       callback({status: 1, message: 'SUCCESS'});
		    }).catch(function(err) { 
		      console.log(err);
		    });
	  });
  }
  this.cancelTrip = function(id, location, msg, callback){
	  connection.getConnection(function(err, con){
		  	con.input('TripID', sql.BigInt, id);
		  	con.input('Location', sql.VarChar(150), location);
		  	con.input('Message', sql.NVarChar(150), msg);
		  	con.execute('Proc_CancelTrip').then((result, err) => {
		    	if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 507});
		    		return;
		    	}
		       console.dir(result);
		       callback({status: 1, message: 'SUCCESS'});
		    }).catch(function(err) { 
		      console.log(err);
		    });
	  });
  }
  this.goBack = function(id, location, num, callback){
	  connection.getConnection((er, con)=>{
		  con.input('TripID', sql.BigInt, id);
		  con.input('Location', sql.VarChar(150), location);
		  con.input('KM_End', sql.Int, num);
		  con.execute('Proc_EndTrip').then((result, err) => {
		    	if(err){
		    		console.dir(err);
		    		callback({status: 0, message: 'FAIL', error_code: 501});
		    		return;
		    	}
		       common.log('This is result END TRIP');
		       console.dir(result);
		       callback({status: 1, message: 'SUCCESS'});
		    }).catch(function(err) { 
		      console.log(err);
		  });
	  });
  }
  this.getTripDetailById = function(id, callback){ 
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "SELECT d.TripDetailID, d.IsComplete, d.Address, d.LocationName, "
		    	+" FORMAT(d.LastUpdate, 'dd/MM/yyyy hh:mm:ss') as LastUpdate, d.TypeGoods, d.Temperature, d.Units"
		    	+' FROM TripDetails d '
		    	+' WHERE d.TripID = @id'
		    	+' ORDER BY d.LocationIndex ASC';
		  	con.input('id', sql.Int, id);
			con.query(query, (err, result) => {
				console.dir(result);
				callback(result.recordset); 
			});
	  });
  }
  this.updateStatusPoint = function(id, status, location, num, callback){ 
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = "Update TripDetails Set IsComplete = @Status, Location1=@Location, Time1=GETDATE(), Kilometre = @KM_Start WHERE TripDetailID = @ID";
		  	if(status == 6){
		  		query = "Update TripDetails Set IsComplete = @Status, Location2=@Location, Time2=GETDATE() WHERE TripDetailID = @ID";
		  	}
		  	con.input('ID', sql.BigInt, id);
		  	con.input('Status', sql.Int, status);
		  	con.input('Location', sql.VarChar(250), location);
		  	con.input('KM_Start', sql.Int, num);
			con.query(query, (err, result) => {
				if(err){
					callback({status: 0, message: 'FAIL', error: '4321'});
					return;
				}
				console.dir(result);
				callback({status: 1, message: 'SUCCESS'}); 
			});
	  });
  }
  /**
   * 
   */
  this.getInvoice = function(id, callback){
	  connection.getConnection(function(err, con){
		    // call sql query
		    var query = 'SELECT invoice.InvoiceNumber, invoice.Url, invoice.CreateDate'
		    	+' FROM TripDetails d, TripInvoices invoice '
		    	+' WHERE invoice.TripDetailID=@invoice_id AND d.TripDetailID = invoice.TripDetailID'
		    	+' ORDER BY t.LocationIndex ASC';
		  	con.input('invoice_id', sql.Int, id);
			con.query(query, (err, result) => {
				if(err){
					common.log('Something wrong when GET INVOICE');
					console.dir(err);
				}
				common.log('This is result GET INVOICE');
				console.dir(result);
				callback(result);
			});
	  });
  }
  /**
   * 
   */
  this.getActivity = function(username, callback){
	  connection.getConnection(function(err, con){
		  var query = "SELECT t.TripID, t.TripNumber, t.Route,  FORMAT(t.TripDate, 'dd/MM/yyyy hh:mm:ss') as TripDate, t.IsConfirmed, d.TripDetailID, d.IsComplete, d.Address, d.LocationName, invoice.InvoiceNumber, invoice.Url, FORMAT(invoice.LastUpdate, 'dd/MM/yyyy hh:mm:ss') as LastUpdate"
		    	+' FROM TripDetails d, TripInvoices invoice, Trips t'
		    	+' WHERE t.DriverUser=@username AND t.TripID = d.TripID AND d.TripDetailID = invoice.TripDetailID AND d.IsComplete = 3'
		    	+' ORDER BY d.LocationIndex ASC';
		  	con.input('username', sql.VarChar(50), username);
			con.query(query, (err, result) => {
				if(err){
					common.log('Something wrong when GET ACTIVITY');
					console.dir(err);
				}
				common.log('This is result GET ACTIVITY');
				console.dir(result);
				if(typeof result === undefined){
					callback([]);
				}
				callback(result.recordset);
			});
	  });
  }
  this.editActivity = function(tripId, detailId, url, callback){
	  connection.getConnection(function(err, con){
		  var query = 'Update TripInvoices '
					+'	Set Url = @Url, LastUpdate = GETDATE() '
					+'	Where TripDetailID = @TripDetailId ';
		  	con.input('Url', sql.VarChar(500), url);
		  	con.input('TripDetailId', sql.Int, detailId);
			con.query(query, (err, result) => {
				if(err){
					common.log('Something wrong when EDIT ACTIVITY');
					console.dir(err);
				}
				common.log('This is result EDIT ACTIVITY');
				console.dir(result);
				callback(result);
			});
	  });
	  
  }
  this.updateRating = function(tripId, detailId, rating, customerCode, callback){
	  connection.getConnection(function(err, con){
		  var query = 'Update TripDetails '
					+'	Set Rating = @Rating, LastUpdate = GETDATE(), CustomerCode = @CustomerCode '
					+'	Where TripDetailID = @TripDetailId  and TripID = @TripID';
		  	con.input('Rating', sql.Int, rating);
		  	con.input('TripDetailId', sql.Int, detailId);
			con.input('tripId', sql.Int, tripId);
			con.input('CustomerCode', sql.VarChar(50), customerCode);
			con.query(query, (err, result) => {
				if(err){
					common.log('Something wrong when UPDATE RATING');
					console.dir(err);
					callback({status: 0, message: 'ERROR', error_code: 2123});
				}
				common.log('This is result UPDATE RATING');
				callback({status: 1, message: 'SUCCESS'});
			});
	  });
  }
  /**
   * Object {username: '', id: tripId, url: urlInvoice, coordinate:''}
   */
  this.postInvoice = function(tripId,tripDetailId, url, coordinate, numPackage, callback){
	  connection.getConnection(function(err, con){
		  	con.input('TripId', sql.Int, tripId);
		    con.input('TripDetailId', sql.Int, tripDetailId);
		    con.input('Url', sql.VarChar(500), url);
		    con.input('Coordinate', sql.VarChar(500), coordinate);
		    con.input('NumPackage', sql.Int, numPackage);
		    con.execute('UpdateInvoice').then((result, err) => {
		    	if(err){
		    		common.log('Something wrong when POST INVOICE');
		    		console.dir(err);
		       }
		       console.dir(result);
		       callback(result);
		    }).catch(function(err) { 
		      console.log(err);
		    });
	  });
  }
  this.getReport = function(username, dateFrom, dateTo, callback){
		connection.getConnection(function(err, con){
			  var query = 'exec [TMS].[dbo].[prd_TienCongTaiXe] @Username, @dateFrom, @dateTo';
			  	con.input('Username', sql.VarChar(50), username);
			  	con.input('dateFrom', sql.VarChar(50), dateFrom);
				con.input('dateTo', sql.VarChar(50), dateTo);
				con.query(query, (err, result) => {
					if(err){
						console.dir(err);
						callback({status: 0, message: 'ERROR', error_code: 2123});
						return;
					}
					console.dir(result);
					var data = [];
					for(var i = 0; i < result.length; i++){
						var obj = {
							quantity: result[i].Quantity,
							salary: result[i].Salary,
							name: result[i].DriverName,
							star: 3
						}
						data.push(obj);
					}
						
					callback({status: 1, message: 'SUCCESS', data: data});
				});
		  });
	}
}

module.exports = new ABADB();
