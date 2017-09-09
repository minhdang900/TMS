import '../assets/stylesheets/base.scss';
import '../assets/stylesheets/css/app-tablet-esmile.css';
import React, { Component } from 'react';
import cookie from "react-cookie";
import ReactDOM from 'react-dom';
import app from '.././common/app.plugin';
import Setting from '.././components/Setting';
import XMLParser from 'react-xml-parser';
import eCommon from '.././common/app.common';
/**
 * Type of question. 
 * 1: normal; 
 * 2. Input information with dialog; 
 * 3. Have 2 option YES or NO; 
 * 4. Other option
 */
class AppTablet extends Component{
	constructor(props) {
		super(props);
		this.state = {
			rid: '',
			host: '',
			host_content: '',
			api_get_content: '/eSurvey/ReceiveRatingCustomer?siteid=2&cmd=0002&lid=2',
			api_send_rating: '/eSurvey/ReceiveRatingCustomer?cmd=0003&siteid=2&lid=2&p0=[p0]&p1=[p1]',
			api_send_other: '/eSurvey/ReceiveRatingCustomer?cmd=0005&lid=2&p0=[p0]&siteid=2&text=[text]',
			logo: '/eResource/logo/logo.png',
			title: 'Share Your Opinion',
			button: ['Submit', 'Cancel'],
			btn_popup: ['Send', 'Close'],
			welcome: [
			          {id: 1, name: 'Dear Valued Guest'},
			          {id: 2, name: 'We appreciate you spending time filling'},
			          {id: 3, name: 'Please touch the icon to share your feeling'},
			          {id: 4, name: 'Thank you for your feedback'}
			],
			background: [],
			text_rating: [
		           {id: 1, langid: 1, type:1, name:'Quý khách đánh giá chung về kì nghỉ ở Vinpearl như thế nào ?'},
		           {id: 2, langid: 1, type:1, name:'Tốc độ thực hiện dịch vụ nhận/trả phòng'},
		           {id: 3, langid: 1, type:1, name:'Thái độ nhân viên đón tiếp quý khách'},
		           {id: 4, langid: 1, type:1, name:'Dịch vụ vận chuyển ngoài khu nghỉ dưỡng(xe đón sân bay, tàu cao tốc, cáp treo, tuk-tuk...)'},
		           {id: 5, langid: 1, type:1, name:'Dịch vụ vận chuyển bên trong khu nghỉ dưỡng(xe điện, buggry...)'}
	       ],
	       languages: [],
	       smile:[  
	                {id:1, type: 1, name: 'Excellent', url: 'http://103.254.12.200:8083//eResource/smile/excellent_2.png', next: 4},
			        {id:2, type: 1, name: 'Good', url:'http://103.254.12.200:8083//eResource/smile/good_2.png', next: 4},
			        {id:3, type: 1, name: 'Fair', url: 'http://103.254.12.200:8083//eResource/smile/normal_2.png', next: 4},
			        {id:4, type: 1, name: 'N/A', url: 'http://103.254.12.200:8083//eResource/smile/notuse_2.png', next: 4},
			        {id:5, type: 1, name: 'Poor', url:'http://103.254.12.200:8083//eResource/smile/poor_2.png', next: 4},
			        {id:6, type: 1, name: 'Other', url: 'http://103.254.12.200:8083//eResource/smile/other_2.png', next: -1}
			     ]
		}
	}
	componentWillMount() {
		// get setting from cookie the first time
		if(cookie.load("setting") == undefined){
			var date = new Date();
			date.setFullYear(date.getFullYear() + 5); // set expires 5 year
			cookie.save("setting", JSON.stringify({ip: '103.254.12.200', port: '8083', lid: 1}), {expires: date});
		}
		var setting = cookie.load("setting");
		var host = 'http://' + setting.ip + ":" + setting.port;
		this.setState({
			host: host,
			host_content: 'http://' + setting.ip + ":3119/content/esmile/",
			api_get_content: host + '/eSurvey/ReceiveRatingCustomer?siteid=2&cmd=0002&lid=' + setting.lid,
			api_send_rating: host + '/eSurvey/ReceiveRatingCustomer?cmd=0003&siteid=2&lid='+ setting.lid+'&p0=[p0]&p1=[p1]',
			api_send_other: host + '/eSurvey/ReceiveRatingCustomer?cmd=0005&lid='+setting.lid+'&p0=[p0]&siteid=2&text=[text]',
			logo: host + '/eResource/logo/logo.png',
			backgound: [{id: 1 ,url: 'http://' + setting.ip + ":3119/content/esmile/" + '1492335992763.png'}],
			smile:[
			        {id:1, type: 1, name: 'Excellent', url: host + '/eResource/smile/excellent.png', next: 4},
			        {id:2, type: 1, name: 'Good', url: host + '/eResource/smile/good.png', next: 4},
			        {id:3, type: 1, name: 'Fair', url: host + '/eResource/smile/normal.png', next: 4},
			        {id:4, type: 1, name: 'N/A', url: host + '/eResource/smile/notuse.png', next: 4},
			        {id:5, type: 1, name: 'Poor', url: host + '/eResource/smile/poor.png', next: 4},
			        {id:6, type: 1, name: 'Other', url: host + '/eResource/smile/other.png', next: -1}
			],
			smile_other:[
			        {id:1, type: 2, name: 'Completely agree', url: host + '/eResource/smile/excellent_2.png', next: 4},
			        {id:2, type: 2, name: 'Agree', url: host + '/eResource/smile/good_2.png', next: 4},
			        {id:3, type: 2, name: 'Disagree', url: host + '/eResource/smile/normal_2.png', next: 4},
			        {id:4, type: 2, name: 'Complete disagree', url: host + '/eResource/smile/notuse_2.png', next: 4}
			],
			smile_option:[
			        {id:1, type: 3, name: 'Yes', url: host + '/eResource/smile/yes.png', next: 0},
			        {id:2, type: 3, name: 'No', url: host + '/eResource/smile/no.png', next: 0},
			],
			languages: [
		           {id:1, url: host + '/eResource/language/vn.png'},
		           {id:2, url: host + '/eResource/language/english.png'}
		    ]
		});
	}
	
