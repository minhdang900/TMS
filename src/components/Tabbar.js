import React, { Component } from 'react';
import cookie from "react-cookie";
import Plugin from ".././common/app.plugin";
import Common from ".././common/app.common";
import ReactDom from "react-dom";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
class Tabbar extends React.Component{
	constructor(props) {
		super(props);
	}
	componentWillMount() {
	}
	componentDidMount(){
	}
	render(){
		return(
			<div className="toolbar tabbar tabbar-labels"> 
				<div className="toolbar-inner">
					<Link to={'/home'} replace className={this.props.index == "1"? "tab-link active": "tab-link"}> <i
						className="ios-icons icons-home">home_fill</i>
						<span className="tabbar-label">TRANG CHỦ</span></Link>
					<Link to={'/activity'} replace className= {this.props.index == "2"? "tab-link active": "tab-link"}> 
						<i className="ios-icons">star_fill</i> 
						<span className="tabbar-label">HOẠT ĐỘNG</span></Link>
					<Link to={'/notify'} replace id="num_notify" className={this.props.index == "3"? "tab-link active": "tab-link"}> 
						<i className="ios-icons icons-bell">bell_fill<span className={Common.num_notify > 0 ? "badge bg-red":"badge bg-red hidden"}>{Common.num_notify}</span></i><span
						className="tabbar-label">THÔNG BÁO</span></Link>
				</div>
			</div>
		);
	};
}
export default Tabbar;