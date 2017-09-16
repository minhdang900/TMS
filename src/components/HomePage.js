/**
 * 
 * @author DangTM R&D Department
 * @date May 22, 2017
 * @address ELCOM-HCM
 * 
 */
import '../assets/stylesheets/css/fontawesome-stars.css';
import '../assets/stylesheets/css/fontawesome-animation.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FWPlugin from ".././common/app.plugin"; 
import Tabbar from './Tabbar';
import Person from './Person';
import Cookie from "react-cookie";
import Common from ".././common/app.common";
import Widget from '.././common/app.widget';
import { HashRouter as Router, Route, Link, hashHistory, IndexRoute  } from 'react-router-dom';
var $$ = Dom7;
class Home extends Component{ 
	constructor(props) {
		super(props);
		this.state = {
			latitude: 0,
			longitude:0,
			tripId: '',
			locationId: '', 
			trip_num: '',
			isAllowEnd: false, // allow show button VỀ BÃI
			trips:[{ 
				id: '-1',
				name: 'BẠN CHƯA CÓ CHUYẾN',
				trip_num: '00000',
				status: '-1',
				time: Common.getDateTime(), 
				location:[{
					id: '-1', 
					name: 'ĐIỂM GIAO',
					status: '-1', 
					address:'CHƯA CÓ ĐIỂM GIAO',
					phone: '0125957975',
					time: Common.getDateTime()
				}]
			}]
		}		
	}
	componentWillMount() {
		this.getTrips();
		// set server
//		Widget.callAndroid({cmd:'set', key:'SERVER', value:'http://logaba.com:19091'});
		// set notify
//		Widget.callAndroid({cmd:'set', key:'NOTIFY', value:'http://logaba.com:19091/notify/check?username=' + Common.user.username.toUpperCase()});
		Widget.callAndroid({cmd:'set', key:'USERNAME', value: Common.user.username.toUpperCase()});
	}
	componentDidMount(){
		var _ =this; 
		var ptrContent = $$('.pull-to-refresh-content');
		FWPlugin.initPullToRefresh(ptrContent) ;
		ptrContent.on('ptr:refresh', function (e) {
			_.getTrips();
		});
		Common.socket.on('receiveNotify', this.receiveNotify.bind(this));
		$('#star-rating').barrating({
	        theme: 'fontawesome-stars',
	        initialRating: Common.user.star,
	        showVlaues: true,
	        readonly: true,
	        onSelect:function(value, text, event){
	        }
	      });
	}
	receiveNotify(data){
		var _=this;
		console.log(data);
		var trip = data.trip.find(function(element){
			return element.username.toUpperCase() == Common.user.username.toUpperCase();
		});
		if(trip == undefined){
			return;
		}
		if(trip.username.toUpperCase() == Common.user.username.toUpperCase()){
			if(Common.isShowNotify || !Common.user.login){
				return false;
			}
			Common.num_notify = trip.num_notify;
			if(Common.num_notify > 0){
				$('#num_notify').find('span.bagde').html(Common.num_notify);
				$('#num_notify').find('span.bagde').removeClass('hidden');
			}
			if(Number(trip.status) == 0){
				//var trip = res.trip;
				Common.isShowNotify = true;
				FWPlugin.modal({
			    title:  'CHUYẾN MỚI',
			    text: '<div style="text-align:left">'
				    	 +'<p><i class="fa fa-key color-orange" aria-hidden="true"></i> '+trip.trip_num+'</p>'
				    	 +'<p><i class="fa fa-user-secret color-orange" aria-hidden="true"></i> '+trip.customer+'</p>'
				    	 +'<p><i class="fa fa-cubes color-orange" aria-hidden="true"></i> '+trip.typeGoods+'</p>'
				    	 +'<p><i class="fa fa-truck color-orange" aria-hidden="true"></i> '+trip.address+'</p>'
			    	 +'</div>'
			    	 +'<p style="font-size:16px; font-weigh: bolder">Bạn có đồng ý vận chuyển?</p>',
			    buttons: [ 
			      {
			        text: '<i class="ios-icons">close</i> TỪ CHỐI',
			        onClick: function() {
			        	Common.request({
			         		type: 'GET',
			         		url: '/notify/reply',
			         		data: {id: trip.id, status: 0, username: Common.user.username}
			         	}, (res)=>{
			         		_.isShowNotify = false;
			         		trip.status = 11;
			         		_.receiveTrip(trip);
			         	});
			        }
			      },
			      {
			        text: '<i class="ios-icons">check</i> CHẤP NHẬN',
			        onClick: function() {
			        	Common.request({
			         		type: 'GET',
			         		url: '/notify/reply',
			         		data: {id: trip.id, status: 1, username: Common.user.username}
			         	}, (res)=>{
			         		Common.logs('accept');
			         		Common.isShowNotify = false;
			         		trip.status = '7'; // Chua roi bai
			         		_.receiveTrip(trip);
			         	});
			        }
			      },
			    ]
			  });
			}
		}
	}
	receiveTrip(res){
		var _=this;
		var trips = [];
		var tmp = _.state.trips;
		trips.push(res);
		if(_.state.trips[0].status == '-1'){
			tmp = [];
		}
		for(var i = 0; i < tmp.length; i++){
			trips.push(tmp[i]);
		}
		_.setState({trips: trips});
	}
	updateTrip(){
		var trips = this.state.trips;
		var length = trips.length;
		for(var i = 0; i < length; i++){
			if(trips[i].id == this.state.tripId){
				var count = 0;
				for(var j = 0; j < trips[i].location.length; j++){
					if(trips[i].location[j].id == this.state.locationId){
						trips[i].location[j].status = '3';
					} 
					if(Number(trips[i].location[j].status) == 3){
						count+=1;
					}
				}
				if(count == trips[i].location.length){
					trips[i].status = '3';
				}
				this.setState({trips: trips});
			}
		}
	}
	