	initData(langid){
		var _=this;
		if(Number(langid) == 1){ // Vietnamese
			this.setState({
				title: 'Chia sẻ ý kiến của quý khách',
				btn_popup: ['Gửi', 'Đóng'],
				button: ['Gửi cảm nhận', 'Bỏ qua']
			});
		} else if(Number(langid) == 2){ // english
			this.setState({
				title: 'Share Your Opinion',
				btn_popup: ['Send', 'Close'],
				button: ['Submit', 'Cancel']
			});
		}  else if(Number(langid) == 3){ // janpanese
			this.setState({
				title: 'あなたの意見を共有する',
				btn_popup: ['送信', '閉じる'],
				button: ['提出する', 'キャンセル']
			});
		}  else if(Number(langid) == 4){ // Korean
			this.setState({
				title: '의견 공유',
				btn_popup: ['보내다', '닫기'],
				button: ['제출', '취소']
			});
		}  else if(Number(langid) == 5){ // Chinese
			this.setState({
				title: '分享您的意見',
				btn_popup: ['發送', '關'],
				button: ['提交', '取消']
			});
		}  else if(Number(langid) == 6){ // Russian
			this.setState({
				title: 'Поделитесь своим мнением',
				btn_popup: ['послать', 'Закрыть'],
				button: ['Отправить', 'Отмена']
			});
		}
		// get content
		$.get(this.state.api_get_content + '&langid=' + langid, function(response){
			var xml = $.parseXML(response);
			//var xml = new XMLParser().parseFromString(response); 
			// get logo
			var xmlNodes = xml.getElementsByTagName('logo');
			var logo = $(xmlNodes)[0].textContent;
			// get welcome
			var node = $(xml).find('welcome').find('item');
			var length = node.length;
			var welcome = [];
			for(var i = 0; i < length; i++){
				var obj = {
					id: node.find('id')[i].textContent, 
					langid: langid, 
					name: node.find('name')[i].textContent
						
				}
				welcome.push(obj);
			}
			_.setState({
				logo: logo,
				welcome: welcome
			});
			// get rating
			var node = $(xml).find('rating').find('item');
			var length = node.length;
			var rating = [];
			for(var i = 0; i < length; i++){
				var content = node.find('name')[i].textContent.split(':');
				var obj = {
						id: node.find('id')[i].textContent, 
						type: node.find('type')[i].textContent, 
						langid: langid, 
						name: content[1],
						nameSubject: content[0]
				}
				rating.push(obj);
			}
			_.setState({
				logo: logo,
				text_rating: rating
			});
			
			// get language
			var node = $(xml).find('language').find('item');
			var length = node.length;
			var languages = [];
			for(var i = 0; i < length; i++){
				var obj = {
						id: node.find('id')[i].textContent, 
						url: _.state.host +  node.find('avatar')[i].textContent
				}
				languages.push(obj);
			}
			_.setState({
				languages: languages
			});
			
			// get smile
			var node = $(xml).find('smile').find('item');
			var length = node.length;
			var smile = [];
			var smile_2 = [];
			var smile_3 = [];
			for(var i = 0; i < length; i++){
				var next = i;
				if(next == length -1){
					next = -1;
				}
				var type = node.find('type')[i].textContent
				var obj = {
						langid: langid,
						type: type, 
						name: node.find('name')[i].textContent, 
						url: _.state.host + node.find('avatar')[i].textContent, 
						id: node.find('id')[i].textContent,
						next: next
						
				}
				if(type == "1"){
					smile.push(obj);
				} else if(type == "2"){
					smile_2.push(obj);
				} else if(type == "3"){
					smile_3.push(obj);
				}
			}
			_.setState({
				smile: smile,
				smile_other: smile_2,
				smile_option: smile_3
			});
			// get background
			var node = $(xml).find('background').find('item');
			var length = node.length;
			var bg = [];
			for(var i = 0; i < length; i++){
				var obj = {
					id: node.find('id')[i].textContent,
					url: _.state.host_content + node.find('value')[i].textContent
				}
				bg.push(obj);
			}
			
			_.setState({
				background: bg
			});
			
			
		});
	}
	componentDidMount(){
		var langid = this.props.langid;
		this.initData(langid);
	}
	changeLanguage(langid){
		this.initData(langid);
		var today = new Date();
		today.setFullYear(today.getFullYear() +  5);
		cookie.save("langid", langid, {
			 expires: today
		});
	}
	sendOther(rid, opinion){
		var url = this.state.api_send_other.replace('[p0]', rid).replace('[text]', opinion);
		$.get(url, function(response){
			console.log('>> Send rating other status: ' + response);
		});
	}
	sendRating(prid, rid){
		var url = this.state.api_send_rating.replace('[p0]', prid).replace('[p1]', rid);
		$.get(url, function(response){
			console.log('>> Send rating status: ' + response);
		});
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
					      <Page_1
				      	  		    appSmileSelect={this.props.appSmileSelect}
				      	  		    sendOther={this.sendOther.bind(this)} 
				      	  			sendRating={this.sendRating.bind(this)} 
				      	  			title={this.state.title} 
				      	  			button={this.state.btn_popup} 
				      	  			text={this.state.welcome} 
				      	  			ip={this.state.host} 
				      	  			logo={this.state.logo} 
				      	  			smile={this.state.smile}
				      	  			smile_other={this.state.smile_other}
				      	  			smile_option={this.state.smile_option}
				      	  			languages = {this.state.languages}
				      	  			changeLanguage={this.changeLanguage.bind(this)}
				      	  			text_rating={this.state.text_rating}/>  
				      	  <Page_4 text={this.state.welcome[3].name} logo={this.state.logo} />
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
	       text_rating: [],
	       pages:[]
		}
	}
   componentWillReceiveProps(){
   }
   componentDidMount(){
   }
   itemClick(item, event){
	   var _= this;
	   var $this = ReactDOM.findDOMNode(this.refs["item__" + item.id]);
	   eCommon.rippleEffect($this, event);
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
			           var rid = $(eCommon.ratingContext.slides[eCommon.ratingContext.realIndex]).attr('data-id');
			           if($('#opinion_text').val() != ""){
			        	   _.props.sendOther(rid, $('#opinion_text').val());
			        	   _.props.appSmileSelect(item);
			           }
			        }
			      }
			    ]
			  })
	   } else {
		   var rid = $(eCommon.ratingContext.slides[eCommon.ratingContext.realIndex]).attr('data-id');
		   this.props.sendRating(item.id, rid);
		   this.props.appSmileSelect(item);
	   }
   }
   changeLanguage(item, event){
	   var $this = ReactDOM.findDOMNode(this.refs["lang__" + item.id]);
	   eCommon.rippleEffect($this, event);
	   this.props.changeLanguage(item.id);
   }
   render() {
      return (
    		<div data-page="esmile_page_1" className="page" >
	          <div className="page-content">
	             <div className="container-items">
	             	 <Setting />
		             <div className="row text-welcome">
			             <div className="content-block">
			             	<h3>{this.props.text[1].name}</h3>
			             	<h3>{this.props.text[2].name}</h3>
			             </div>
		             </div>
		             <div className="row">
					  <div className="col-20 logo">
					  	 <img src={this.props.logo}/>
					  </div>
					  <div className="col-60">
					  	<h2>{this.props.text[0].name}</h2>
					  </div>
					  <div className="col-20 icon-flag">
					    <div className="row">
						    {this.props.languages.map(function(item){
						    	return (
						    		<div key={item.id + '__'} className="col-30">
						    			<a href="#"  className="ripplelink" ref={"lang__" + item.id} onClick={this.changeLanguage.bind(this, item)} >
							    			<img src={item.url} />
						    			</a>
								    </div>
						    	);
						    }, this)}
					    </div>
					  </div>
					</div>
		             <div className="row row_item">
		             	{this.props.smile.map(function(item, index){
		             		return (
		             			<div key={item.id + '_' + item.type} className="col-15">
		             				<a href="#" ref={"item__" + item.id} className="ripplelink item__smile shakeit" onClick={this.itemClick.bind(this, item)}>
		             					<img className="esmile-item" src= {item.url} />
		             				</a>
		             				<a href="#" className="button button-round">{item.name}</a>
		        	            </div>
		             		)
		             	}, this)}
		             </div>
		             <div className="row row_item_other hidden">
		             	{this.props.smile_other.map(function(item, index){
		             		return (
		             			<div key={item.id + '___' + item.type} className="col-25">
		             				<a href="#" ref={"item__" + item.id} className="ripplelink item__smile shakeit" onClick={this.itemClick.bind(this, item)}>
		             					<img className="esmile-item" src= {item.url} />
		             				</a>
		             				<a href="#" className="button button-round">{item.name}</a>
		        	            </div>
		             		)
		             	}, this)}
		             </div>
		             <div className="row row_item_option hidden">
		             	{this.props.smile_option.map(function(item, index){
		             		return (
		             			<div key={item.id + '___' + item.type} className="col-50">
		             				<a href="#" ref={"item__" + item.id} className="ripplelink item__smile shakeit" onClick={this.itemClick.bind(this, item)}>
		             					<img className="esmile-item" src= {item.url} />
		             				</a>
		             				<a href="#" className="button button-round">{item.name}</a>
		        	            </div>
		             		)
		             	}, this)}
		             </div>
		             <Slide_Small logo={this.props.logo} languages={this.state.languages} text={this.props.text_rating}/>
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
		var textRating = function(item){
			return(
			  <div key={item.id +  "_" + item.langid} data-type={item.type} data-id={item.id} className="swiper-slide">
			  	 <span>{item.nameSubject}</span>
	          	 <h3>{item.name}</h3>
	          </div>
			);
		}
		return (
				<div className="">
			  	 <div className="promotion-slide">
				  	 <div className="button-direct">
					  	 <a className="prevButton rotate ripplelink" href="#"><i className="ios-icons">play_fill</i></a>
					  	 <a className="nextButton ripplelink" href="#"><i className="ios-icons">play_fill</i></a>
				  	 </div>
				      <div className="slide-small swiper-container">
				        <div className="swiper-wrapper">
				        	{this.props.text.map(textRating)}
				        </div>
				        <div className="small-swiper-pagination swiper-pagination"></div>
				      </div>
		      	  </div>
			  </div>	
		);
	}
}

export default AppTablet;