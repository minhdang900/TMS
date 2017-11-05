/**
 * 
 * @author DangTM R&D Department
 * @date May 22, 2017
 * @address ELCOM-HCM
 * 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/HomePage';
import Index from './components/IndexPage';
import Person from './components/Person';
import Login from './components/Login';
import Activity from './components/Activity';
import Notify from './components/Notification';
import Report from './components/Report';
import FWPlugin from './common/app.plugin';
import cookie from 'react-cookie';
import MobileDetect from 'mobile-detect';
import Common from './common/app.common';
import { browserHistory } from 'react-router';
import { HashRouter as Router, Route, Link, hashHistory, IndexRoute  } from 'react-router-dom'; // recommend

ReactDOM.render((
	   <Router history={browserHistory}>
		 <div style={{'height': '100%'}}>
			<Route path="/" component={Index}/>
		    <Route path="/login" component={Login}/>
			<Route path="/home" component={Home}/>
			<Route path="/activity" component={Activity}/>
			<Route path="/notify" component={Notify}/>
			<Route path="/person" component={Person}/>
			<Route path="/report" component={Report}/>
		</div>
	   </Router>
	), document.getElementById('root'));

var md = new MobileDetect(window.navigator.userAgent);
console.log( md.mobile() );          
console.log( md.phone() );           
console.log( md.tablet() );          
console.log( md.userAgent() );       
console.log( md.os() );            
console.log( md.is('iPhone') );     