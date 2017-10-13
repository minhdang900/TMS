var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);  

var io = require('socket.io')(server);
var PORT = process.env.PORT || 19091;

var flash    = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('express-logger');
var session = require('express-session');
var passport = require('passport');
var morgan = require('morgan');
var common = require('./common');
var fs = require('fs');
require('./config/passport')(passport);
var database = require('./models/database');
var timer = 0;
var localFile = path.join('E:\\App', 'Invoice');
//var localFile = path.join(__dirname, 'invoice');
var localTmp = path.join(__dirname, 'tmp');
// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);
  
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}
//set up our express application
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(morgan('dev')); // log every request to the console
//app.use(logger({path: __dirname + "/logfile.txt"}));
//app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ 
		secret: 'dangtm',
		cookie: { maxAge : 3600000 }
	})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/styles', express.static(path.join(__dirname, 'src/assets/stylesheets')));
app.use('/common', express.static(path.join(__dirname, 'src/common')));
app.use('/model', express.static(path.join(__dirname, 'src/model')));


app.get('/content/*', function(req, res){
   var url = req.url.match('^[^?]*')[0].replace('/content/','');
   res.sendFile(path.join(localFile, url));
});
app.get('/tmp/*', function(req, res){
	   var url = req.url.match('^[^?]*')[0].replace('/tmp/','');
	   res.sendFile(path.join(localTmp, url));
});
app.post('/logs', (req, res)=>{
	var logs = req.body.log;
	console.dir(logs);
});
app.get('/', function(req, res) {
	common.log('get home index page');
	res.sendFile(__dirname + '/dist/aba.html');
});
app.post('/checkLogin', function(req, res) {
	common.log('Go to check login ' + ' session ID ' + req.sessionID);
	if(req.isAuthenticated()){
		res.send({status: 1, message: 'Login success'});
		return;
	}
	res.send({status: 0, message: 'Login fail'});
});
app.get('/home', isLoggedIn, function(req, res){
	common.log('Go to home page ' + ' session ID ' + req.sessionID);
	res.send({status: 1, message: 'Success', user: req.user});
});

