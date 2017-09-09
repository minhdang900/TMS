import '../assets/stylesheets/base.scss';
import '../assets/stylesheets/css/app-tablet-esmile.css';
import React, { Component } from 'react';
import cookie from "react-cookie";
import ReactDOM from 'react-dom';
import Slider from 'react-viewport-slider';
import app from '.././common/app.plugin';

class AppTablet extends Component{
	constructor(props) {
		super(props);
		var ip = 'http://103.254.12.200:8280';
		this.state = {
			rid: '',
			ip: ip,
			api_send_rating: ip + '/eSurvey/ReceiveRatingCustomer?cmd=0003&siteid=2&lid=2&p0=[p0]&p1=[p1]',
			api_send_other: ip + '/eSurvey/ReceiveRatingCustomer?cmd=0005&lid=2&p0=[p0]&siteid=2&text=[text]',
			api_get_promotion: ip + '',
			logo: ip + '/eResource/logo/logo.png',
			title: 'Share Your Opinion',
			button: ['Submit', 'Cancel'],
			btn_popup: ['Send', 'Close'],
			text_p1: [
			          'Welcome to vinpearl',
			          'Please touch the icon to share your feeling'
			       ],
			text_p2: 'Kindly share with us the reasons for your selection',
			text_p3: 'Kindly share with us the reasons for your selection',
			text_p4: 'Thank you for your feedback',
			background: [
			              {id:1, url: ip + '/eResource/bg/perimer-village-01.png'}, 
			              {id:2, url: ip + '/eResource/bg/perimer-village-02.png'}, 
			              {id:3, url: ip + '/eResource/bg/perimer-village-03.png'}
			            ],
	        pages1:[],
			pages2:[],
	        pages3:[]
	       
		}
	}
	componentWillMount() {
	    
	}
	
