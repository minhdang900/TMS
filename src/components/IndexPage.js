/**
 * 
 * @author DangTM R&D Department
 * @date May 22, 2017
 * @address ELCOM-HCM
 * 
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Common from  ".././common/app.common";
import Cookie from "react-cookie";
class Index extends Component{
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		Common.socket = io();
		Common.logs('CHECK LOGIN');
		Common.user = Cookie.load("user");
		if(Cookie.load('user') == undefined){
			location.href="/#/login";
			return;
		}
		Common.request({
			url: '/checkLogin',
			type: 'POST'
		}, function(res){
			if(res.status){
//				Common.user = res.user; not recommend
				location.href="/#/home";
			} else {
				//lost session timeout or restart server
				Common.user.login = false;
				location.href="/#/login";
			}
		});
	}
	componentDidMount(){	
	}
	render(){
		return (
			<div></div>
		);
	}
}
export default Index;