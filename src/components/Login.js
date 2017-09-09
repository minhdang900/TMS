/**
 * 
 * @author DangTM R&D Department
 * @date May 23, 2017
 * @addr ELCOM-HCM
 * 
 */
import '../assets/stylesheets/css/app-aba-login.css';
import React, { Component } from 'react';
import Cookie from "react-cookie";
import FWPlugin from ".././common/app.plugin";
import ReactDOM from "react-dom";
import Common from  ".././common/app.common";
import {Link} from 'react-router-dom';
import Widget from '.././common/app.widget';
class Login extends React.Component{
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		console.log('Welcome to login screen');
		// auto login
		Common.user = Cookie.load("user");
		if(Common.user != undefined){ // not logout
			this.login();
		}
	}
	componentDidMount(){
//		Common.user = Cookie.load("user");
		$(ReactDOM.findDOMNode(this.refs.username)).val((Cookie.load("user") == undefined? "": Common.user.username));
		$(ReactDOM.findDOMNode(this.refs.password)).val((Cookie.load("user") == undefined? "": Common.user.password));
	}
	login(){
		FWPlugin.showIndicator();
		var username = $(ReactDOM.findDOMNode(this.refs.username)).val();
		var password = $(ReactDOM.findDOMNode(this.refs.password)).val();
		var obj = {
			url: '/login',
			type: 'POST',
			data: {username: username, password: password}
		}
		Common.request(obj, function(res){
			FWPlugin.hideIndicator();
			// check login
			if(res.status){
				if(Cookie.load("user") == undefined){
					var date = new Date();
					date.setFullYear(date.getFullYear() + 10); // set expires 10 year
					Cookie.save("user", JSON.stringify({fullname: res.user.fullname, address: res.user.address, phone: res.user.phone, star: res.user.star, username: username, password: password, login: true}), {expires: date});
				}
				Common.user = {fullname: res.user.fullname, address: res.user.address, phone: res.user.phone, star: res.user.star, username: username, password: password, login: true};
				//location.reload();
				Cookie.save("user", JSON.stringify({fullname: res.user.fullname, address: res.user.address, phone: res.user.phone, star: res.user.star, username: username, password: password, login: true}), {expires: date});
				location.href="/#/home";
			} else {
				FWPlugin.modal({
					title: 'ABA Cooltrans',
					text: '<p class="color-red"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ĐĂNG NHẬP THẤT BẠI !</p>', 
					buttons: [
					     {text: '<span class="color-red"><i class="ios-icons">close</i> ĐÓNG</span>', bold: true}
					]
				});
			}
		});
		return false;
	}
	render(){
		return(
				<div data-page="login-screen" className="page no-navbar no-toolbar no-swipeback">
				  <div className="page-content login-screen-content">
				    <div className="login-screen-title">ĐĂNG NHẬP</div>
				    <form>
				      <div className="thumbnail">
				      	<img src="/styles/images/logo-aba.png" />
				      </div>
				      <div className="list-block">
				        <ul>
				          <li className="item-content">
				            <div className="item-inner">
				              <div className="item-title label">
				              	<i className="ios-icons">person</i>
				              </div>
				              <div className="item-input">
				                <input type="text" ref="username" name="username" placeholder="Tên đăng nhập"/>
				              </div>
				            </div>
				          </li>
				          <li className="item-content">
				            <div className="item-inner">
				              <div className="item-title label">
				          		<i className="ios-icons">lock</i>
				          	  </div>
				              <div className="item-input">
				                <input type="password" ref="password" name="password" placeholder="Mật khẩu"/>
				              </div>
				            </div>
				          </li>
				        </ul>
				      </div>
				      <div className="list-block">
				        <ul>
				          <li>
				          	<p>
				          		<Link to="/login" replace onClick={this.login.bind(this)} className="button button-round active"><i className="ios-icons">login</i> Đăng Nhập</Link>
				          	</p>  
				          </li>
				        </ul>
				      </div>
				    </form>
				  </div>
				</div> 
		);
	};
}
export default Login;