	initData(langid){
		var ip = this.state.ip;
		if(Number(langid) == 1){ // Vietnamese
			this.setState({
				title: 'Chia Sẻ Ý Kiến',
				btn_popup: ['Gửi', 'Đóng'],
				button: ['Gửi cảm nhận', 'Bỏ qua'],
				text_p1: [
				          'Xin chào quý khách',
				          'Vui lòng chạm vào biểu tượng để thể hiện sự cảm nhận của quý khách'
				          
				       ],
				text_p2: 'Vui lòng chia sẻ những điều quý khách chưa hài lòng',
				text_p3: 'Vui lòng chia sẻ những điều quý khách hài lòng',
				text_p4: 'Xin trân trọng cảm ơn ý kiến đánh giá của quý khách',
			});
		} else {
			this.setState({
				title: 'Share Your Opinion',
				btn_popup: ['Send', 'Close'],
				button: ['Submit', 'Cancel'],
				text_p1: [
						'Welcome to vinpearl',
						'Please touch the icon to share your feeling'
				       ],
				text_p2: 'Kindly share with us the reasons for your selection',
				text_p3: 'Kindly share with us the reasons for your selection',
				text_p4: 'Thank you for your feedback',
			});
		}
		this.setState({
			pages1:[
			        {id:1, langid: langid, url: ip + '/eResource/items-p1/excellent_' + langid + '.png', next: 3},
			        {id:2, langid: langid, url: ip + '/eResource/items-p1/good_' + langid + '.png', next: 3},
			        {id:3, langid: langid, url: ip + '/eResource/items-p1/average_' + langid + '.png', next: 2},
			        {id:4, langid: langid, url: ip + '/eResource/items-p1/poor_' + langid + '.png', next: 2},
			        {id:5, langid: langid, url: ip + '/eResource/items-p1/verypoor_' + langid + '.png', next: 2},
			        {id:6, langid: langid, url: ip + '/eResource/items-p1/other_' + langid + '.png', next: -1}
			],
			pages2:[
	 				{id:1, langid: langid, url: this.state.ip + '/eResource/items-p2/Bad-services_' + langid + '.png', next: 4},
	 				{id:2, langid: langid, url: this.state.ip + '/eResource/items-p2/Dirty-messy-bedroom_' + langid + '.png', next: 4},
	 				{id:3, langid: langid, url: this.state.ip + '/eResource/items-p2/Noisy_' + langid + '.png', next: 4},
	 				{id:4, langid: langid, url: this.state.ip + '/eResource/items-p2/Too-hot-cold-room_' + langid + '.png', next: 4},
	 				{id:5, langid: langid, url: this.state.ip + '/eResource/items-p2/Uncomfortable-bed_' + langid + '.png', next: 4},
	 				{id:6, langid: langid, url: this.state.ip + '/eResource/items-p2/Weak-unstable-Wifi_' + langid + '.png', next: 4},
	 				{id:7, langid: langid, url: this.state.ip + '/eResource/items-p2/bad-lighting-inside-room_' + langid + '.png', next: 4},
	 				{id:8, langid: langid, url: this.state.ip + '/eResource/items-p2/not-enough-power-outlet_' + langid + '.png', next: 4}
	 		],
	        pages3:[
			        {id:9,  langid: langid, url: this.state.ip + '/eResource/items-p3/Clean-and-modern-toilet_' + langid + '.png', next: 4},
			        {id:10, langid: langid, url: this.state.ip + '/eResource/items-p3/Comfortable-bed_' + langid + '.png', next: 4},
			        {id:11, langid: langid, url: this.state.ip + '/eResource/items-p3/Fresh-air_' + langid + '.png', next: 4},
			        {id:12, langid: langid, url: this.state.ip + '/eResource/items-p3/Polite-and-friendly-room-service_' + langid + '.png', next: 4},
			        {id:13, langid: langid, url: this.state.ip + '/eResource/items-p3/Quiet-and-pleasant-environment_' + langid + '.png', next: 4},
			        {id:14, langid: langid, url: this.state.ip + '/eResource/items-p3/Well-equipped-and-luxurious-bedroom_' + langid + '.png', next: 4}
			]
		});
	}
	componentDidMount(){
		var langid = this.props.langid;
		this.initData(langid);
	}
	changeLanguage(langid){
		this.initData(langid);
		cookie.save("langid", langid);
	}
	sendOther(rid, opinion){
		var url = this.state.api_send_other.replace('[p0]', rid).replace('[text]', opinion);
		$.get(url, function(response){
			console.log(response);
		});
	}
	sendRating(){
		
	}
	setRID(ridReceived){
		this.setState({rid:ridReceived});
	}
	render(){
		return (
			<div style={{'height': '100%'}}>
		    	<div className="statusbar-overlay"></div>
			    <div className="panel-overlay"></div>
			     <div className="views">
				    <div className="view view-main">
				      <div className="pages">
				      	  <Slide_Large  background={this.state.background} />
					      <Page_1 setRID={this.setRID.bind(this)} sendOther={this.sendOther.bind(this)} title={this.state.title} button={this.state.btn_popup} text={this.state.text_p1} ip={this.state.ip} logo={this.state.logo} pages={this.state.pages1} changeLanguage={this.changeLanguage.bind(this)}/>
				          <Page_2 rid={this.state.rid} sendRating={this.sendRating.bind(this)} text={this.state.text_p2} ip={this.state.ip} logo={this.state.logo} pages={this.state.pages2} button={this.state.button}/>
				          <Page_3 rid={this.state.rid} sendRating={this.sendRating.bind(this)} text={this.state.text_p3} ip={this.state.ip} logo={this.state.logo} pages={this.state.pages3} button={this.state.button}/>
				      	  <Page_4 text={this.state.text_p4} logo={this.state.logo} />
				      </div>
				    </div>
				</div>
	    	</div>
		);
	}
}