	getTrips(){
		var _=this;
		FWPlugin.showIndicator();
		var obj = {
			type: 'GET',
			data: {username: Common.user.username || Cookie.load("user").username},
			url: '/trips'
		}
		Common.request(obj, (res)=> {
			var tmp = res.trips;
			var length = tmp.length;
			var trips = [];
//			var tripState = _.state.trips;
			for(var i = 0; i < length; i++){
				var obj = {
					id: tmp[i].id,
					name: tmp[i].name,
					status: tmp[i].status,
					time: tmp[i].time,
					trip_num: tmp[i].trip_num,
					location:[]
				} 
				trips.push(obj);
			}
			if(length > 0){
				_.setState({trips: trips});
			}
			FWPlugin.pullToRefreshDone();
			FWPlugin.hideIndicator();
		});	
	}
	/**
	 * toggle accordion
	 */
	itemClick(item){
		var _=this;
		var id = item.id; 
		// update TripID current
		_.setState({tripId: id, trip_num: item.trip_num.replace('/', '')});
		Common.request({
			url :'/detail/' + id,
			type: 'GET'
		}, function(res){
			var trips = _.state.trips;
			var length = trips.length;
			for(var i = 0; i < length; i++){
				if(trips[i].id == item.id){
					// check status = 4 or = 3
					trips[i].location = res.trips;
					var count = 0;
					var isAllowEnd = false;
					trips[i].location.forEach(function(item){
						if(item.status == 3 || item.status == 4){
							count +=1;
						}
					});
					if(count == trips[i].location.length){
						isAllowEnd = true;
					}
					_.setState({trips: trips, isAllowEnd: isAllowEnd});
					FWPlugin.accordionToggle('.item__' + id);	
					return;
				}
			}
		});
		
		event.preventDefault();
	}
	openSide(event){
		FWPlugin.openPanel('left');
		$('.panel-overlay').on('click', function(){
			FWPlugin.closePanel();
		});
	}
	finishPoint(item){
		// update TripDetailID current
		var _ = this;
		_.setState({locationId: item.id});
		Common.getLocation(function(pos){
			_.setState({latitude: pos.lat, longitude: pos.lon});
		});
		FWPlugin.popup('.popup-confirm');
	}
	departure(item){
		var _=this;
		Common.getLocation(function(pos){
			 _.setState({latitude: pos.lat, longitude: pos.lon});
			 FWPlugin.showIndicator();
			 Common.request({type:'POST', url:'/trip/departure', 
				 data:{id: item.id, num: 0, latitude: pos.lat, longitude: pos.lon}}, function(res){
	   			 FWPlugin.hideIndicator();
	   			 if(res.status){
	   				 FWPlugin.alert('XÁC NHẬN RỜI BÃI THÀNH CÔNG');
	   				 var trips = _.state.trips;
	    					for(var i = 0; i < trips.length; i++){
	    						if(Number(trips[i].id) == item.id){
	    							trips[i].status = '8';
	    							_.setState({
	    								trips: trips
	    							});
	    						}
	    					}
	   			 } else {
	   				 FWPlugin.alert('RỜI BÃI THẤT BẠI');
	   			 }
	   			 
	   		 });
		 });
	}
	/**
	 * Come to store
	 * 
	 */
	stock(item){
		var _=this;
		 Common.getLocation(function(pos){
			 _.setState({latitude: pos.lat, longitude: pos.lon});
			 FWPlugin.showIndicator();
			 Common.request({type:'POST', url:'/trip/stock', 
				 data:{id: item.id, num: 0, latitude: pos.lat, longitude: pos.lon}}, function(res){
	   			 FWPlugin.hideIndicator();
	   			 if(res.status){
	   				 FWPlugin.alert('XÁC NHẬN TỚI KHO THÀNH CÔNG');
	   				 var trips = _.state.trips;
	    					for(var i = 0; i < trips.length; i++){
	    						if(Number(trips[i].id) == item.id){
	    							trips[i].status = '9';
	    							_.setState({
	    								trips: trips
	    							});
	    						}
	    					}
	   			 } else {
	   				 FWPlugin.alert('XÁC NHẬN TỚI KHO THẤT BẠI');
	   			 }
	   			 
	   		 });
		 });
	}
	/**
	 * Receive Goods
	 */
	receiveGoods(item){
		var _=this;
		FWPlugin.showIndicator();
		 Common.getLocation(function(pos){
			 _.setState({latitude: pos.lat, longitude: pos.lon});
			 Common.request({type:'POST', url:'/trip/goods/start', 
				 data:{
					 id: item.id,
					 latitude: pos.lat, 
					 longitude: pos.lon,
					 status: '9'
				 }}, function(res){
	   			 FWPlugin.hideIndicator();
	   			 if(res.status){
	   				FWPlugin.alert('BẮT ĐẦU NHẬN HÀNG');
	   				var trips = _.state.trips;
						for(var i = 0; i < trips.length; i++){
							if(Number(trips[i].id) == item.id){
								trips[i].status = '10';
								_.setState({
									trips: trips
								});
							}
						}
	   			 } else {
	   				 FWPlugin.alert('XÁC NHẬN THẤT BẠI');
	   			 }
	   			 
	   		 });
		 });
	}
	receiveGoodsDone(item){
		var _=this;
		FWPlugin.showIndicator();
		 Common.getLocation(function(pos){
			 _.setState({latitude: pos.lat, longitude: pos.lon});
			 Common.request({type:'POST', url:'/trip/goods/end', 
				 data:{
					 id: item.id,
					 latitude: pos.lat, 
					 longitude: pos.lon,
					 status: '9'
				 }}, function(res){
	   			 FWPlugin.hideIndicator();
	   			 if(res.status){
	   				FWPlugin.alert('ĐÃ NHẬN HÀNG XONG');
	   				var trips = _.state.trips;
						for(var i = 0; i < trips.length; i++){
							if(Number(trips[i].id) == item.id){
								trips[i].status = '1';
								_.setState({
									trips: trips
								});
							}
						}
	   			 } else {
	   				 FWPlugin.alert('XÁC NHẬN THẤT BẠI');
	   			 }
	   			 
	   		 });
		 });
	}
	startTrips(item){
		var _=this;
		FWPlugin.showIndicator();
		 Common.getLocation(function(pos){
			 _.setState({latitude: pos.lat, longitude: pos.lon});
			 Common.request({type:'POST', url:'/trip/start', 
				 data:{
					 id: item.id,
					 latitude: pos.lat, 
					 longitude: pos.lon
				 }}, function(res){
	   			 FWPlugin.hideIndicator();
	   			 if(res.status){
	   				FWPlugin.alert('CHUYẾN ĐÃ BẮT ĐẦU');
	   				var trips = _.state.trips;
						for(var i = 0; i < trips.length; i++){
							if(Number(trips[i].id) == item.id){
								trips[i].status = '2';
								for(var j = 0; j < trips[i].location.length; j++){
									trips[i].location[j].status = '2';
								}
								_.setState({
									trips: trips
								});
							}
						}
	   			 } else {
	   				 FWPlugin.alert('XÁC NHẬN THẤT BẠI');
	   			 }
	   			 
	   		 });
		 });
	}
	cancelTrips(item){
		var _=this;
		FWPlugin.modal({
		    title:  'TMS Message',
		    text: 'HÃY NHẬP LÝ DO HỦY CHUYẾN',
		    afterText: '<textarea id="reasion_cancel_trip" placeholder="Nhập lý do hủy chuyến '+item.trip_num+'..."> </textarea>',
		    buttons: [
		      {
		        text: '<i class="ios-icons">close</i> ĐÓNG',
		      },
		      {
		        text: '<i class="ios-icons">forward</i> GỬI',
		        close: false, 
		        onClick: function() {
		        	 var msg = $('#reasion_cancel_trip').val();
		        	 if(msg != ""){
		        		 Common.getLocation(function(pos){
			    			_.setState({latitude: pos.lat, longitude: pos.lon});
			    			FWPlugin.showIndicator();
			    			FWPlugin.closeModal();
			    			Common.request({type:"POST", url: '/trip/cancel', data:{id: item.id, status: 11, latitude: _.state.latitude, longitude: _.state.longitude, message: msg}}, (res)=>{
			    				if(res.status){
			    					var trips = _.state.trips;
			    					var length = trips.length;
			    					for(var i = 0; i < length; i++){
			    						if(trips[i].id == item.id){
			    							trips[i].status = 11;
			    							_.setState({trips: trips});
			    						}
			    					}
			    					FWPlugin.alert('CHUYẾN '+item.trip_num+' ĐÃ HỦY');
			    				} else {
			    					FWPlugin.alert('HỦY CHUYẾN THẤT BẠI');
			    				}
			    				FWPlugin.hideIndicator();
			    			});
				    	});
		        	 } else {
		        		 $('#reasion_cancel_trip').css('border: 1px solid red');
		        	 }
		        }
		      }]
		});
	}
	itemDraw(item){
		var buttonStart =  '';
		var buttonEnd =  '';
		var buttonCancel = <Link to="/home" replace 
								onClick={this.cancelTrips.bind(this, item)} style={{fontSize:'25px', float:'right'}}>
							 	<i className="ios-icons color-red">close_round_fill</i> 
							</Link>
							
		var status = <span className="badge bg-green"><i className="fa fa-check" aria-hidden="true"></i> HOÀN THÀNH</span>;
		 if(Number(item.status) == -1){
			status = '';
			buttonCancel = '';
		} else if(Number(item.status) == 7){
			status = <span className="badge bg-orange"><i className="fa fa-warning faa-flash animated" aria-hidden="true"></i> CHƯA RỜI BÃI </span>;
			buttonStart = <p>
							 <Link to="/home" replace 
								onClick={this.departure.bind(this, item)} className="button button-round button-fill button-start bg-orange">
							 	<i className="fa fa-space-shuttle faa-passing-reverse animated" aria-hidden="true"></i> RỜI BÃI
					   	     </Link>
						</p>
		} else if(Number(item.status) == 8){
			status = <span className="badge bg-orange"><i className="fa fa-space-shuttle faa-passing animated" aria-hidden="true"></i> ĐANG ĐẾN KHO HÀNG </span>;
			buttonStart = <p>
							 <Link to="/home" replace 
								onClick={this.stock.bind(this, item)} className="button button-round button-fill button-start bg-orange">
							 	<i className="fa fa-circle-o faa-burst animated" aria-hidden="true"></i> ĐẾN KHO HÀNG
					   	     </Link>
						</p>
		} else if(Number(item.status) == 9){
			status = <span className="badge bg-orange"><i className="fa fa-cubes" aria-hidden="true"></i> BẮT ĐẦU NHẬN HÀNG </span>;
			buttonStart = <p>
							 <Link to="/home" replace 
								onClick={this.receiveGoods.bind(this, item)} className="button button-round button-fill button-start bg-orange">
							 <i className="fa fa-cubes" aria-hidden="true"></i> NHẬN HÀNG
					   	     </Link>
						</p>
		} else if(Number(item.status) == 10){
			status = <span className="badge bg-orange"><i className="fa fa-spinner faa-spin animated" aria-hidden="true"></i> ĐANG NHẬN HÀNG </span>;
			buttonStart = <p>
							 <Link to="/home" replace 
								onClick={this.receiveGoodsDone.bind(this, item)} className="button button-round button-fill button-start bg-red">
							 	<i className="fa fa-exclamation-triangle" aria-hidden="true"></i> NHẬN HÀNG XONG
					   	     </Link>
						</p>
		} else if(Number(item.status) == 1){
			status = <span className="badge bg-red"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> CHUYẾN CHƯA BẮT ĐẦU </span>;
			buttonStart = <p>
							 <Link to="/home" replace 
								onClick={this.startTrips.bind(this, item)} className="button button-round button-fill button-start bg-red">
							 	<i className="fa fa-exclamation-triangle" aria-hidden="true"></i> BẮT ĐẦU CHUYẾN
					   	     </Link>
						</p>
		} else if(Number(item.status) == 2){
			buttonEnd = <p>
							 <Link to="/home" replace 
								onClick={this.confirm.bind(this, item)} className="button button-round button-fill button-end">
							 	<i className="ios-icons">forward</i> VỀ BÃI
						     </Link>
						 </p>
			status = <span className="badge bg-orange"><i className="fa fa-refresh fa-spin fa-fw"></i> ĐANG XỬ LÝ </span>;
		} else if(Number(item.status) == 3){
			buttonStart = '';
			status = <span className="badge bg-green"><i className="fa fa-check" aria-hidden="true"></i> HOÀN THÀNH</span>;
		} else if(Number(item.status) == 4){
			buttonStart = '';
			buttonCancel = '';
			status = <span className="badge bg-red"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> ĐÃ HỦY</span>;
		} else if(Number(item.status) == 11){
			buttonStart = '';
			buttonCancel = '';
			status = <span className="badge bg-orange"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i> HỦY (ĐỢI DUYỆT)</span>;
		} 
		return (
			<li key={item.id} className={"accordion-item "  + "item__" + item.id}>
     	    	 <Link to={'/home'} replace 
     	    			onClick={this.itemClick.bind(this, item)} 
     	    					className="item-content item-link">
	       	        <div className="item-inner">
	       	          <div className="item-title">
     	    	 		<p><i className="fa fa-truck color-orange" aria-hidden="true"></i> {item.name}</p>
     	    	 		<span className="item-text" style={{height: '30px'}}>
	  	    	 			<i className="fa fa-key" aria-hidden="true"></i> {item.trip_num}
	  	    	 		</span>
     	    	 		<span className="item-text" style={{height: '30px'}}>
     	    	 			<i className="fa fa-clock-o" aria-hidden="true"></i> {item.time}
     	    	 		</span>
     	    	 		
     	    	 	   </div>
	       	          <div className="item-after">
	       	          	{status}
	       	          </div>
	       	        </div>
     	          </Link>
	       	      <div className="accordion-item-content">
	       	        <div className="content-block">
			       	    <div className="timeline tablet-sides">
				       	    {/*buttonCancel*/}
				       	    {buttonStart}
				       	    {item.location.map(this.pointDraw, this)}
				       	    {this.state.isAllowEnd == true ? buttonEnd: ''}
				       	</div>
	       	        </div>
	       	      </div>
     	    </li>
		);
	}
	pointDraw(item){
		var _= this;		
		var status = <p className="color-green"><i className="fa fa-check-circle-o" aria-hidden="true"></i> HOÀN THÀNH </p>;
		var button = '';
		if(Number(item.status) == -1){
			status =  <p className="color-red"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> CHƯA CÓ CHUYẾN </p>;
		} else if(Number(item.status) == 1){
			status =  <p className="color-red"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> CHUYẾN CHƯA BẮT ĐẦU </p>;
		} else if(Number(item.status) == 2){
			status =  <p className="color-orange"><i className="fa fa-refresh fa-spin fa-fw"></i> ĐANG VẬN CHUYỂN </p>;
			button =<p>
						 <Link to="/home" replace 
							onClick={this.arrivedPoint.bind(this, item)} className="button button-round">
						 	<i className="fa fa-space-shuttle faa-passing animated" aria-hidden="true"></i> TỚI ĐIỂM GIAO
				   	      </Link>
					</p>				
		} else if(Number(item.status) == 3){
			status = <p className="color-green"><i className="fa fa-check-circle-o" aria-hidden="true"></i> HOÀN THÀNH </p>;
		} else if(Number(item.status) == 4){
			status =  <p className="color-red"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> ĐÃ HỦY </p>;
		}  else if(Number(item.status) == 11){
			status =  <p className="color-orange"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i> HỦY (ĐỢI DUYỆT) </p>;
		} else if(Number(item.status) == 5){
			status =  <p className="color-orange"><i className="fa fa-space-shuttle faa-passing animated" aria-hidden="true"></i> TỚI ĐIỂM GIAO </p>;
			button =<p>
						 <Link to="/home" replace 
							onClick={this.startTranfer.bind(this, item)} className="button button-round">
						 	<i className="ios-icons">forward</i> BẮT ĐẦU GIAO
				   	      </Link>
					</p>
		} else if(Number(item.status) == 6){
			status =  <p className="color-orange"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i> ĐANG GIAO </p>;
			button =<p>
						 <Link to="/home" replace 
							onClick={this.finishPoint.bind(this, item)} className="button button-round">
						 	<i className="ios-icons">forward</i> GỬI CHỨNG TỪ
				   	      </Link>
					</p>
		}
		return(
		 <div key={'point__' + item.id} className="timeline-item">
       	    <div className="timeline-item-date">
       	    	<i className="fa fa-map-marker color-orange" aria-hidden="true"></i> {item.name}</div>
       	    <div className="timeline-item-divider"></div>
       	    <div className="timeline-item-content">
       	      <div className="timeline-item-inner">
       	      	 {status}
	       	     <p className="active">
	       	     	<i className="fa fa-clock-o" aria-hidden="true"></i> {item.time}
		      	</p>
       	        <p>
       	        	<i className="fa fa-address-card" aria-hidden="true"></i> {item.address}
       	        </p>
	       	    <p>
	       	     	<i className="fa fa-cubes" aria-hidden="true"></i> {item.typeGoods}
		        </p>
		        <p>
		        	<i className="fa fa-database" aria-hidden="true"></i> {item.units}
       	     	</p>
		        <p>
		        	<i className="fa fa-thermometer-empty" aria-hidden="true"></i> {item.temperature}
		        </p>
       	        {button}
       	      </div>
       	    </div>
       	  </div>
		);
	}
	logout(){
		Common.request({type:"POST", url: '/logout'}, (res)=>{
			$('.panel-overlay').trigger('click');
			Cookie.remove("user");
//			Cookie.save("user", JSON.stringify({fullname:Common.user.fullname, username: Common.user.username, password: Common.user.password, login: false}));
//			Common.user.login = false;
//			Widget.callAndroid({cmd:'set', key:'NOTIFY', value:'http://logaba.com:19091/notify/check?username=unknown'});
			Widget.callAndroid({cmd:'set', key:'USERNAME', value:'unknown'});
			setTimeout(function(){
				location.href = '/#/login';
			}, 500);
		});
	}
	handlerSetting(){
		$('.panel-overlay').trigger('click');
	}
	handlerReport(){
		$('.panel-overlay').trigger('click');
		setTimeout(function(){
			location.href = '/#/report';
		}, 700);
	}
	updateStatusPoint(idPoint, status){
		var trips = this.state.trips;
		var length = trips.length;
		for(var i = 0; i < length; i++){
			if(trips[i].id == this.state.tripId){
				var count = 0;
				for(var j = 0; j < trips[i].location.length; j++){
					if(trips[i].location[j].id == idPoint){
						trips[i].location[j].status = status;
					} 
				}
				this.setState({trips: trips});
			}
		}
	}
	/**
	 * Arrived point
	 */
	arrivedPoint(item){
		var _=this;
		Common.getLocation(function(pos){
			_.setState({latitude: pos.lat, longitude: pos.lon});
			FWPlugin.showIndicator();
			Common.request({type:"POST", url: '/point/update', data:{id: item.id, status: 5, latitude: _.state.latitude, longitude: _.state.longitude, num: 0}}, (res)=>{
				if(res.status){
					_.updateStatusPoint(item.id, 5);
				} else {
					FWPlugin.alert('TỚI ĐIỂM GIAO THẤT BẠI');
				}
				FWPlugin.hideIndicator();
			});
    	});
//		FWPlugin.modal({
//		    title:  'TMS Message',
//		    text: 'NHẬP SỐ KM CÔNG TƠ TỚI ĐIỂM GIAO',
//		    afterText: '<input type="number" min = 0 id="num_km_trip" placeholder="Số KM công tơ" />',
//		    buttons: [
//		      {
//		        text: '<i class="ios-icons">close</i> ĐÓNG',
//		      },
//		      {
//		        text: '<i class="ios-icons">forward</i> GỬI',
//		        close: false, 
//		        onClick: function() {
//		        	 var km = $('#num_km_trip').val();
//		        	 if(km != "" && Number(km) > 0){
//		        		 Common.getLocation(function(pos){
//			    			_.setState({latitude: pos.lat, longitude: pos.lon});
//			    			FWPlugin.showIndicator();
//			    			FWPlugin.closeModal();
//			    			Common.request({type:"POST", url: '/point/update', data:{id: item.id, status: 5, latitude: _.state.latitude, longitude: _.state.longitude, num: km}}, (res)=>{
//			    				if(res.status){
//			    					_.updateStatusPoint(item.id, 5);
//			    				} else {
//			    					FWPlugin.alert('TỚI ĐIỂM GIAO THẤT BẠI');
//			    				}
//			    				FWPlugin.hideIndicator();
//			    			});
//				    	});
//		        	 } else {
//		        		 $('#num_km_trip').css('border: 1px solid red');
//		        	 }
//		        }
//		      }]
//		});
		
	}
	/**
	 * Start transfer goods
	 */
	startTranfer(item){
		var _= this;
		FWPlugin.showIndicator();
		Common.getLocation(function(pos){
			_.setState({latitude: pos.lat, longitude: pos.lon});
			Common.request({type:"POST", url: '/point/update', data:{id: item.id, status: 6, latitude: _.state.latitude, longitude: _.state.longitude}}, (res)=>{
				if(res.status){
					_.updateStatusPoint(item.id, 6);
				}
				FWPlugin.hideIndicator();
			});
		});
	}
	confirm(item){
		var _=this;
		FWPlugin.modal({
		    title:  'TMS Message',
		    text: 'NHẬP SỐ KM CÔNG TƠ KẾT THÚC CHUYẾN',
		    afterText: '<input type="number" min = 0 id="num_km_trip_end" placeholder="Số KM công tơ" />',
		    buttons: [
		      {
		        text: '<i class="ios-icons">close</i> ĐÓNG',
		      },
		      {
		        text: '<i class="ios-icons">forward</i> GỬI',
		        close: false, 
		        onClick: function() {
		        	 var km = $('#num_km_trip_end').val();
		        	 if(km != "" && Number(km) > 0){
		        		 FWPlugin.closeModal();
		        		 FWPlugin.showIndicator();
				    		Common.getLocation(function(pos){
				    			_.setState({latitude: pos.lat, longitude: pos.lon});
				    			Common.request({url:'/end', type: 'POST', 
			        				data: {username: Common.user.username, 
			        					id: item.id,
			        					latitude: _.state.latitude, 
			        					longitude: _.state.longitude, num: km }}, 
			        				function(res){
			        					FWPlugin.hideIndicator();
						        		if(res.status){
						        			FWPlugin.alert('KẾT THÚC CHUYẾN THÀNH CÔNG');
						        			var trips = _.state.trips;
						    				for(var i = 0; i < trips.length; i++){
						    					if(Number(trips[i].id) == item.id){
						    						trips[i].status = '3';
						    						for(var j = 0; j < trips[i].location.length; j++){
						    							if(trips[i].location[j].status != '3'){}
						    							trips[i].location[j].status = '4';
						    						}
						    						_.setState({
						    							trips: trips
						    						});
						    					}
						    				}
						    				
						        		} else {
						        			FWPlugin.alert('KẾT THÚC CHUYẾN THẤT BẠI');
						        		}
						        });
				    		});
		        	 } else {
		        		 $('#num_km_trip_end').css('border: 1px solid red');
		        	 }
		        }
		      }]
	   });
   }
	
