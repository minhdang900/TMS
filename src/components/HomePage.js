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
import Filter from './DateFilter'
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
			listTray: [],
			trips:[{ 
				id: '-1',
				name: 'BẠN CHƯA CÓ CHUYẾN',
				trip_num: '00000',
				status: '-1',
				time: Common.getDateTime(), 
				ware_house:[],
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
		var date = Common.getLast30Days();
		var today = new Date();
		$('.date-from').val(moment().format('YYYY-MM-DD')); // get today
		$('.date-to').val(moment().format('YYYY-MM-DD')); // get today
		$('.date-from').attr(
				   "data-date", 
				   moment().format( $('.date-from').attr("data-date-format") ));
		$('.date-to').attr(
				   "data-date", 
				   moment().format( $('.date-from').attr("data-date-format") ));
		
		var ptrContent = $$('.pull-to-refresh-content');
		FWPlugin.initPullToRefresh(ptrContent) ;
		ptrContent.on('ptr:refresh', function (e) {
			_.getTrips();
		});
		Common.socket.on('receiveNotify', this.receiveNotify.bind(this));
//		$('#star-rating').barrating({
//	        theme: 'fontawesome-stars',
//	        initialRating: Common.user.star,
//	        showVlaues: true,
//	        readonly: true,
//	        onSelect:function(value, text, event){
//	        }
//	      });
	}
	receiveNotify(data){
		var _=this;
		if(Common.user == undefined){
			return;
		}
		var trip = data.trip.find(function(element){
			return element.username.toUpperCase() == Common.user.username.toUpperCase();
		});
		if(trip == undefined){
			return;
		}
		if(trip.username.toUpperCase() == Common.user.username.toUpperCase()){
			if(Common.isShowNotify || !Common.user.login){
				return;
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
				    text: 'ĐÓNG',
				    onClick: function() {
				    	Common.request({
				     		type: 'GET',
				     		url: '/notify/viewed',
				     		data: {id: trip.id, username: Common.user.username}
				     	}, (res)=>{
				     		Common.isShowNotify = false;
				//     		trip.status = '7'; // Chua roi bai
				     		_.receiveTrip(trip);
				     	});
				    }
				  },
			      {
			        text: 'TỪ CHỐI',
			        onClick: function() {
			        	_.denyTrip(trip);
			        }
			      },
			      {
			        text: 'NHẬN',
			        onClick: function() {
			        	_.acceptTrip(trip);
			        }
			      }
			      
			    ]
			  });
			}
		}
	}
	acceptTrip(trip){
		var _=this;
		Common.request({
     		type: 'GET',
     		url: '/notify/reply',
     		data: {id: trip.id, status: 1, username: Common.user.username}
     	}, (res)=>{
     		Common.isShowNotify = false;
     		trip.status = 7; // Chua roi bai
     		_.receiveTrip(trip);
     	});
	}
	denyTrip(trip){
		var _=this;
		FWPlugin.modal({
    		title:'TMS Message',
    		text:'CHUYẾN SẼ ĐƯỢC HỦY?',
    		buttons:[
				{
					text:'ĐÓNG',
					close: true,
					onClick: function(){
						Common.request({
				     		type: 'GET',
				     		url: '/notify/viewed',
				     		data: {id: trip.id, username: Common.user.username}
				     	}, (res)=>{
				     		_.isShowNotify = false;
//				     		trip.status = 4;
				     		_.receiveTrip(trip);
				     	});
					}
				},
    		  {
    			text:'ĐỒNG Ý',
    			close: true,
    			onClick: function(){
    				Common.request({
    		     		type: 'GET',
    		     		url: '/notify/reply',
    		     		data: {id: trip.id, status: 0, username: Common.user.username}
    		     	}, (res)=>{
    		     		_.isShowNotify = false;
    		     		trip.status = 4;
    		     		_.receiveTrip(trip);
    		     	});
    			}
    		}]
    	});
	}
	receiveTrip(res){
		var _=this;
		var trips = [];
		var tmp = _.state.trips;
		var check = 0;
//		trips.push(res);
		if(_.state.trips[0].status == '-1'){
			tmp = [];
		}
		for(var i = 0; i < tmp.length; i++){
			if(res.id == tmp[i].id){
				check = 1;
				tmp[i] = res;
			}
			trips.push(tmp[i]);
		}
		if(check == 0){
			trips.push(res);
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
	updatePointState(){
		var _=this;
		var trips = this.state.trips;
		var indexTrip = trips.findIndex((x)=> x.id == _.state.tripId);
    	var location = trips[indexTrip].location;
    	var index = location.findIndex((x)=> x.id == _.state.locationId);
    	if(location[index].numPackage != -1){ // show input package
    		FWPlugin.modal({
    		    title:  'TMS Message',
    		    text: 'NHẬP SỐ KIỆN GIAO',
    		    afterText: '<input type="number" min = "0" max="1000" id="num_package" placeholder="Số Kiện Giao" />',
    		    buttons: [
    		      {
    		        text: '<i class="ios-icons">forward</i> GỬI',
    		        close: false, 
    		        onClick: function() {
    		        	 var num = $('#num_package').val();
    		        	 if(num != "" && Number(num) > 0){
    		        		 FWPlugin.closeModal();
    		        		 FWPlugin.showIndicator();
    				    		Common.getLocation(function(pos){
    				    			_.setState({latitude: pos.lat, longitude: pos.lon});
    				    			Common.request({url:'/point/package', type: 'POST', 
    			        				data: {
    			        					id: _.state.locationId,
    			        					latitude: _.state.latitude, 
    			        					longitude: _.state.longitude, num: num }}, 
    			        				function(res){
    			        					FWPlugin.hideIndicator();
    						        		if(res.status){
    						        			trips[indexTrip].location[index].status = 8;
    						        	    	_.setState({trips: trips});
    						        		} else {
    						        			FWPlugin.alert('KẾT NỐI THẤT BẠI');
    						        		}
    						        });
    				    		});
    		        	 } else {
    		        		 $('#num_package').css('border: 1px solid red');
    		        	 }
    		        }
    		      }]
    	   });
    	} else {
    		FWPlugin.showIndicator();
    		Common.getLocation(function(pos){
    			_.setState({latitude: pos.lat, longitude: pos.lon});
    			Common.request({url:'/point/update', type: 'POST', 
    				data: {
    					id: _.state.locationId,
    					status: 8,
    					latitude: _.state.latitude, 
    					longitude: _.state.longitude }}, 
    				function(res){
    					FWPlugin.hideIndicator();
		        		if(res.status){
		        			trips[indexTrip].location[index].status = 8;
		        	    	_.setState({trips: trips});
		        		} else {
		        			FWPlugin.alert('KẾT NỐI THẤT BẠI');
		        		}
		        });
    		});
    	}
	}
	getTrips(){
		var _=this;
		var from = $('.date-from').attr('data-date');
		var to = $('.date-to').attr('data-date');
		FWPlugin.showIndicator();
		var obj = {
			type: 'GET',
			data: {username: Common.user.username || Cookie.load("user").username, date_from: from, date_to: to},
			url: '/trips'
		}
		Common.request(obj, (res)=> {
			var tmp = res.trips;
			var length = tmp.length;
			if(length > 0){
				_.setState({trips: res.trips});
			} else {
				_.setState({
					trips:[{ 
					id: '-1',
					name: 'BẠN CHƯA CÓ CHUYẾN',
					trip_num: '00000',
					status: '-1',
					time: Common.getDateTime(), 
					ware_house:[],
					location:[{
						id: '-1', 
						name: 'ĐIỂM GIAO',
						status: '-1', 
						address:'CHƯA CÓ ĐIỂM GIAO',
						phone: '0125957975',
						time: Common.getDateTime()
					}]
				  }]
				});
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
//		_.setState({tripId: id, trip_num: item.trip_num.replace('/', '')});
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
					trips[i].ware_house = res.ware_house;
					if(count == trips[i].location.length){
						isAllowEnd = true;
					}
					_.setState({trips: trips, isAllowEnd: isAllowEnd, tripId: id, trip_num: item.trip_num.replace('/', '')});
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
	openFilter(event){
		FWPlugin.pickerModal('.picker-filter');
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
				 data:{id: item.id, num: 0, latitude: pos.lat, longitude: pos.lon, num: 0}}, function(res){
	   			 FWPlugin.hideIndicator();
	   			 if(res.status){
	   				 var trips = _.state.trips;
		   			 for(var i = 0; i < trips.length; i++){
							if(Number(trips[i].id) == item.id){
								trips[i].status = 8; // start delivery
								trips[i].ware_house = res.ware_house;
//								for(var j = 0; j < trips[i].location.length; j++){
//									trips[i].location[j].status = 2;
//								}
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
	wareHouseHandler(item){
		var _=this;
		var _status = Number(item.status) + 1;
		 Common.getLocation(function(pos){
			 _.setState({latitude: pos.lat, longitude: pos.lon});
			 FWPlugin.showIndicator();
			 // STATUS: 0: Disable, 2: Arrived ware house; 3: Receive Goods; 4: Leaved ware house
			 Common.request({type:'POST', url:'/trip/warehouse', 
				 data:{TripID: item.TripID, id: item.id, latitude: _.state.latitude, longitude: _.state.longitude, status: _status }}, function(res){
	   			 FWPlugin.hideIndicator();
	   			 if(res.status){
	   				 var trips = _.state.trips;
	   				 var index = trips.findIndex((x)=> x.id == item.TripID);
	   				 var wareHouse = trips[index].ware_house;
	   				 var indexWareHouse = wareHouse.findIndex((x)=> x.id == item.id);
	   				 var length = wareHouse.length;
	   				 var check = 0; // If only one warehouse have changed status to 4 => change status Trips Index.
					 for(var i = 0; i < length; i++){
						if(wareHouse[i].id == item.id){
							wareHouse[i].status = _status;
						}
					 }
					 if(_status == 4){
						 // When received warehouse first
						 if(item.id == trips[index].ware_house[0].id){
							 trips[index].status = 2; // start delivery
							 for(var j = 0; j < trips[index].location.length; j++){
								trips[index].location[j].status = 2;
							 }
						 }
						 // set status next warehouse
						 if(indexWareHouse+1 < length){
							 wareHouse[indexWareHouse+1].status = 1;
						 }
					 }
					 trips[index].ware_house = wareHouse;
					 _.setState({
						trips: trips
					 });
	   			 } else {
	   				if(item.status == 0){
	   					FWPlugin.alert('XÁC NHẬN TỚI KHO THẤT BẠI');
	   				 } else if(item.status == 1){
	   					FWPlugin.alert('XÁC NHẬN RỜI KHO THẤT BẠI');
	   				 }
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
//	   				FWPlugin.alert('ĐÃ NHẬN HÀNG XONG');
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
	   				var trips = _.state.trips;
						for(var i = 0; i < trips.length; i++){
							if(Number(trips[i].id) == item.id){
								trips[i].status = 2;
								for(var j = 0; j < trips[i].location.length; j++){
									trips[i].location[j].status = 2;
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
		var buttons = '';
		var buttonEnd = <p>
							 <Link to="/home" replace 
								onClick={this.returnBackPaking.bind(this, item)} className="button button-round button-fill button-end">
							 	<i className="ios-icons">forward</i> VỀ BÃI
						     </Link>
						 </p>
		var buttonCancel = <Link to="/home" replace 
								onClick={this.cancelTrips.bind(this, item)} style={{fontSize:'25px', float:'right'}}>
							 	<i className="ios-icons color-red">close_round_fill</i> 
							</Link>
							
		var status = <span className="badge bg-green"><i className="fa fa-check" aria-hidden="true"></i> HOÀN THÀNH</span>;
		 if(Number(item.status) == -1){
			status = '';
			buttonCancel = '';
			buttonEnd = '';
			buttons = '';
		} else if(Number(item.status) == 0){
			status = <span className="badge bg-orange"><i className="fa fa-warning faa-flash animated" aria-hidden="true"></i> CHƯA NHẬN CHUYẾN </span>;
			buttonCancel = '';
			buttonEnd = '';
			buttons = <p className = "buttons-row">
						 <Link to="/home" replace 
							onClick={this.denyTrip.bind(this, item)} className="button button-round button-fill" style={{color: '#fff',background: '#f58220'}}>
						 	<i className="ios-icons">close</i> TỪ CHỐI
					     </Link>
						 <Link to="/home" replace 
							onClick={this.acceptTrip.bind(this, item)} className="button button-round button-fill" style={{color: '#fff',background: '#f58220'}}>
						 	<i className="ios-icons">check</i> NHẬN CHUYẾN
					     </Link>
					 </p>
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
			buttonStart = '';
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
			status = <span className="badge bg-orange"><i className="fa fa-refresh fa-spin fa-fw"></i> ĐANG XỬ LÝ </span>;
		} else if(Number(item.status) == 3){
			buttonStart = '';
			status = <span className="badge bg-green"><i className="fa fa-check" aria-hidden="true"></i> HOÀN THÀNH</span>;
		} else if(Number(item.status) == 4){
			buttonStart = '';
			buttonCancel = '';
			buttonEnd = '';
			status = <span className="badge bg-red"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> ĐÃ HỦY</span>;
		} else if(Number(item.status) == 11){
			buttonStart = '';
			buttonCancel = '';
			status = <span className="badge bg-orange"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i> HỦY (ĐỢI DUYỆT)</span>;
		} else if(Number(item.status) == 12){
			buttonStart = '';
			buttonCancel = '';
			buttonEnd = '';
			status = <span className="badge bg-green"><i className="fa fa-check" aria-hidden="true"></i> ĐÃ VỀ BÃI</span>;
		} 
		return (
			<li key={item.id} className={"accordion-item "  + "item__" + item.id}>
     	    	 <Link to={'/home'} replace 
     	    			onClick={this.itemClick.bind(this, item)} 
     	    					className="item-content item-link">
	       	        <div className="item-inner">
	       	          <div className="item-title" style={{width:'100%'}}>
     	    	 		<p><i className="fa fa-truck color-orange" aria-hidden="true"></i> {item.name}</p>
     	    	 		<div className="item-after" style={{float:'right'}}>
		       	          	{status}
		       	        </div>
     	    	 		<span className="item-text" style={{height: '30px'}}>
	  	    	 			<i className="fa fa-key" aria-hidden="true"></i> {item.trip_num}
	  	    	 		</span>
     	    	 		<span className="item-text" style={{height: '30px'}}>
     	    	 			<i className="fa fa-clock-o" aria-hidden="true"></i> {item.time}
     	    	 		</span>
     	    	 		
     	    	 	   </div>
	       	          
	       	        </div>
     	          </Link>
	       	      <div className="accordion-item-content">
	       	        <div>
			       	    <div className="timeline tablet-sides">
				       	    {item.location.length > 0? buttonStart:''}
				       	    {buttons}
				       	  {/*<div style={{'display': (item.status == '7' || item.status == '11'?'none':'block')}}>*/}
				       	    	<div className="list-block media-list list-warehouse">
				       	    		<ul style={{background:'transparent'}}>
					       	    		{item.ware_house.map(function(x){
					       	    			return this.wareHouse(x, item.status);
					       	    		}, this)}
				       	    		</ul>
				       	    	</div>
				       	    {/*</div>*/}
				       	    {item.location.map(this.pointDraw, this)}
				       	    {this.state.isAllowEnd == true ? buttonEnd : ''}
				       	</div>
	       	        </div>
	       	      </div>
     	    </li>
		);
	}
	wareHouse(item, status){
		var button = '';
		if(item.status == 0){
			button = <span className="badge"><i className="fa fa-check-circle" aria-hidden="true"></i> CHƯA ĐẾN KHO</span>
		} if(item.status == 1){
			button = <Link to="/home" replace 
			 onClick={this.wareHouseHandler.bind(this, item)} className="button button-round button-fill bg-orange">
		 	 <i className="fa fa-circle-o faa-burst animated" aria-hidden="true"></i> ĐẾN KHO
 	      </Link>
		} else if(item.status == 2){
			button = <Link to="/home" replace 
					 onClick={this.wareHouseHandler.bind(this, item)} className="button button-round button-fill bg-orange">
				 	 <i className="fa fa-circle-o faa-burst animated" aria-hidden="true"></i> NHẬN HÀNG
		 	      </Link>
		} else if(item.status == 3){
			button = <Link to="/home" replace 
					 onClick={this.wareHouseHandler.bind(this, item)} className="button button-round button-fill bg-orange">
				 	 <i className="fa fa-circle-o faa-burst animated" aria-hidden="true"></i> RỜI KHO
			      </Link>
		}	else if(item.status == 4){
			button = <span className="badge bg-green"><i className="fa fa-check-circle" aria-hidden="true"></i> NHẬN HÀNG XONG</span>
		}
		if(status == 0 || status == 7 || status == 11 || status == 4){
			button = '';
		}
		return(
				<li key={'warehouse__' + item.id} className="item-content">
	             <div className="item-inner">
		           <div className="item-title-row">
		             <div className="item-title"><i className="fa fa-home color-orange" aria-hidden="true"></i> {item.name}</div>
		           </div>
		           <div className="item-subtitle">
		           		<p className="color-white"><i className="fa fa-map-marker color-orange" aria-hidden="true"></i> {item.address}</p>
		           		<div className="item-after" style={{float:'right'}}>
			              {button}
			             </div>
		           		<p className="color-white"><i className="fa fa-cubes color-orange" aria-hidden="true"></i> {item.type}</p>
		           		<p className="color-white"><i className="fa fa-thermometer-empty color-orange" aria-hidden="true"></i> {item.temperature}</p>
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
							onClick={this.delivery.bind(this, item, 5)} className="button button-round">
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
							onClick={this.delivery.bind(this, item, 6)} className="button button-round">
						 	<i className="ios-icons">forward</i> BẮT ĐẦU GIAO
				   	      </Link>
					</p>
		} else if(Number(item.status) == 6){
			status =  <p className="color-orange"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i> ĐANG GIAO </p>;
			button =<p>
						 <Link to="/home" replace 
							onClick={this.delivery.bind(this, item, 7)} className="button button-round">
						 	<i className="ios-icons">forward</i> GIAO HÀNG XONG
				   	      </Link>
					</p>
		} else if(Number(item.status) == 7){
			status =  <p className="color-orange"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i> GIAO XONG </p>;
			button =<p>
						 <Link to="/home" replace 
							onClick={this.delivery.bind(this, item, 8)} className="button button-round">
						 	<i className="ios-icons">forward</i> RỜI ĐIỂM GIAO
				   	      </Link>
					</p>
		} else if(Number(item.status) == 8){
			status =  <p className="color-orange"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i> GIAO XONG </p>;
			button =<p>
						 <Link to="/home" replace 
							onClick={this.finishPoint.bind(this, item)} className="button button-round">
						 	<i className="ios-icons">forward</i> GỬI CHỨNG TỪ
				   	      </Link>
					</p>
		}
		return(
		 <div key={'point__' + item.id} className="timeline-item">
       	  {/*  <div className="timeline-item-date">
       	    	<i className="fa fa-map-marker color-orange" aria-hidden="true"></i> {item.name}</div>
       	    <div className="timeline-item-divider"></div> */}
       	    <div className="timeline-item-content">
       	      <div className="timeline-item-inner">
       	      	 {status}
	       	     <p className="active">
	       	     	<i className="fa fa-clock-o" aria-hidden="true"></i> {item.time}
		      	</p>
		      	<p>
		      		<i className="fa fa-map-marker color-orange" aria-hidden="true"></i> {item.name}
		      	</p>
       	        <p>
       	        	<i className="fa fa-address-card" aria-hidden="true"></i> {item.address}
       	        </p>
	       	    <p>
	       	     	<i className="fa fa-clock-o" aria-hidden="true"></i> {item.time_delivery}
		        </p>
		        <p>
		        	<i className="fa fa-volume-control-phone" aria-hidden="true"></i> {item.contact}
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
			FWPlugin.closeModal('.picker-filter');
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
	delivery(item, status){
		var _=this;
		if(status == 8){
			_.setState({locationId: item.id});
			FWPlugin.popup('.popup-tray');
			return;
		}
		FWPlugin.showIndicator();
		Common.getLocation(function(pos){
			_.setState({latitude: pos.lat, longitude: pos.lon});
			Common.request({type:"POST", url: '/point/delivery', 
				data:{id: item.id, status: status, latitude: _.state.latitude, longitude: _.state.longitude, num: 0}}, (res)=>{
				if(res.status){
					_.updateStatusPoint(item.id, status);
				} else {
					FWPlugin.alert('XÁC NHẬN THẤT BẠI');
				}
				FWPlugin.hideIndicator();
			});
    	});	
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
					FWPlugin.alert('XÁC NHẬN THẤT BẠI');
				}
				FWPlugin.hideIndicator();
			});
    	});	
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
	returnBackPaking(item){
		var _=this;
		FWPlugin.modal({
		    title:  'TMS Message',
		    text: 'NHẬP SỐ KM CÔNG TƠ KẾT THÚC CHUYẾN',
		    afterText: '<input type="number" min = 0 max="999999" id="num_km_trip_end" placeholder="Số KM công tơ" />',
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
//						        			FWPlugin.alert('KẾT THÚC CHUYẾN THÀNH CÔNG');
						        			var trips = _.state.trips;
						    				for(var i = 0; i < trips.length; i++){
						    					if(Number(trips[i].id) == item.id){
						    						trips[i].status = 12;
						    						for(var j = 0; j < trips[i].location.length; j++){
						    							if(trips[i].location[j].status != 3){
						    								trips[i].location[j].status = 4;
						    							}
						    						}
						    						_.setState({
						    							trips: trips
						    						});
						    					}
						    				}
						    				
						        		} else {
						        			FWPlugin.alert('SỐ KM KHÔNG HỢP LỆ');
						        		}
						        });
				    		});
		        	 } else {
		        		 $('#num_km_trip_end').css({'border': '1px solid red'});
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
		return (
		    	<div style={{'height': '100%'}}>
			    	<div className="statusbar-overlay"></div>
				    <div className="panel-overlay"></div>
				    <div className="panel panel-left panel-reveal">
					    <div className="content-block">
					      <p className="icon-user">
					      	<img src="/styles/images/user.png"/>
					      </p>
					      {/*<p className="experence-star">
						  	<select id="star-rating">
				       		  <option value="1">1</option>
				       		  <option value="2">2</option>
				       		  <option value="3">3</option>
				       		  <option value="4">4</option>
				       		  <option value="5">5</option>
				       		</select> 
			      		  </p>*/}
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
									<div className="left">
										 <Link to={'/home'} data-panel="left" 
											  onClick={this.openSide.bind(this, event)} 
										  	  className="open-pannel open-left-panel link icon-only" replace>  
										  	 <i className="ios-icons">person</i>
										  </Link>
									</div>
									<div className="center ">THÔNG TIN GIAO HÀNG</div>
									<div className="right">
									   <Link to={'/home'}
										  onClick={this.openFilter.bind(this, event)} 
									  	  className="link icon-only" replace>  
									  	 <i className="ios-icons">more_vertical</i>
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
					       				trip_num={this.state.trip_num} /> 
					       		<Picker trip_id={this.state.tripId} 
					       				location_id = {this.state.locationId}
					       				trips = {this.state.trips}
					       				updatePointState = {this.updatePointState.bind(this)} />
					       		<Filter getTrips = {this.getTrips.bind(this)} />
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
		   _.handleSendInvoice();
//		   FWPlugin.modal({
//			    title:  'TMS Message',
//			    text: 'NHẬP SỐ KHAY GIAO/NHẬN',
//			    afterText: '<input type="number" min = 0 id="num_package" placeholder="Nhập số khay giao/nhận" />',
//			    buttons: [
//			      {
//			        text: '<i class="ios-icons">close</i> ĐÓNG',
//			        onClick: function() {
//			        }
//			      },
//			      {
//			        text: '<i class="ios-icons">forward</i> GỬI',
//			        onClick: function() {
//			        	_.handleSendInvoice();
//			        }
//			      }
//			    ]
//		   });
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
	        	 // update trip
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
	        	 _.props.updateTrip();
	   			FWPlugin.closeModal('.popup-confirm');
//			   var option =  '<select id="user-rating">'
//							+  ' <option value="1">1</option>'
//							+  ' <option value="2">2</option>'
//							+  ' <option value="3">3</option>'
//							+  ' <option value="4">4</option>'
//							+  ' <option value="5">5</option>'
//							+ '</select>'
//			   FWPlugin.modal({
//				    title:  'TMS Message',
//				    text: 'ĐÁNH GIÁ DỊCH VỤ GIAO/NHẬN' + option,
//					afterText: '<input type="password" name="user-rating" id="user-rating" placeholder="NHẬP MÃ KHÁCH HÀNG" />',
//				    buttons: [
//				      {
//				        text: '<i class="ios-icons">close</i> ĐÓNG',
//				        onClick: function() {
//				        	 _.setState({isChange: false});
//				        	 // update trip
//				        	 _.props.updateTrip();
//				        }
//				      },
//				      {
//				        text: '<i class="ios-icons">forward</i> GỬI',
//				        onClick: function() {
//				        	var customerCode = $('#user-rating').val();
//				        	if(customerCode == ""){
//				        		return false;
//				        	}
//				        	 _.setState({isChange: false});
//				        	 // update trip
//				        	 _.props.updateTrip();
//				        	 // send rating
//				        	 Common.request({url:'/send/rating', data: {
//				        		 				tripId: _.props.trip_id, 
//				  			   					tripDetailId: _.props.location_id, rating: _.state.rating, customer_code: customerCode }, type: "POST"}, function(res){
//				        		 if(res.status){
//				        			 FWPlugin.modal({
//						 				    title:  'TMS Message',
//						 				    text: 'GỬI ĐÁNH GIÁ THÀNH CÔNG',
//						 				    buttons: [
//						 				      {
//						 				        text: '<i class="ios-icons">close</i> ĐÓNG',
//						 				        onClick: function(){
//						 				        	_.setState({
//										        		isChange: false, 
//										        		images:[],
//														cards:[{
//															id:'-1',
//															name: 'Chưa có hóa đơn được chọn',
//															image: '',
//															time: Common.getDateTime()
//														 }]
//										        	});
//										        	FWPlugin.closeModal('.popup-confirm');
//						 				        }
//						 				      }]
//						        		 });
//				        		 }
//				        	 });
//				        }
//				      }]
//			   });
//			   $$('.modal').on('modal:opened', function(){
//				 $('#user-rating').barrating({
//					theme: 'fontawesome-stars',
//					initialRating: 5,
//					showVlaues: true,
//					readonly: false,
//					onSelect:function(value, text, event){
//						var rating = value;
//						_.setState({rating: rating});
//					}
//				  });
//		   
//				});
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
			listTray: []
		}
	}
    componentWillMount(){
    }
    componentDidMount(){
    	var _=this;
    	$('.popup-tray').on('popup:opened', function () {
    		Common.request({type:"GET", url: '/point/tray', data:{id: _.props.location_id}}, (res)=>{
    			if(res.status){
    				_.setState({listTray: res.data});
    			}
    		});
    	});
    }
    send(){
    	var _=this;
    	// send data to server  
    	var length = _.state.listTray.length;
    	let arrReceive = [];
    	let arrReturn = [];
    	let arrId = [];
    	for(let i = 0; i < length; i++){
    		let receive = $('#num_receive_' + _.state.listTray[i].id).val() + "";
    		let delivery = $('#num_return_' + _.state.listTray[i].id).val() + "";
    		if(receive.length > 0 || delivery.length > 0){
    			receive = receive.length == 0?"0": receive;
    			delivery = delivery.length == 0?"0": delivery;
    			let sub = receive.concat("#", delivery);
    			arrReceive.push(receive);
    			arrReturn.push(delivery);
    			arrId.push(_.state.listTray[i].id);
    		}
    	}
    	Common.request({type:"POST", url: '/point/tray', data:{id: _.props.location_id, listReceive: arrReceive.toString(), listReturn:arrReturn.toString(), listId: arrId.toString()}}, (res)=>{
			if(res.status){
				_.props.updatePointState();
		    	FWPlugin.closeModal('.popup-tray');
			}
		});
    	
    }
    erase(){
    	$('.list-tray input').val('');
    }
    inputTray(item){
		return(
				<li key={'tray__' + item.id} className="item-content">
	             <div className="item-inner">
		           <div className="item-subtitle">
			           <div className="item-input-number">
			             <input type="number" min="0" max="1000" id={"num_receive_" + item.id} placeholder="SỐ LƯỢNG GIAO" />
			           </div>
			           <div className="item-input-number">
			            <input type="number" min="0" max="1000" id={"num_return_" + item.id} placeholder="SỐ LƯỢNG TRẢ VỀ" />
			           </div>
		           </div>
	             </div>
	             <div className="item-after">
		              {item.name}
	             </div>
	           </li>
		);
	}
    render() {
      return (
    		  <div className="popup popup-tray page toolbar-fixed">
			     <div className="page-content">
				     <div className="list-block media-list list-tray">
		  	    		<ul style={{background:'transparent'}}>
			       	    		{this.state.listTray.map(this.inputTray, this)}
		  	    		</ul>
		  	    	 </div>
			     </div>
			     <div className="toolbar tabbar tabbar-labels">
			        <div className="toolbar-inner">
			          	<Link to="/home" className="tab-link" replace onClick={this.erase.bind(this)}><i className="fa fa-eraser" aria-hidden="true"></i>
		          			<span className="tabbar-label">NHẬP LẠI TẤT CẢ</span>
		          		</Link>
			          	<Link to="/home" className="tab-link" replace onClick={this.send.bind(this)}><i className="ios-icons">forward</i>
	          				<span className="tabbar-label">GỬI THÔNG TIN</span>
	          			</Link>
			        </div>
			      </div> 
			  </div>
      );
   }
}
export default Home;