/**
 * 
 * @author DangTM R&D Department
 * @date Jun 4, 2017
 * @addr ELCOM-HCM
 * 
 */
import '../assets/stylesheets/css/app-aba-activity.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FWPlugin from '.././common/app.plugin';
import {Link} from 'react-router-dom';
import { browserHistory } from 'react-router';
import Tabbar from './Tabbar';
import Cookie from "react-cookie";
import Common from ".././common/app.common";
import Widget from '.././common/app.widget';
class Activity extends Component {
	constructor(props){
		super(props);
		this.state = {
			images:[],
			cards:[{
				id_trip: '-1',
				name_trip: 'KHÔNG CÓ HOẠT ĐỘNG',
				num_trip: '000',
				id:'-1',
				name: 'CHƯA CÓ CHUYẾN',
				image: '',
				time: Common.getDateTime()
			 }]
		}
	}
	componentWillMount(){
		this.getActivity();
	}
	componentDidMount(){
		
	}
	back(){
		history.back();
	}
	getActivity(){
		var _ = this;
		var username = Common.user.username || Cookie.load('user').username;
		Common.request({
			data: {username: Common.user.username},
			type: 'GET',
			url: '/activity'
		}, (res) =>{
			var length = res.length;
			if(length > 0){
				_.setState({cards: res});
			} 
		});
	}
	handleFile(event){
	   var _= this;
		 //Check File API support
	    if (window.File && window.FileList && window.FileReader) {
	        var files = event.target.files; //FileList object
	        var cards = this.state.cards;
	        var images = [];
	        var tripId = '';
	        var tripDetailId = '';
	        var code = $(ReactDOM.findDOMNode(this.refs["file-edit-activity"])).attr('data-code');
	        var detailId = $(ReactDOM.findDOMNode(this.refs["file-edit-activity"])).attr('data-id');
	        for (var i = 0; i < files.length; i++) {
	            var file = files[i];
	            //Only pics
	            if (!file.type.match('image')) continue;
	            var picReader = new FileReader();
	            picReader.addEventListener("load", function (event) {
	            	var picFile = event.target;
	            	var ext = picFile.result.split(';')[0].split('/')[1];
            		$.each(cards, function(index) {
            		    if (this.code == code) {
            		    	tripId = this.id_trip;
            		    	tripDetailId = this.id;
		                	this.image = picFile.result;
		                	images.push({name: this.num_trip.replace('/', "") + '_' + Common.random() + '_' + Common.getTime() + '.'+ext, base64:this.image});
            		        _.setState({cards: cards});
            		    } else if(cards.id == detailId){
            		    	images.push({name: this.name, base64:''});
            		    }
            		});
            		console.log(images);
            		// send update
            		Common.request({url:'/activity/edit', type: 'POST', data:{
					   tripId: tripId, 
					   tripDetailId: tripDetailId,
					   images: JSON.stringify(images),
				   }, function(res){
					   console.logg('Edit activity');
				   }});
	            });
	            //Read the image
	            picReader.readAsDataURL(file);
	        }
	    } else {
	        console.log("Your browser does not support File API");
	    }
   }
   editBillActivity(item){
	   var _=this;
	   $(ReactDOM.findDOMNode(this.refs["file-edit-activity"])).attr('data-code', item.code);
	   $(ReactDOM.findDOMNode(this.refs["file-edit-activity"])).attr('data-id', item.id);
	   $(ReactDOM.findDOMNode(this.refs["file-edit-activity"])).trigger('click');
	   // Handle native android
//	   FWPlugin.showIndicator();
	   Widget.callAndroid({cmd:'get', key:'IMAGE', value:'', action: 'TSM.getData'});
	  var time = setInterval(function(){
		  	 if(time > 5000){
		  		clearInterval(time);
		  		FWPlugin.hideIndicator();
		  		return;
		  	 }
			 if(TSM.TRANSPORTER != null){
				 if(TSM.TRANSPORTER == -1){
						clearInterval(time);
						TSM.TRANSPORTER = null;  
						return;
					}
				 clearInterval(time);
				Common.logs('BROWSER IMAGE ' + TSM.TRANSPORTER);
                var data = TSM.TRANSPORTER;
                var cards = _.state.cards;
                var images = [];
                var tripId = '';
    	        var tripDetailId = '';
                TSM.TRANSPORTER = null;
                var length = data.length;
                for(var i = 0; i < 1; i++){
                	var name = data[i].name;
        		 	var ext = name.split('.').pop();
        		 	$.each(cards, function(index, element) {
            		    if (this.code == item.code) {
            		    	tripId = this.id_trip;
            		    	tripDetailId = this.id;
		                	this.image = '/tmp/' + name;
		                	images.push({name: this.num_trip.replace('/', "") + '_' + Common.random() + '_' + Common.getTime() + '.'+ext, base64:this.image});
            		        _.setState({cards: cards});
            		    } else if(cards.id == item.id) {
            		    	images.push({name: this.image.split('/').pop(), base64: ''});
            		    }
            		});
            		console.log(images);
            		// send update
            		Common.request({url:'/activity/edit', type: 'POST', data:{
					   tripId: tripId, 
					   tripDetailId: tripDetailId,
					   images: JSON.stringify(images),
				   }, function(res){
					   console.logg('Edit activity');
				   }});
                }
//                FWPlugin.hideIndicator();
			 }
		 }, 500);
   }
   deleteBillActivity(item){
	   var _=this;
	   FWPlugin.modal({
		    title:  'ABA cooltrans',
		    text: 'Hóa đơn sẽ được xóa?',
		    buttons: [
		      {
		        text: '<i class="ios-icons">close</i> hủy',
		        onClick: function() {
		        }
		      },
		      {
		        text: '<i class="ios-icons">trash</i> xóa',
		        onClick: function() {
		           var $this = ReactDOM.findDOMNode(_.refs['delete_' + item.code]);
		     	   var cards = $.grep(_.state.cards, function(card){
		     		   return card["code"] != item.code; 
		     	   });
		     	   var images = [];
		     	   for(var i = 0; i < cards.length; i++){
		     		   if(cards[i].id == item.id){
		     			   images.push({name: cards[i].image.split('/').pop(), base64: ""});
		     		   }
		     	   }
		     	   if(images.length == 0){
		     		  FWPlugin.modal({
						    title:  'ABA cooltrans',
						    text: '<p class="color-red"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Bạn không thể xóa hết hóa đơn</p>',
						    buttons: [
							 {
							    text: '<i class="ios-icons">close</i> đóng',
							    onClick: function() {}
							  }
						    ]
					   });
		     		   return;
		     	   }
			       // send update
	           	   Common.request({url:'/activity/edit', type: 'POST', data:{
					   tripId: item.id_trip, 
					   tripDetailId: item.id,
					   images: JSON.stringify(images),
				   }, function(res){
					   console.logg('delete activity');
				   }});
		     	   _.setState({cards: cards});
		        }
		      },
		    ]
	   });
   }
	getItem(item){
		var img =  <div className="card-content">
				  	<img src={item.image} />
				   </div>
		var footer = <div className="card-footer no-border">
					    <Link to="/activity" replace className="link" 
					    	onClick={this.editBillActivity.bind(this, item)} ref={"edit_" + item.code}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
					    <Link to="/activity" replace className="link" ref={"delete_" + item.code}
					    	onClick={this.deleteBillActivity.bind(this, item)}><i className="ios-icons">trash</i></Link>
					  </div>
		return(
			<div key={item.code + '__' + item.id} className="card facebook-card">
			  <div className="card-header no-border">
			    <div className="facebook-avatar"><i className="ios-icons">document_text</i></div>
			    <div className="facebook-name">{'[' + item.num_trip + '] ' + item.name}</div>
			    <div className="facebook-date">{item.time}</div>
			  </div>
			   {item.id_trip == "-1" ? "": img}
			   {item.id_trip == "-1" ? "": footer}
			</div>
		);
	}
	render(){
		return(
			<div style={{'height': '100%'}}>
	    		<div className="statusbar-overlay"></div>
	    		<div className="panel-overlay"></div>
	    		<div className="views tabs toolbar-through">
			       <div className="view tab active">
					    <div className="navbar">
							<div className="navbar-inner">
								<div className="left">
				    	          	{/*<Link to="/activity" replace className="back link close-popup" onClick={this.back.bind(this)}>
				    	          	 	<i className="ios-icons" style={{"fontSize": '25px', "marginRight": '5px'}}>chevron_left</i>quay lại
				    	          	 </Link>*/} 
			    	            </div>
								<div className="center sliding">HOẠT ĐỘNG GẦN ĐÂY</div>
								<div className="right"></div>
							</div>
						</div>
				       <div className="pages navbar-fixed">
				       		<div data-page="activity" className="page activity">
					       		<div className="page-content">
					       			<input ref="file-edit-activity" data-id="" accept="image/*" type="file" onChange={this.handleFile.bind(this)} className="hidden"/>
					       			<div>
						       			{this.state.cards.map(this.getItem, this)}
					       			</div>
						       		
					       		</div>
				       		</div>
				       </div>
			       </div>
				   <Tabbar index="2" />
				</div>
		    </div>
		);
	}
}
export default Activity;