class Page_1 extends React.Component {
	constructor(props){
		super(props);
		this.state = {
	       languages: [],
           promotion: []
		}
	}
   componentWillReceiveProps(){
   }
   componentDidMount(){
	   var ip = this.props.ip;
	   this.setState({
			languages: [
		           {id:1, url: ip + '/eResource/language/vn.png'},
		           {id:2, url: ip + '/eResource/language/english.png'}
		    ],
		    promotion: [
		           {id:1,  url:'http://103.254.12.200:8280//eResource/bg/perimer-village-03.png'},
		           {id: 2, url: 'http://103.254.12.200:8280//eResource/bg/perimer-village-01.png'}
	       ]
		});
   }
   itemClick(item){
	   if(Number(item.next) == -1){
		   app.modal({
			    title:  this.props.title,
			    text: '',
			    afterText:  '<div class="item-input">'+
				                '<textarea id="opinion_text" rows="5" cols="50"></textarea>'+
				              '</div>',
			    buttons: [
			      {
			        text: this.props.button[1],
			      },
			      {
			        text: this.props.button[0],
			        onClick: function() {
			           if($('#opinion_text').val() != ""){
			        	   this.props.sendOther(item.id, $('#opinion_text').val());
			           }
			        }
			      }
			    ]
			  })
	   }
	   this.props.setRID(item.id);
   }
   changeLanguage(item){
	   this.props.changeLanguage(item.id);
   }
   render() {
      return (
    		<div data-page="esmile_page_1" className="page" >
	          <div className="page-content">
	             <div className="container-items">
		             <div className="row text-welcome">
			             <div className="content-block">
			             	<h3>{this.props.text[0]}</h3>
			             	<h3>{this.props.text[1]}</h3>
			             </div>
		             </div>
		             <div className="row">
					  <div className="col-20 icon-flag">
					    {this.state.languages.map(function(item){
					    	return (
					    		<span key={item.id}>
							     	<img src={item.url} onClick={this.changeLanguage.bind(this, item)}/>
							     </span>
					    	);
					    }, this)}
					  </div>
					  
					  <Slide_Small logo={this.props.logo} languages={this.state.languages} promotion={this.state.promotion}/>
					  
					  <div className="col-20 logo">
					  	 <img src={this.state.logo}/>
					  </div>
					</div>
		             <div className="row row_item">
		             	{this.props.pages.map(function(item, index){
		             		return (
		             			<div key={item.id + '_' + item.langid} className="col-15">
		             				<a href={'#esmile_page_' + item.next } onClick={this.itemClick.bind(this, item)}>
		             					<img className="esmile-item" src= {item.url} />
		             				</a>
		        	            </div>
		             		)
		             	}, this)}
		             </div>
	             </div>
	          </div>
	        </div>
      );
   }
}
class Page_2 extends React.Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
	}
    render() {
      return (
		  <div data-page="esmile_page_2" className="page cached">
            <div className="page-content">
			     <div className="container-items-p2">
				     <div className="row">
					  <div className="col-90">
					  	 <h3>{this.props.text}</h3>
					  </div>
					  <div className="col-10 logo">
					  	 <img src={this.props.logo}/>
					  </div>
					</div>
		            <div className="row row-item">
		            	{/*this.props.pages.map(function(item, index){
		            		return (
		            			<div key={item.id + '_' + item.langid} className="col-25">
		            				<a href="#" ref={"item_" + item.id} className="ripplelink" onClick={this.itemClick.bind(this, item)}>
		            					<img className="esmile-item" src={item.url} />
		            				</a>
		       	            </div>
		            		);
		            	}, this)*/}
		            	<ListItem className="col-25" rid={this.props.rid} pages={this.props.pages}/>
		            	<Button rid={this.props.rid} button={this.props.button}/>
		            </div>
			     </div>
            </div>
          </div>
      );
   }
}
class Page_3 extends React.Component {
   constructor(){
	   super();
   }
   componentDidMount(){
   }
   render() {
      return (
		  <div data-page="esmile_page_3" className="page cached">
            <div className="page-content">
	            <div className="container-items-p3">
		            <div className="row">
					  <div className="col-90">
					  	 <h3>{this.props.text}</h3>
					  </div>
					  <div className="col-10 logo">
					  	 <img src={this.props.logo}/>
					  </div>
					</div>
		            <div className="row row-item">
		            	{/*this.props.pages.map(function(item, index){
		            		return (
		            			<div key={item.id + '_' + item.langid} className="col-30">
		            				<a href={'#esmile_page_' + item.next }>
		            					<img className="esmile-item" src= {item.url} />
		            				</a>
		       	            </div>
		            		);
		            	}, this)*/}
		            	<ListItem rid={this.props.rid} className="col-30" pages={this.props.pages}/>
		            	<Button rid={this.props.rid} button={this.props.button}/>
		            </div>
		       </div>
            </div>
          </div>
      );
   }
}
class Page_4 extends React.Component {
   constructor(){
	   super();
   }
   render() {
      return (
		  <div data-page="esmile_page_4" className="page cached">
            <div className="page-content container-items-p4">
		        <div className="row">
		            <div className="content">
			            <img src= {this.props.logo}/>
			  	 		<h3>{this.props.text}</h3>
		            </div>
		  	 		
		  	 	</div>
            </div>
          </div>
      );
   }
}
class ListItem extends React.Component{
	constructor(){
		super();
		
	}
	componentDidMount(){
		
	}
	itemClick(item, e){
	   alert('RID=' + this.props.rid);
	   var id = item.id;
	   var $this = $(ReactDOM.findDOMNode(this.refs["item_" + id]));
	   if($this.find(".check_round").length === 0){
		   $this.prepend("<span class='check_round' data-id='"+id+"'><i class='ios-icons check_round_fill'>check_round_fill</i></span>");
	   } else {
		   $this.find('.check_round').remove();
	   }
	   if($this.find(".ink").length === 0){
		   $this.prepend("<span class='ink'></span>");
	    }
	         
	    var ink = $this.find(".ink");
	    ink.removeClass("animate");
	     
	    if(!ink.height() && !ink.width()){
	        var d = Math.max($this.outerWidth(), $this.outerHeight());
	        ink.css({height: d, width: d});
	    }
	     
	    var x = e.pageX - $this.offset().left - ink.width()/2;
	    var y = e.pageY - $this.offset().top - ink.height()/2;
	     
	    ink.css({top: y+'px', left: x+'px'}).addClass("animate");
	    
	    
    }
	render(){
		return(
			<div className="row">
				{this.props.pages.map(function(item, index){
	        		return (
	        			<div key={item.id + '_' + item.langid} className={this.props.className}>
	        				<a href="#" ref={"item_" + item.id} className="ripplelink" onClick={this.itemClick.bind(this, item)}>
	        					<img className="esmile-item" src={item.url} />
	        				</a>
	   	            </div>
	        		);
	        	}, this)}
			</div>
		);
	}
}

