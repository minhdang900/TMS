/**
 * 
 * @author DangTM R&D Department
 * @date Jun 4, 2017
 * @addr ELCOM-HCM
 * 
 */

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Tabbar from './Tabbar';
import Common from ".././common/app.common";
import FWPlugin from ".././common/app.plugin";
import Cookie from "react-cookie";
var $$ = Dom7;
class Notify extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			notify: [{
				id: '-1',
				name: 'KHÔNG CÓ THÔNG BÁO MƠI',
				action: '/notify',
				time: Common.getDateTime(),
				status: '0',
				sender: 'TMS',
				content: "KHÔNG CÓ THÔNG BÁO MƠI"
			}]
		}
	}
	componentWillMount(){
		this.getNotify();
	}
	componentDidMount(){
		
	}
	getNotify(){
		var _=this;
		Common.request({
					type: 'GET', 
					url: '/notification', 
					data: {username: Common.user.username || Cookie.load("user").username}
				},function(res){
					if(res.status == 1){
						if(res.notify.length > 0){
							_.setState({notify: res.notify});
						}
					}
				});
	}
	back(){
		//history.back();
	}
	deleteItem(id){
		var _=this;
		FWPlugin.modal({
		    title:  'TMS Message',
		    text: 'BẠN CÓ CHẮC XÓA?',
		    buttons: [
		      {
		        text: '<i class="ios-icons">close</i> HUỶ'
		      },
		      {
		        text: '<i class="ios-icons">trash</i> XÓA',
		        onClick: function() {
		        	Common.request({type: 'POST', url: '/notification/delete/' + id}, function(res){
		    			if(res.status){
		    				 var notify = $.grep(_.state.notify, function(n){
		  		     		   return n["id"] != id; 
		  		     	     });
		    				 if(notify == undefined || notify.length == 0){
		    					 _.setState({notify: [{
		    							id: '-1',
		    							name: 'KHÔNG CÓ THÔNG BÁO MƠI',
		    							action: '/notify',
		    							time: Common.getDateTime(),
		    							status: '0',
		    							sender: 'TMS',
		    							content: "KHÔNG CÓ THÔNG BÁO MƠI"
		    						}]});
		    				 } else {
		    					 _.setState({notify: notify});
		    				 }
		    			} else{
		    				FWPlugin.alert("ĐÃ XẢY RA LỖI");
		    			}
		    		});
		     	  
		        }
		      },
		    ]
	   });
	}
	readMessage(item){
		var _ = this;
		FWPlugin.modal({
		    title:  'TMS Message',
		    text: item.content,
		    buttons: [ 
		      {
		        text: '<i class="ios-icons">close</i> ĐÓNG',
		        onClick: function() {
		        	Common.request({type: 'POST', url: '/notification/' + item.id}, function(res){
		    			var num = Number($("#num_notify span.badge").text());var notify = _.state.notify;
		    			var notify = _.state.notify;
						var indx = notify.findIndex(element=> element.id == item.id);
						notify[indx].status = 1;
						_.setState({notify: notify});
		    			if(num - 1 > 0){
		    				$("#num_notify span.badge").html(num -1);
		    				$("#num_notify span.badge").removeClass('hidden');
		    			} else {
		    				$("#num_notify span.badge").addClass('hidden');
		    			}
		    		});
		        }
		      }]
		});
		
	}
	markIsRead(item){
		var _=this;
		Common.request({type: 'POST', url: '/notification/' + item.id}, function(res){
			console.log('Set notification');
			var num = Number($("#num_notify span.badge").text());
			if(res.status){
				var notify = _.state.notify;
				var indx = notify.findIndex(element=> element.id == item.id);
				notify[indx].status = 1;
				_.setState({notify: notify});
				if(num - 1 > 0){
					$("#num_notify span.badge").html(num -1);
					$("#num_notify span.badge").removeClass('hidden');
				} else {
					$("#num_notify span.badge").addClass('hidden');
				}
			}
		});
	}
	getItem(item){
		var btn = '';
		if(item.id != '-1'){
			btn = <div className="item-after">
		        	<div onClick={this.deleteItem.bind(this, item.id)}><i className="ios-icons color-orange">trash</i> </div>
		           </div> 
		}
		return ( 
				<li className="accordion-item" key={'notify__' + item.id}>
	       	      <Link to='/notify' replace className="item-content item-link">
	       	       <div className="item-media">
	       	       		<div onClick={this.markIsRead.bind(this, item)} style={{fontSize: '25px'}}>
	       	       			<i className={item.status == 1 ? "fa fa-envelope-open-o color-orange" : "fa fa-envelope color-orange"} aria-hidden="true"></i>
	       	       		</div>
	       	       </div> 
	       	       <div className="item-inner" onClick = {this.readMessage.bind(this, item)}>
		       	       <div className="item-title">
		       	       		{item.content}
		       	       </div>
	       	          <div className="item-subtitle"><i className="fa fa-clock-o" aria-hidden="true"></i> {item.time}</div>
	       	          <div className="item-subtitle"><i className="fa fa-user" aria-hidden="true"></i> {item.sender}</div>
	       	        </div>
		       	     {btn}
	       	      </Link>
		       	   <div className="accordion-item-content">
	      	        <div className="content-block">
	      	        	<p>{item.content}</p>
	      	        </div>
	      	      </div>
	       	    </li>
		);
	}
	render(){
		return (
			<div style={{'height': '100%'}}>
	    		<div className="statusbar-overlay"></div>
	    		<div className="panel-overlay"></div>
	    		<div className="views tabs toolbar-through"> 
			       <div className="view tab active">
					    <div className="navbar">
							<div className="navbar-inner">
								<div className="left">
				    	          {	 /*<Link to="/notify" replace className="back link close-popup" onClick={this.back.bind(this)}>
				    	          	 	<i className="ios-icons" style={{"fontSize": '25px', "marginRight": '5px'}}>chevron_left</i>quay lại
				    	          	 </Link> */}
			    	            </div>
								<div className="center sliding">THÔNG BÁO !</div>
								<div className="right">
									{/*<div className="toolbar tabbar tabbar-labels">
										<div className="toolbar-inner">
											<Link to={'/notify'} replace className={this.props.index == "1"? "tab-link active": "tab-link"}> <i
												className="ios-icons icons-home">home_fill</i>
												<span className="tabbar-label">Trang Chủ</span></Link>
											<Link to={'/notify'} replace id="num_notify" className={this.props.index == "3"? "tab-link active": "tab-link"}> 
												<i className="ios-icons icons-bell">bell_fill<span className={Common.num_notify > 0 ? "badge bg-red":"badge bg-red hidden"}>{Common.num_notify}</span></i><span
												className="tabbar-label">Thông Báo</span></Link>
										</div>
									</div>*/}
								</div>
							</div>
						</div>
				       <div className="pages">
				       		<div data-page="notify" className="page notify">
					       		<div className="page-content">
					       		  <div className="list-block media-list accordion-list">
							       	  <ul>
							       	  	{this.state.notify.map(this.getItem, this)}
							       	  </ul>
							       	</div>
					       		</div>
				       		</div>
				       </div>
			       </div>
				   <Tabbar index="3" />
				</div>
		    </div>
		);
	}
}
export default Notify;