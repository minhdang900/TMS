import React, { Component } from 'react';
import cookie from "react-cookie";
import app from ".././common/app.plugin";
import ReactDom from "react-dom";
class Setting extends Component{
	constructor(props) {
		super(props);
		this.state={
				ip: '103.254.12.200',
				port:'8083',
				lid: 1,
				location: [{id:1, name:'Location 1'}, {id:2, name:'Location 2'}, {id:3, name:'Location 3'}]
		}
	}
	componentWillMount() {
	    
	}
	componentDidMount(){
		if(cookie.load("setting") != undefined){
			var opt = cookie.load("setting");
			this.setState({
				ip: opt.ip,
				port: opt.port,
				lid: opt.lid
			});
			$(ReactDom.findDOMNode(this.refs.location)).val(opt.lid);
		} else {
			var date = new Date();
			date.setFullYear(date.getFullYear() + 5); // set expires 5 year
			cookie.save("setting", JSON.stringify({ip: this.state.ip, port: this.state.port, lid: this.state.lid}), {expires: date});
		}
	}
	initSetting(){
		if(cookie.load("setting") != undefined){
			var opt = cookie.load("setting");
			$(ReactDom.findDOMNode(this.refs.ip)).val(opt.ip);
			$(ReactDom.findDOMNode(this.refs.port)).val(opt.port);
			$(ReactDom.findDOMNode(this.refs.location)).val(opt.lid);
		}
	}
	saveSetting(){
		var ip = $(ReactDom.findDOMNode(this.refs.ip)).val();
		var port = $(ReactDom.findDOMNode(this.refs.port)).val();
		var lid = $(ReactDom.findDOMNode(this.refs.location)).val();
		if(ip != ""  && port != "" && lid != ""){
			var date = new Date();
			date.setFullYear(date.getFullYear() + 5); // set expires 5 year
			cookie.save("setting", JSON.stringify({ip: ip, port: port, lid: lid}), {expires: date});
			location.reload();
		}
	}
	render(){
		return(
			<div className="setting">
				<button data-popup=".popup-setting" className="open-popup" onClick={this.initSetting.bind(this)}></button>
				<div className="popup popup-setting">
				    <div className="content-block">
				      <div className="btn-setting">
					      <a href="#" className="list-button close-popup" onClick={this.saveSetting.bind(this)}>Save</a>
				      </div>
				      <form  className="list-block">
					      <ul>
					        <li>
					          <div className="item-content">
					            <div className="item-inner">
					              <div className="item-title label">IP Server</div>
					              <div className="item-input">
					                <input type="text" ref="ip" name="ip" defaultValue="103.254.12.200" placeholder="Your IP Server" />
					              </div>
					            </div>
					          </div>
					        </li>
					        <li>
					          <div className="item-content">
					            <div className="item-inner">
					              <div className="item-title label">Port</div>
					              <div className="item-input">
					                <input type="text" ref="port" defaultValue="8083" name="port" placeholder="Port" />
					              </div>
					            </div>
					          </div>
					        </li>
					        <li>
					          <div className="item-content">
					            <div className="item-inner">
					              <div className="item-title label">Location</div>
					              <div className="item-input">
					              	 <div className="item-input">
				                          <select ref="location" className="list-location">
						                        {this.state.location.map(function(item){
						                        	return(<option key={item.id} value={item.id}>{item.name}</option>);
						                        })}
				                          </select>
				                      </div>
					              </div>
					            </div>
					          </div>
					        </li>
					      </ul>
					    </form>
				    </div>
				</div>
			</div>
		);
	};
}
export default Setting;