	goBack(){
		var _=this;
		FWPlugin.modal({
		    title:  'TMS Message',
		    text: 'NHẬP SỐ KM CÔNG TƠ VỀ BÃI',
		    afterText: '<input type="number" min = 0 id="num_km_end" placeholder="Số KM công tơ" />',
		    buttons: [
		      {
		        text: '<i class="ios-icons">close</i> ĐÓNG',
		      },
		      {
		        text: '<i class="ios-icons">forward</i> GỬI',
		        close: false, 
		        onClick: function() {
		        	 var km = $('#num_km_end').val();
		        	 if(km != "" && Number(km) > 0){
		        		 FWPlugin.closeModal();
		        		 FWPlugin.showIndicator();
		        		 Common.getLocation(function(pos){
		        			 _.setState({latitude: pos.lat, longitude: pos.lon});
		        			 Common.request({type:'POST', url:'/leave/end', data:{username: Common.user.username, num: km, latitude: pos.lat, longitude: pos.lon}}, function(res){
			        			 FWPlugin.hideIndicator();
			        			 if(res.status){
			        				 FWPlugin.alert('XÁC NHẬN VỀ BÃI THÀNH CÔNG');
			        				 $(ReactDOM.findDOMNode(_.refs['go_back'])).remove();
			        			 } else {
			        				 FWPlugin.alert('VỀ BÃI THẤT BẠI');
			        			 }
			        		 });
		        		 });
		        		 
		        	 } else {
		        		 $('#num_km_end').css({'border': '1px solid red'});
		        	 }
		         }
			   }]
		
		});
	}
	render(){
//		var buttonStart = <p ref="leave_park" id="leave_park" style={{margin:'55px 20% 15px 20%'}}>
//						  	<Link to='/home' onClick={this.leavePark.bind(this)} replace 
//						  		className="button button-round active color-orange">
//						  			<i className="fa fa-space-shuttle faa-passing-reverse animated" aria-hidden="true"></i> RỜI BÃI</Link>
//						</p>;
//		var buttonEnd = <p ref="go_back" id="go_back" style={{margin:'15px 20% 15px 20%'}}>
//							<Link to='/home' onClick={this.goBack.bind(this)} replace className="button button-round active color-orange">
//								<i className="fa fa-space-shuttle faa-passing animated" aria-hidden="true"></i> VỀ BÃI</Link>
//						</p>;
//		if(this.state.trips[0].id == "-1"){
//			buttonStart = "";
//			buttonEnd = "";
//		}
		return (
		    	<div style={{'height': '100%'}}>
			    	<div className="statusbar-overlay"></div>
				    <div className="panel-overlay"></div>
				    <div className="panel panel-left panel-reveal">
					    <div className="content-block">
					      <p className="icon-user">
					      	<img src="/styles/images/user.png"/>
					      </p>
					      <p className="experence-star">
						  	<select id="star-rating">
				       		  <option value="1">1</option>
				       		  <option value="2">2</option>
				       		  <option value="3">3</option>
				       		  <option value="4">4</option>
				       		  <option value="5">5</option>
				       		</select> 
			      		  </p>
					      <p><i className="ios-icons">person</i> {Common.user.fullname}</p>
					      <p><i className="ios-icons">phone_round</i> {Common.user.phone}</p>
					      <p>
						   <Link to={'/home'} replace onClick={this.handlerReport.bind(this)} className="link"> 
						   	  <i className="ios-icons" style={{'marginRight': '10px'}}>document_text_fill</i> BÁO CÁO
						   </Link>
						  </p>
					      <p>
							   <Link to={'/home'} replace onClick={this.handlerSetting.bind(this)} className="link"> 
							   	  <i className="ios-icons">settings</i> CÀI ĐẶT
							   </Link>
					      </p>
					      <p>
					      	<Link to={'/home'} replace className="link" onClick={this.logout.bind(this)}>
					      		<i className="ios-icons">logout</i> THOÁT
					      	</Link>
					      </p>
					    </div>
				    </div>
				    <div className="views tabs toolbar-through">
				       <div className="view tab active">
						    <div className="navbar">
								<div data-page="dashboard" className="navbar-inner">
									<div className="left"></div>
									<div className="center ">THÔNG TIN GIAO HÀNG</div>
									<div className="right">
									  <Link to={'/home'} data-panel="left" 
										  onClick={this.openSide.bind(this, event)} 
									  	  className="open-pannel open-left-panel link icon-only" replace>  
									  	<i className="ios-icons">person</i>
									  </Link>
									</div>
								</div>
							</div>
					       <div className="pages">
					       		<div data-page="home" className="page">
					       			<div className="page-content pull-to-refresh-content" data-ptr-distance="55">
							       		<div className="pull-to-refresh-layer">
							       	      <div className="preloader"></div>
							       	      <div className="pull-to-refresh-arrow"></div>
							       	    </div>
						       			<div className="list-block accordion-list">
								       	  	<ul>
								       	  		{this.state.trips.map(this.itemDraw, this)}
						       				</ul>
								       </div>
					       			</div>
					       		</div>
					       		<Popup updateTrip={this.updateTrip.bind(this)} 
					       				latitude={this.state.latitude} 
					       				longitude = {this.state.longitude} 
					       				trip_id={this.state.tripId} 
					       				location_id = {this.state.locationId} 
					       				trip_num={this.state.trip_num}/>
					       </div>
				       </div>
					   <Tabbar index="1"/>
					</div>
		    	</div>
	
		    )
	}
}

