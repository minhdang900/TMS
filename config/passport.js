// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var database = require('../models/database');
var common = require('../common');
var user = {};
// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.username);
		console.dir('serializeUser ' + user);
	});

	// used to deserialize the user
	passport.deserializeUser(function(username, done) {
		common.log('deserializeUser ' + username);
		// find user by username, receive data from database
		done(null, user);
	});
	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for
	// signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will
		// override with email
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	// allows us to pass back the entire request to the callback
	}, function(req, username, password, done) { // callback with username
													// and password from our
													// form
		common.log('Loggin with username ' + username + ' password:' + password);
		database.login(username, password, function(returnValue) {
			console.log('>>> Result', returnValue);
			if (returnValue['recordset'].length == 0) {
				return done(null, false, req.flash('loginMessage',
						'Oops! Wrong password.')); // create the loginMessage
													// and save it to session as
													// flashdata
			}
			var obj = returnValue.recordset[0];
			user = {
				username : obj.LoginName,
				fullname : obj.EmployeeName,
				address : obj.Address,
				phone : obj.Phone1,
				star : obj.Rating,
				image : obj.AvatarLink
			}
			return done(null, user);
		});

	}));

};