class Button extends React.Component {
	back(){
		   var $this = $(ReactDOM.findDOMNode(this.refs.btn_back));
		   $this.parent().parent().parent().find('span').remove();
	}
	send(){
		   var $this = $(ReactDOM.findDOMNode(this.refs.btn_send));
		   $this.parent().parent().parent().find('span').remove();
	}
	render(){
		return (
			<div className="row" style={{'width': '100%'}}>
				<div className="col-50">
		    		<a href="#esmile_page_1" className="button button-big button-round" ref="btn_back" onClick={this.back.bind(this)}>{this.props.button[1]}</a>
		    	</div>
		    	<div className="col-50">
		    		<a href="#esmile_page_4" className="button button-big button-round" ref="btn_send" onClick={this.send.bind(this)}>{this.props.button[0]}</a>
		    	</div>
			</div>
		);
	}
}

class Slide_Large extends React.Component {
	render(){
		var background = function(item){
			return(
			  <div key={item.id} className="swiper-slide">
	          	 <img src={item.url}/>
	          </div>
			);
		}
		return (
				<div className="background-slide">
			      <div className="slide-large swiper-container">
				      <div className="swiper-wrapper"> 
						  {this.props.background.map(background)}
				      </div>
			          <div className="large-swiper-pagination swiper-pagination hidden"></div>
			      </div>
	      	   </div>
		);
	}
}
class Slide_Small extends React.Component {
	render(){
		var promotion = function(item){
			return(
			  <div key={item.id} className="swiper-slide">
	          	 <img src={item.url}/>
	          </div>
			);
		}
		return (
				<div className="col-60">
			  	 <div className="promotion-slide">
				      <div className="slide-small swiper-container">
				        <div className="swiper-wrapper">
				        	{this.props.promotion.map(promotion)}
				        </div>
				        <div className="small-swiper-pagination swiper-pagination"></div>
				      </div>
		      	  </div>
			  </div>
				
		);
	}
}
export default AppTablet;