class Popup extends React.Component { 
		constructor(props) {
			super(props);
			this.state = {
				isChange: false,
				images:[],
				rating: 5,
				cards:[{
					id:'-1',
					name: 'CHỤP HÌNH HOẶC CHỌN CHỨNG TỪ',
					image: '',
					time: Common.getDateTime()
				 }]
			
			}
	   }
	   componentWillMount(){
	   }
	   componentDidMount(){   
			
	   }
	   back(){
		   var _=this;
		   if(this.state.isChange){
			   FWPlugin.modal({
				    title:  'TMS Message',
				    text: 'Bạn chưa gửi hóa đơn<p>Bạn có muốn thoát?</p>',
				    buttons: [
					 {
					    text: '<i class="ios-icons">close</i> KHÔNG',
					    onClick: function() {
					      
					    }
					  },
				      {
				        text: '<i class="ios-icons">check</i> CÓ',
				        onClick: function() {
				        	_.setState({
				        		isChange: false, 
				        		images:[],
								cards:[{
									id:'-1',
									name: 'Chưa có hóa đơn được chọn',
									image: '',
									time: Common.getDateTime()
								 }]
				        	});
				        	FWPlugin.closeModal('.popup-confirm');
				        }
				      }
				    ]
			   });
		   } else {
			   FWPlugin.closeModal('.popup-confirm');
		   }
	   }
	   capture(){
		 var _=this;
		 $('#camera').trigger('click');
		// Handle native
		// FWPlugin.showIndicator();
		 Widget.callAndroid({cmd:'get', key:'CAMERA', value:'', action: 'TSM.getData'});
		 var cards = this.state.cards;
		 if(cards.length > 0 && cards[0].id == -1){
			  cards = [];
		  }
	     var images = this.state.images;
		 var time = setInterval(function(){
			 if(TSM.TRANSPORTER != null){
				if(TSM.TRANSPORTER == -1){
					clearInterval(time);
					TSM.TRANSPORTER = null;  
					return;
				}
				Common.logs('CAMERA ' + TSM.TRANSPORTER);
				clearInterval(time);
				var data = TSM.TRANSPORTER;
				TSM.TRANSPORTER = null;  
				var name = data[0].name;
				var ext = name.split('.').pop();
                var obj = {
                	id: Common.random(),
                	name: _.props.trip_num + '_' + Common.random()+ '_' + Common.getTime() + '.' + ext,
                	image: 'http://logaba.com:19091/tmp/' + name,
                	time: Common.getDateTime()
                }
                images.push({id: obj.id, name: obj.name, base64: '/tmp/' +  name});
                cards.push(obj);
                _.setState({isChange:true, images: images, cards: cards});
              //  FWPlugin.hideIndicator();
			 }
		 }, 500);
	   }
	   browserFile(){
		  var _=this;
	      $('#files').trigger('click');
	      // Handle native
	    //  FWPlugin.showIndicator();
		  Widget.callAndroid({cmd:'get', key:'IMAGE', value:'', action: 'TSM.getData'});
		  var cards = _.state.cards;
		  if(cards.length > 0 && cards[0].id == -1){
			  cards = [];
		  }
		  var images = _.state.images;
		  var time = setInterval(function(){
				 if(TSM.TRANSPORTER != null){
					 if(TSM.TRANSPORTER == -1){
							clearInterval(time);
							TSM.TRANSPORTER = null;  
							return;
					 }
					clearInterval(time);
					Common.logs('BROWSER IMAGE ' + TSM.TRANSPORTER);
	                var data = TSM.TRANSPORTER;
	                TSM.TRANSPORTER = null;
	                var length = data.length;
	                for(var i = 0; i < length; i++){
	                	var name = data[i].name;
	                	var ext = name.split('.').pop();
		                var obj = {
		                	id: Common.random(),
		                	name: _.props.trip_num + '_' + Common.random()+ '_' + Common.getTime() + '.' + ext,
		                	image: 'http://logaba.com:19091/tmp/' + name,
		                	time: Common.getDateTime()
		                }
		                Common.logs('IMAGE LINK >> ' + obj.image);
		                images.push({id: obj.id, name: obj.name, base64: '/tmp/' + name}); 
		                cards.push(obj);
	                }
	              //  FWPlugin.hideIndicator();
	                _.setState({isChange:true, images: images, cards: cards});   
				 }
			 }, 500);

	   } 
	   send(){
		   var _=this;
		   if(_.state.images.length == 0){
			   FWPlugin.modal({
				    title:  'TMS Message',
				    text: 'PHẢI CHỌN HÓA ĐƠN ĐỂ GỬI',
				    buttons: [
				      {
				        text: '<i class="ios-icons">close</i> ĐÓNG',
				        onClick: function() {
				        }
				      }
				    ]
			   });
			   return;
		   }
		   FWPlugin.modal({
			    title:  'TMS Message',
			    text: 'NHẬP SỐ KHAY GIAO/NHẬN',
			    afterText: '<input type="number" min = 0 id="num_package" placeholder="Nhập số khay giao/nhận" />',
			    buttons: [
			      {
			        text: '<i class="ios-icons">close</i> ĐÓNG',
			        onClick: function() {
			        }
			      },
			      {
			        text: '<i class="ios-icons">forward</i> GỬI',
			        onClick: function() {
			        	_.handleSendInvoice();
			        }
			      }
			    ]
		   });
	   }
	   handleSendInvoice(){
		   var _=this;
		   FWPlugin.showIndicator();
		   var numPackage = $('#num_package').val();
		   var data = {
			   numPackage: (numPackage == ""? 0 : numPackage),
			   tripId: _.props.trip_id, 
			   tripDetailId: _.props.location_id,
			   images: JSON.stringify(_.state.images),
			   coordinate: _.props.latitude + '@' + _.props.longitude
		   }
		   Common.request({
			   url:'/send/invoice', 
			   type: 'POST',
			   data: data
	   	   }, function(res){
			 FWPlugin.hideIndicator();
	   		 if(Number(res.status) == 1){
			   var option =  '<select id="user-rating">'
							+  ' <option value="1">1</option>'
							+  ' <option value="2">2</option>'
							+  ' <option value="3">3</option>'
							+  ' <option value="4">4</option>'
							+  ' <option value="5">5</option>'
							+ '</select>'
			   FWPlugin.modal({
				    title:  'TMS Message',
				    text: 'ĐÁNH GIÁ DỊCH VỤ GIAO/NHẬN' + option,
					afterText: '<input type="password" name="user-rating" id="user-rating" placeholder="NHẬP MÃ KHÁCH HÀNG" />',
				    buttons: [
				      {
				        text: '<i class="ios-icons">close</i> ĐÓNG',
				        onClick: function() {
				        	 _.setState({isChange: false});
				        	 // update trip
				        	 _.props.updateTrip();
				        }
				      },
				      {
				        text: '<i class="ios-icons">forward</i> GỬI',
				        onClick: function() {
				        	var customerCode = $('#user-rating').val();
				        	if(customerCode == ""){
				        		return false;
				        	}
				        	 _.setState({isChange: false});
				        	 // update trip
				        	 _.props.updateTrip();
				        	 // send rating
				        	 Common.request({url:'/send/rating', data: {
				        		 				tripId: _.props.trip_id, 
				  			   					tripDetailId: _.props.location_id, rating: _.state.rating, customer_code: customerCode }, type: "POST"}, function(res){
				        		 if(res.status){
				        			 FWPlugin.modal({
						 				    title:  'TMS Message',
						 				    text: 'GỬI ĐÁNH GIÁ THÀNH CÔNG',
						 				    buttons: [
						 				      {
						 				        text: '<i class="ios-icons">close</i> ĐÓNG',
						 				        onClick: function(){
						 				        	_.setState({
										        		isChange: false, 
										        		images:[],
														cards:[{
															id:'-1',
															name: 'Chưa có hóa đơn được chọn',
															image: '',
															time: Common.getDateTime()
														 }]
										        	});
										        	FWPlugin.closeModal('.popup-confirm');
						 				        }
						 				      }]
						        		 });
				        		 }
				        	 });
				        }
				      }]
			   });
			   $$('.modal').on('modal:opened', function(){
				 $('#user-rating').barrating({
					theme: 'fontawesome-stars',
					initialRating: 5,
					showVlaues: true,
					readonly: false,
					onSelect:function(value, text, event){
						var rating = value;
						_.setState({rating: rating});
					}
				  });
		   
				});
		   }
	     });
	   }
	   resizeImage(img, width, height) {

		    // create an off-screen canvas
		    var canvas = document.createElement('canvas'),
		        ctx = canvas.getContext('2d');

		    // set its dimension to target size
		    canvas.width = width;
		    canvas.height = height;

		    // draw source image into the off-screen canvas:
		    ctx.drawImage(img, 0, 0, width, height);

		    // encode image to data-uri with base64 version of compressed image
		    return canvas.toDataURL();
		}
	   handleFileSelect(event){
		   var _= this;
			 //Check File API support
		    if (window.File && window.FileList && window.FileReader) {
		        var files = event.target.files; //FileList object
		        var cards = _.state.cards;//[];
		        var images = _.state.images; //[];
		        for (var i = 0; i < files.length; i++) {
		            var file = files[i];
		            //Only pics
		            if (!file.type.match('image')) continue;
		            var picReader = new FileReader();
		            picReader.addEventListener("load", function (event) {
		                var picFile = event.target;
		                var ext = picFile.result.split(';')[0].split('/')[1];
		                var obj = {
		                	id: Common.random(),
		                	name: _.props.trip_num + '_' + Common.random()+ '_' + Common.getTime() + '.' + ext,
		                	image: picFile.result,
		                	time: Common.getDateTime()
		                }
		                var img = new Image();
		                img.src = picFile.result;
		                img.onload = function() {
		                    var newSrc = _.resizeImage(img, img.width*0.7, img.height*0.7);
		                    images.push({id: obj.id, name: obj.name, base64: newSrc});
		                    cards.push(obj);
		                    _.setState({isChange:true, images: images, cards: cards});
		                };
		            });
		            //Read the image
		            picReader.readAsDataURL(file);
		        }
		    } else {
		        console.log("Your browser does not support File API");
		    }
	   }
	   handleFileEdit(event){
		    var _= this;
			 //Check File API support
		    if (window.File && window.FileList && window.FileReader) {
		        var files = event.target.files; //FileList object
		        var cards = this.state.cards;
		        var images = this.state.images;
		        var id =  $('#file-edit').attr('data-id');
		        for (var i = 0; i < files.length; i++) {
		            var file = files[i];
		            //Only pics
		            if (!file.type.match('image')) continue;
		            var picReader = new FileReader();
		            picReader.addEventListener("load", function (event) {
		            	var picFile = event.target;
		            	var ext = picFile.result.split(';')[0].split('/')[1];
	            		$.each(cards, function(index, element) {
	            		    if (this.id == id) {
	            		    	this.name =  _.props.trip_num + '_' + Common.random() + '_' + Common.getTime() + '.' + ext,
			                	this.image = picFile.result;
	            		    	var img = new Image();
	    		                img.src = picFile.result;
	    		                img.onload = function() {
	    		                    var newSrc = _.resizeImage(img, img.width*0.7, img.height*0.7);
	    		                    images[index] = {id: id, name: this.name, base64: newSrc};
		            		        _.setState({isChange:true, cards: cards, images: images});
	    		                };
	            		    	
	            		        return;
	            		    }
	            		});
		            });
		            //Read the image
		            picReader.readAsDataURL(file);
		        }
		    } else {
		        console.log("Your browser does not support File API");
		    }
	   }
	   editBill(item){
		   var _=this;
		   $('#file-edit').attr('data-id', item.id);
		   $('#file-edit').trigger('click');
		   // Handle native android
		  //FWPlugin.showIndicator();
		  Widget.callAndroid({cmd:'get', key:'IMAGE', value:'', action: 'TSM.getData'});
		  var cards = _.state.cards;
		  var images = _.state.images;
		  var time = setInterval(function(){
				 if(TSM.TRANSPORTER != null){
					 if(TSM.TRANSPORTER == -1){
							clearInterval(time);
							TSM.TRANSPORTER = null;  
							return;
						}
					 clearInterval(time);
					Common.logs('BROWSER IMAGE ' + TSM.TRANSPORTER);
	                var data = TSM.TRANSPORTER;
	                TSM.TRANSPORTER = null;
	                var length = data.length;
	                for(var i = 0; i < 1; i++){
	                	var name = data[i].name;
               		 	var ext = name.split('.').pop();
	                	$.each(cards, function(index, element) {
	            		    if (this.id == item.id) {
	            		    	this.name =  _.props.trip_num + '_' + Common.random() + '_' + Common.getTime() + '.' + ext,
			                	this.image = 'http://logaba.com:19091/tmp/' + name;
	            		    	 images[index] = {id: item.id, name: this.name, base64: '/tmp/' + name};
		            		     _.setState({isChange:true, cards: cards, images: images});
	            		        return;
	            		    }
	            		});
	                }
				 }
			 }, 500);
	   }
	   deleteBill(item, event){
		   var _=this;
		   FWPlugin.modal({
			    title:  'TMS Message',
			    text: 'Hóa đơn sẽ được xóa?',
			    buttons: [
			      {
			        text: '<i class="ios-icons">close</i> HỦY',
			        onClick: function() {
			        }
			      },
			      {
			        text: '<i class="ios-icons">trash</i> XÓA',
			        onClick: function() {
			           var $this = ReactDOM.findDOMNode(_.refs['delete_' + item.id]);
			 		   var cards = $.grep(_.state.cards, function(card){
			 			   return card["id"] != item.id; 
			 		   });
					   var images = $.grep(_.state.images, function(image){
			 			   return image["id"] != item.id; 
			 		   });
			 		   _.setState({cards: cards, images: images});
			        }
			      },
			    ]
		   });
		   
	   }
	   render() {
	      return (
    		  <div className="popup popup-confirm page navbar-through toolbar-fixed">
	    		  <div className="navbar">
	    	        <div className="navbar-inner">
	    	          <div className="left">
	    	          	 <Link to="/home" replace className="back link close-popup" onClick={this.back.bind(this)}>
	    	          	 	<i className="ios-icons" style={{"fontSize": '25px', "marginRight": '5px'}}>chevron_left</i>QUAY LẠI
	    	          	 </Link>
	    	          </div>
	    	        </div>
	    	      </div>
    		    <div className="page-content">
    		    	 <input id="files" type="file" multiple accept="image/*" onChange={this.handleFileSelect.bind(this)} className="hidden"/>
    		    	 <input id="file-edit" data-id="" accept="image/*" type="file" onChange={this.handleFileEdit.bind(this)} className="hidden"/>
    		    	 <input type="file" accept="image/*" capture="camera" className="hidden" id="camera" />
    		    	 {this.state.cards.map(function(item){
    		    		 var footer = <div className="card-footer">
					    		       <Link to="/home" replace className="link" ref={'edit_' + item.id} onClick={this.editBill.bind(this, item)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
					    		       <Link to="/home" replace className="link" ref={'delete_' + item.id} onClick={this.deleteBill.bind(this, item)}><i className="ios-icons">trash</i></Link>
					    		     </div>;
					    var image = <img src={item.image}/>;
					    if(Number(item.id) == -1){
					    	image = '';
					    	footer = '';
					    }
    		    		 return (
		    				 <div key={'card__' + item.id} className="card card-header-pic">
		    				 	<div className="card-header">{item.name}</div>
				    		    <div className="card-content">
				    		       {image}
				    		      <div className="card-content-inner">
				    		        <p className="color-white"><i className="ios-icons">time</i> {item.time}</p>
				    		      </div>
				    		    </div>
				    		    {footer}
				    		</div> 
    		    		);
    		    	 }, this)}
    		    </div>
    		     <div className="toolbar tabbar tabbar-labels">
    		        <div className="toolbar-inner">
    		          	<Link to="/home" className="tab-link" replace onClick={this.capture.bind(this)}><i className="ios-icons">camera</i>
		          			<span className="tabbar-label">CHỤP CHỨNG TỪ</span>
		          		</Link>
    		          	<Link to="/home" className="tab-link" replace onClick={this.browserFile.bind(this)}><i className="ios-icons">cloud_upload</i>
    		          		<span className="tabbar-label">CHỌN CHỨNG TỪ</span>
    		          	</Link>
    		          	<Link to="/home" className="tab-link" replace onClick={this.send.bind(this)}><i className="ios-icons">forward</i>
	          				<span className="tabbar-label">GỬI CHỨNG TỪ</span>
	          			</Link>
    		        </div>
    		      </div> 
    		  </div>
	      );
	   }
}
		    		
class Picker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}
    componentWillMount(){
    }
    componentDidMount(){
    }
    done(){
    	FWPlugin.closeModal('.picker-react');
    }
    cancel(){
    	FWPlugin.closeModal('.picker-react');
    }
    render() {
      return (
    		  <div className="picker-modal picker-react">
    		    <div className="toolbar">
    		      <div className="toolbar-inner">
    		        <div className="left">
    		        	<Link to="/home" replace onClick={this.done.bind(this)} className="close-picker color-root">
    		        		<i className="ios-icons">check</i> đồng ý</Link>
    		        </div>
    		        <div className="right">
    		        	<Link to="/home" replace onClick={this.cancel.bind(this)} className="close-picker color-red">
    		        		<i className="ios-icons">close</i> từ chối</Link>
    		        </div>
    		      </div>
    		    </div>
    		    <div className="picker-modal-inner">
    		      <div className="content-block">
    		        <h4>Có chuyến mới dành cho bạn</h4>
    		        <p>Chuyến đi miền tây</p>
    		        <p>Bạn có đồng ý vận chuyển?</p>
    		      </div>
    		    </div>
    		  </div>
      );
   }
}
export default Home;