app.get('/login', function(req, res){
	common.log('Go to login page' + ' session ID ' + req.sessionID);
	res.send({status: 0, message: 'Login fail'});
});
app.post('/logout', function(req, res){
	common.log('Go to logout page' + ' session ID ' + req.sessionID); 
	req.session.destroy();
	req.logout();
	res.send({status: 1, message: 'Logout success'});
    //res.redirect('/');
});
//process the login form
app.post('/login', passport.authenticate('local-login', {
	successRedirect : '/home', // redirect to the secure profile section
	failureRedirect : '/login', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));
app.get('/trips', function(req, res){
	var username = req.query.username;
	database.getTrips(username, (result) =>{
		//[ [ Object, Object, Object,.. ], [Object, Object...] ]
		trips = result[0];
		var length = trips.length;
		for(var i = 0; i < length; i++){
			trips[i].location = [];
			trips[i].ware_house = [];
			//trips[i].ware_house.push(result[1].find((x) => x.TripID == trips[i].id)); // undefined
		}
//		console.dir(result[1]);
//		console.log(trips);
		res.send({status: 1, message: 'SUCCESS', user: req.user, trips: trips});
	});
});
app.post('/leave', (req, res)=>{
	var username = req.body.username;
	var km = req.body.num;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	database.leavePark(username, km, location, (result)=>{
		res.send(result);
	});
});
app.post('/leave/end', (req, res)=>{
	var username = req.body.username;
	var km = req.body.num;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	database.backPark(username, km, location, (result)=>{
		res.send(result);
	});
});
app.post('/end', (req, res)=>{
	var username = req.body.username;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var num = req.body.num;
	var location = latitude + '@' + longitude;
	var id = req.body.id;
	console.dir(req.body);
	database.returnBackPaking(id, location, num, (result) =>{
		res.send(result);
	});
	
});
app.post('/trip/departure', function(req, res){
	console.dir(req.body);
	// status = 7
	var id = req.body.id;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	var km = req.body.num;
	database.departureTrips(id, location, (result) =>{
		res.send(result);
	});
});
app.post('/trip/stock', function(req, res){
	console.dir(req.body);
	// status = 8
	var id = req.body.id;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	var km = req.body.num;
	database.stock(id, km, (result) =>{
		res.send(result);
	});
});
app.get('/trip/warehouse/:tripId', function(req, res){
	var tripId = req.params.tripId;
	database.getWareHouse(tripId, (result) =>{
		res.send(result);
	});
});
app.post('/trip/warehouse', function(req, res){
	var id = req.body.id;
	var tripID = req.body.TripID;
	var status = req.body.status;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	database.updateWareHouse(tripID, id, status, location, (result) =>{
		res.send(result);
	});
});
app.post('/trip/goods/start', function(req, res){
	console.dir(req.body);
	var id = req.body.id;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	database.receiveGoods(id, (result) =>{
		res.send(result);
	});
});
app.post('/trip/goods/end', function(req, res){
	console.dir(req.body);
	var id = req.body.id;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	database.receiveGoodsDone(id, (result) =>{
		res.send(result);
	});
});
app.post('/trip/start', function(req, res){
	var id = req.body.id;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	database.startTrips(id, location, (result) =>{
		res.send(result);
	});
});
app.post('/trip/cancel', (req, res) => {
	var id = req.body.id;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var location = latitude + '@' + longitude;
	var status = req.body.status;
	var msg = req.body.message;
	database.cancelTrip(id, location, msg, (result) =>{
		res.send(result); 
	});
});
app.get('/detail/:tripId', function(req, res){
	var id = req.params.tripId;
	database.getTripDetailById(id, (result) =>{
		var length = result.length;
		
		res.send({status: 1, message: 'SUCCESS', user: req.user, trips: result[0], ware_house: result[1]});
	});
});
app.post('/point/update', function(req, res){
	var status = req.body.status;
	var id = req.body.id;
	var location = req.body.latitude + '@' + req.body.longitude;
	database.updateStatusPoint(id, status, location, (result) =>{
		res.send(result);
	});
});
app.post('/point/delivery', function(req, res){
	var status = req.body.status;
	var id = req.body.id;
	var location = req.body.latitude + '@' + req.body.longitude;
	database.deliveryPoint(id, status, location, (result) =>{
		res.send(result);
	});
});

app.post('/point/package', function(req, res){
	var id = req.body.id;
	var location = req.body.latitude + '@' + req.body.longitude;
	var num = req.body.num;
	database.setPackage(id, num, location, (result) =>{
		res.send(result);
	});
});
app.get('/point/tray', function(req, res){
	database.getListTray((result)=>{
		res.send(result)
	});
});
app.post('/point/tray', function(req, res){
	var id = req.body.id;
	var listReceive = req.body.listReceive;
	var listReturn = req.body.listReturn;
	var listId = req.body.listId;
	database.setListTray(id, listReceive, listReturn, listId, (result) => {
		res.send(result);
	});
});
/**
 * INPUT: {data:[{name:'', base64:''}]}
 */
app.post('/send/images', function(req, res){
	var data = req.body.data;
	var length = data.length;
	for(var i = 0; i < length; i++){
		common.log('UPLOAD IMAGE FROM MOBILE LENGTH = ' + length + '*****'+ path.join(localTmp, data[i].name));
		try {
			var baseCode = data[i].base64;
			var buffer = new Buffer(baseCode, 'base64');
			fs.writeFileSync(path.join(localTmp, data[i].name), buffer, 'base64', (err)=>{
				if(err){
					console.dir(err);
					res.send({status: 0, message: 'FAIL', error_code: 307});
				}
				common.log('SAVE FILE SUCCESS ' + path.join(localTmp, data[i].name));
			});
		} catch(err){
			console.dir(err);
		}
	}
	res.send({status: 1, message: 'SUCCESS'});
});
app.post('/send/invoice', function(req, res){
	console.dir(req.body);
	var images = JSON.parse(req.body.images);
	var length = images.length;
	var url = [];
	for(var i = 0; i < length; i++){
		try {
			url.push(images[i].name);
			console.dir(url);
			if(images[i].base64.indexOf('/tmp/') >= 0){ // copy file
				// rename
				var name = images[i].base64.split('/').pop(); 
				var src = path.join(localTmp, name);
				var des = path.join(localFile, images[i].name)
				fs.createReadStream(src).pipe(fs.createWriteStream(des));
			} else {
				var baseCode = images[i].base64.split(',')[1];
				var buffer = new Buffer(baseCode, 'base64');
				fs.writeFileSync(path.join(localFile, images[i].name), buffer, 'base64', (err)=>{
					if(err){
						console.dir(err);
						res.send({status: 0, message: 'FAIL', error_code: 1232});
					}
					common.log('Save file success ' + path.join(localFile, images[i].name));
				});
			}
		} catch(err){
			console.dir(err);
		}
	}
	var numPackage = req.body.numPackage;
	var tripId = req.body.tripId;
	var tripDetailId = req.body.tripDetailId;
	var coordinate = req.body.coordinate;
	database.postInvoice(tripId,tripDetailId, url.join('@'), coordinate, numPackage, (result)=>{
		res.send({status: 1, message: 'Success'});
	});
});
app.post('/send/rating', (req, res) => {
	var num = req.body.rating;
	var tripId = req.body.tripId;
	var tripDetailId = req.body.tripDetailId;
	var customerCode = req.body.customer_code;
	database.updateRating(tripId,tripDetailId, num , customerCode, (result)=>{
		res.send(result);
	});
});
app.get('/notify/check', function(req, res){
	var username = req.query.username;
	if(username == 'unknown'){
		res.send({status: 0, message: 'Not anything new', num_notify: 0});
		return;
	}
	database.checkNotify(username, (result)=>{
		if(result[0].length == 0){
			res.send({status: 0, message: 'Not anything new', num_notify: result[1][0].num_notify});
		} else {
			var arr = [];
			var obj = {
				id: result[0][0].TripID, 
				name: result[0][0].Route,
				time: result[0][0].TripDate,
				status: result[0][0].IsConfirmed,
				trip_num : result[0][0].TripNumber,
				location: [],
				ware_house:[]
			}
			arr.push(obj);
			res.send({status: 1, message: 'success', trip: arr, num_notify: result[1][0].num_notify});
		}
	});
});
app.get('/notify/reply', function(req, res){
	database.reply(req.query.username, req.query.id, req.query.status, "", (result)=>{
		res.send({status: result, message: 'Success'}); 
	});
});
app.get('/notification', (req, res)=>{
	database.notification(req.query.username, (result)=>{
		var length = result.length;
		var notify = [];
		for(var i = 0; i < length; i++){
			var obj = {
					id: result[i].MsgID,
					name: result[i].Title,
					time: result[i].CreateDate,
					status: result[i].Status,
					content: result[i].Message,
					sender: result[i].Sender,
					receiver: result[i].Receiver
				}
			notify.push(obj);
		}
		res.send({status: 1, message: 'Success', notify: notify}); 
	});
});
app.post('/notification/:id', (req, res)=>{
	database.setNotification(req.params.id, (result)=>{
		res.send({status: 1, message: 'Success'}); 
	});
});
app.post('/notification/delete/:id', (req, res)=>{
	database.delNotification(req.params.id, (result)=>{
		res.send(result); 
	});
});
app.get('/activity', (req, res)=>{
	console.dir(req.query);
	var username = req.query.username;
	database.getActivity(username, (result)=> {
		var length = result.length;
		var activity = [];
		for(var i = 0; i < length; i++){
			var images = result[i].Url.split('@'); 
			for(var j = 0; j < images.length; j++){
				var code = common.random();
				var obj = {
						code: code,
						id_trip: result[i].TripID,
						id: result[i].TripDetailID,
						name_trip: result[i].Route,
						num_trip: result[i].TripNumber,
						name: result[i].LocationName,
						time: result[i].LastUpdate,
						image: path.join('/content', images[j])
				}
				activity.push(obj);
			}
		}
		res.send(activity);
	});
});
app.post('/activity/edit', (req, res) =>{
	console.dir(req.body);
	var tripId = req.body.tripId;
	var detailId = req.body.tripDetailId;
	var images = JSON.parse(req.body.images);
	var length = images.length;
	var url = [];
	for(var i = 0; i < length; i++){
		try {
			url.push(images[i].name);
			console.dir(url);
			if(images[i].base64 != ''){
				if(images[i].base64.indexOf('/tmp/') >= 0){ // copy file
					// rename
					var name = images[i].base64.split('/').pop(); 
					var src = path.join(localTmp, name);
					var des = path.join(localFile, images[i].name)
					fs.createReadStream(src).pipe(fs.createWriteStream(des));
				} else {
					var baseCode = images[i].base64.split(',')[1];
					var buffer = new Buffer(baseCode, 'base64');
					fs.writeFileSync(path.join(localFile, images[i].name), buffer, 'base64', (err)=>{
						if(err){
							console.dir(err);
							res.send({status: 0, message: 'Save file fail'});
						}
						console.log('Save file success', path.join(localFile, images[i].name));
					});
				}
				
//				var fd = fs.openSync(path.join(localFile, images[i].name), "w");
//				fs.writeSync(fd, buffer);
//				fs.closeSync(fd);
			}
		} catch(err){
			console.dir(err);
		}
	}
	database.editActivity(tripId, detailId, url.join('@'), (result)=> {
		res.send({status: 1, message: 'Success'});
	});
});
app.get('/report', function(req, res){
	var username = req.query.user;
	var dateFrom = req.query.from;
	var dateTo = req.query.to;
	database.getReport(username, dateFrom, dateTo, (result)=>{
		res.send(result);
	});
})
//Handle 404 error. 
app.use("*",function(req,res){
	res.status(404).sendFile(path.join(__dirname, '404/404.html'));
});
io.sockets.on('connection', function(socket){
  common.log('user connect socket ' + socket.id);
  clearInterval(timer);
  timer = setInterval(()=>{
	  database.driverAssigned((result)=>{
			if(result.length == 0){
				var data = {status: 0, message: 'Not anything new', num_notify: 0, username: '-1'}
				//io.sockets.emit('receiveNotify', data);
			} else {
				var length = result.length;
				var arr = [];
				for(var i = 0; i < length; i++){
					var obj = {
						id: result[i].TripID, 
						name: result[i].Route,
						time: result[i].TripDate,
						status: result[i].IsConfirmed,
						trip_num : result[i].TripNumber,
						username: result[i].DriverUser.toUpperCase(),
						num_notify: result[i].num_notify,
						customer: result[i].CustomerName,
						address:result[i].Address,
						typeGoods: result[i].TypeGoods,
						location: [],
						ware_house:[]
					}
					arr.push(obj);
				}
				
				var data = {status: 1, message: 'success', trip: arr};
				io.sockets.emit('receiveNotify', data);
			}
		});
  }, 7000);
  socket.on('disconnect', function () {
		console.log('socket.io is disconnected');
  });
//  socket.on('notify', function(data){
//	  common.log(data.message);
//      // Send message to everyone
//	  var username = data.user.username;
//	  setInterval(()=>{
//		  database.driverAssigned((result)=>{
//				if(result.length == 0){
//					var data = {status: 0, message: 'Not anything new', num_notify: 0, username: '-1'}
//					//io.sockets.emit('receiveNotify', data);
//				} else {
//					var length = result.length;
//					var arr = [];
//					for(var i = 0; i < length; i++){
//						var obj = {
//							id: result[i].TripID, 
//							name: result[i].Route,
//							time: result[i].TripDate,
//							status: result[i].IsConfirmed,
//							trip_num : result[i].TripNumber,
//							username: result[i].DriverUser.toUpperCase(),
//							num_notify: result[i].num_notify,
//							location: []
//						}
//						arr.push(obj);
//					}
//					
//					var data = {status: 1, message: 'success', trip: arr};
//					io.sockets.emit('receiveNotify', data);
//				}
//			});
//	  }, 3000);
//  })
});
server.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info(">> Server listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	console.log('__________>> isLoggedIn ', req.isAuthenticated());
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}