import '../assets/stylesheets/base.scss';
import '../assets/stylesheets/css/app-rating.css';
import React, { Component } from 'react';
import eAPI from '.././model/app.api';
import ReactDOM from 'react-dom';
import app from '.././common/app.plugin';
import eRating from '.././model/app.rating';
import eCommon from '.././common/app.common';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			logo: '/styles/images/vinpearl.png',
			location:[],
			sid: null,
			analytics:[],
			rating:[],
			sumRating: 0,
			detail: [],
			color : ['#1ebfae', '#30a5ff', '#ffb53e', '#c7c700', '#f9243f', '#669999']
		}
	}
	componentWillMount(){
		var _=this;
		// get sid id
		$.ajax({
			url: eAPI.getURLSid(),
			type: "GET",
			success: function(response){
				var xml = $.parseXML(response);
				eCommon.sid = $(xml).find('site').attr('siteid');
				_.setState({
					sid: eCommon.sid
				});
				// get location
				_.getLocation();
				
			},
			error: function(jqXHR, exception){
				eCommon.logs(eCommon.ajaxError(jqXHR, exception));
			}
		});
	}
	componentDidMount(){
		// initial date
		var date = eCommon.getLast30Days();
		var today = new Date();
//		$('#date-from').val(moment().subtract('days', 30).format('YYYY-MM-DD')); // get 30 day
		$('#date-from').val(moment().format('YYYY-MM-DD')); // get today
		$('#date-to').val(moment().format('YYYY-MM-DD')); // get today
//		$('#date-from').attr(
//				   "data-date", 
//				   moment().subtract('days', 30).format( $('#date-from').attr("data-date-format") ));
		$('#date-from').attr(
				   "data-date", 
				   moment().format( $('#date-from').attr("data-date-format") ));
		$('#date-to').attr(
				   "data-date", 
				   moment().format( $('#date-from').attr("data-date-format") ));
		setInterval(this.getRating.bind(this), 5000);
	}
	componentWillReceiveProps(newProps){
		eCommon.logs(newProps);
	}
	getRating(){
		var _=this;
		var location = [];
		$('.list-room input:checkbox').each(function () {
			if ($(this).is(':checked')) {
				location.push($(this).val());
			}
		 });
		var from = $('#date-from').attr('data-date');
		var to = $('#date-to').attr('data-date');
		var between = eCommon.getDateBetween(from, to);
		var employees = '-1';
		var json = {
				sid: eCommon.sid, 
				'datefrom': from, 
				'dateto': to, 
				'location': location, 
				'datebetween': between, 
				'employee': employees
		};
		var str = JSON.stringify(json);
    	$.get(eAPI.getRating(str), {data: str}, function(response){
    		var xml = $.parseXML(response);
    		var dataNode = $(xml).find('data');
    		var length = dataNode.length;
    		var rating = [];
    		var sumRating = 0;
    		// check change data
    		var isChange = false;
    		if(_.state.rating.length > 0){
    			for(var i = 0; i < length; i++){
    				var nodeRating = dataNode[i].childNodes[0].childNodes;
    				var pLength = nodeRating.length;
    				var sumRating = 0;
    				for(var j = 0; j < pLength; j++){
    					var pObject = {
    						id: nodeRating[j].childNodes[0].textContent,
    						name: nodeRating[j].childNodes[1].textContent,
    						value: Number(nodeRating[j].childNodes[3].textContent),
    						sum: Number(nodeRating[j].childNodes[4].textContent),
    					}
    					sumRating+= pObject.value;
    				}
    				if(sumRating != _.state.rating[i].value){
    					isChange = true;
    				}
    			}
    			if(!isChange){
    				return;
    			}
    		}
    		
    		for(var i = 0; i < length; i++){
    			var nodeRating = dataNode[i].childNodes[0].childNodes;
    			var pLength = nodeRating.length;
    			var obj = {
    				id: dataNode[i].attributes["id"].textContent,
    				name: dataNode[i].attributes["name"].textContent,
    				value:0,
    				item:[]
    			}
    			var sum = 0;
    			for(var j = 0; j < pLength; j++){
    				var pObject = {
    					id: nodeRating[j].childNodes[0].textContent,
    					name: nodeRating[j].childNodes[1].textContent,
    					value: Number(nodeRating[j].childNodes[3].textContent),
    					sum: Number(nodeRating[j].childNodes[4].textContent),
    				}
    				obj.item.push(pObject);
    				sum+= pObject.value;
    			}
    			obj.value = sum;
    			sumRating+= sum;
    			rating.push(obj);
    		}
    		if(sumRating == 0){
    			sumRating = 1;
    		}
    		_.setState({
    			rating: rating,
    			sumRating: sumRating
    		});
    	_.drawCircleChart('#', _.state.rating);
    	_.drawColumnChart('rating_container', _.state.rating);
    	});
    }
	drawCircleChart(element, data){
		var _=this;
		var length = data.length;
		for(var i = 0; i < length; i++){
			var percent = data[i].value*100/this.state.sumRating; 
			var classes = data[i].name.toLowerCase().replace(" ", '');
			$('.text__'+ i).text(data[i].name);
			$('.percent__'+ i).attr('data-percent', percent.toFixed());
			$('.percent__' + i + ' .percent').text(percent.toFixed() + '%');
			$(element + 'percent__' + i).easyPieChart({
				scaleColor : false,
				barColor : this.state.color[i]
			});
			$(element + 'percent__' + i).data('easyPieChart').update(percent.toFixed());
		}
		 
	}
	drawColumnChart(element, data){
		var _=this;
		var arr = [];
		var length = data.length;
		for(var i = 0; i < length; i++){
			var obj = {};
	        obj.name = data[i].name;
	        obj.color = _.state.color[i];
	        obj.y = data[i].value;
			arr.push(obj);
		}
		Highcharts.chart(element, {
		    chart: {
		        type: 'column',
		        backgroundColor:'transparent'
		    },
		    title: {
		        text: 'Realtime Rating Service',
		        style: {
		            color: 'rgba(255,255,255,0.8)'
		        }
		    },
		    subtitle: {
		       // text: 
		    },
		    xAxis: {
		        type: 'category',
		        labels: {
	                style: {
	                    color: 'rgba(255,255,255,0.8)'
	                }
	            }
		    },
		    yAxis: {
		        title: {
		            text: 'Total rating',
		            style: {
			            color: 'rgba(255,255,255,0.8)'
			        }
		        }

		    },
		    legend: {
		        enabled: false
		    },
		    plotOptions: {
		        series: {
		            borderWidth: 0,
		            dataLabels: {
		                enabled: true,
		                format: '{point.y:.1f}'
		            }
		        }
		    },

		    tooltip: {
		        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
		    },

		    series: [{
		        name: 'Rating',
		        colorByPoint: true,
		        data: arr
		    }]
		});
	}
	
	getLocation(){
		var _=this;
		$.ajax({
			url: eAPI.getLocation(),
			type: "GET",
			success: function(response){
				var xml = $.parseXML(response);
				var node = $(xml).find('location');
				var length = node.length;
				var location = [];
				for(var i = 0; i < length; i++){
					var obj = {
						id: node[i].attributes["lid"].textContent,
						name: node.find('name')[i].textContent
					}
					location.push(obj);
				}
				_.setState({
					location: location
				});
				_.getRating();
				
			},
			error: function(jqXHR, exception){
				eCommon.logs(eCommon.ajaxError(jqXHR, exception));
			}
		});
	}
  render() {
    return (
    	<div style={{'height': '100%'}}>
	    	<div className="statusbar-overlay"></div>
		    <div className="panel-overlay"></div>
		    <div className="panel panel-left panel-reveal">
		      <div className="content-block">
		        <p>Left panel content goes here</p>
		      </div>
		    </div>
		    <div className="panel panel-right panel-cover">
		      <div className="content-block">
		        <p>Right panel content goes here</p>
		      </div>
		    </div>
		    <div className="views tabs toolbar-through">
			      <Dashboard color={this.state.color} sum={this.state.sumRating} rating={this.state.rating} location={this.state.location} logo={this.state.logo}/>
			      <Rating color={this.state.color} sum={this.state.sumRating} rating={this.state.rating} logo={this.state.logo}/>
			      <Detail logo={this.state.logo}/>
			      <Notify logo={this.state.logo}/>
				  <Tabbar logo={this.state.logo}/>
			</div>
    	</div>
    )
  }
};

class Dashboard extends React.Component{
	constructor(props) {
		super(props);
		
	}
    componentWillMount(){
    	eCommon.logs('Rendering dashboard');
    }
    componentDidMount(){
    	eCommon.logs('Dashboard componentDidMount');
    }
    roomChange(){
    	
    }
    pickerClose(){
    	console.log('picker close');
    }
	render() {
		return(
			<div id="dashboard" className="view view-main tab active">
				<div className="navbar">
					<div data-page="dashboard" className="navbar-inner">
						<div className="left sliding">
							<img src={this.props.logo} />
						</div>
						<div className="center sliding">DASHBOARD</div>
						<div className="right">
							<a href="#" className="link icon-only open-picker"> <i
								className="ios-icons">more_vertical</i></a>
						</div>
					</div>
				</div>
				{/*<!-- Pages-->*/}
				<div className="pages navbar-through">
					<div className="page" data-page="dashboard">
						<div className="page-content pull-to-refresh-content"
							data-ptr-distance="30">
							<div className="pull-to-refresh-layer">
								<div className="preloader"></div>
								<div className="pull-to-refresh-arrow"></div>
							</div>
							<div className="content-block">
								<div className="row">
								    {this.props.rating.map(function(item, index){
								    	return(
								        		<div key={item.id + "__" + item.value} className="col-33">
								    				<div className={"easypiechart percent__" + index} id={"percent__" + index}
								    					data-percent={(item.value*100/this.props.sum).toFixed()}>
								    					<span className="percent">{(item.value*100/this.props.sum).toFixed() + '%'} </span> 
								    					<span className={"text__" + index}>{item.name}</span>
								    				</div>
								    			</div>
								        	);
								    }, this)}
									
								</div>
							</div>
							<div className="content-block">
								<div id="rating_container" key={this.props.sum} style={{'min-width': '310px'}, {'height': '400px'}, {'margin': '0 auto'}}></div>
							</div>
						</div>

						<div className="picker-modal picker-filter">
							<div className="toolbar">
								<div className="toolbar-inner">
									<div className="left"></div>
									<div className="right">
										<a href="#" className="close-picker" onClick={this.pickerClose.bind(this)}>Done</a>
									</div>
								</div>
							</div>
							<div className="picker-modal-inner">
								<form data-search-list=".list-block-search"
									data-search-in=".item-title" className="searchbar searchbar-init">
									<div className="searchbar-input">
										<input type="search" placeholder="Search" /><a href="#"
											className="searchbar-clear"></a>
									</div>
									<a href="#" className="searchbar-cancel">Cancel</a>
								</form>
								<div className="searchbar-overlay"></div>
								<div className="content-block searchbar-not-found">
									<div className="content-block-inner">Nothing found</div>
								</div>
								<div className="list-block list-block-search searchbar-found">
									<ul className="list-room">
										{this.props.location.map(function(item){
											return(
												<li key={item.id}>
												  <label className="label-checkbox item-content">
													     <input type="checkbox" name="room-checkbox" onChange={this.roomChange.bind(this, item)} value={item.id} checked="checked" />
													     <div className="item-media">
													       <i className="icon icon-form-checkbox"></i>
													     </div>
													     <div className="item-inner">
													       <div className="item-title">{item.name}</div>
													     </div>
												   </label>
												 </li>
											);
										}, this)}
									</ul>
								</div>
								<div className="row">
									<div className="col-50">
										<div className="list-block">
											<div className="item-content">
												<div className="item-media">
													<i className="ios-icons icon-form-calendar">today</i>
												</div>
												<div className="item-inner">
													<div className="item-input">
														<input type="date" data-date-format="DD-MM-YYYY"
															placeholder="Date From" id="date-from" />
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-50">
										<div className="list-block">
											<div className="item-content">
												<div className="item-media">
													<i className="ios-icons icon-form-calendar">today</i>
												</div>
												<div className="item-inner">
													<div className="item-input">
														<input type="date" data-date-format="DD-MM-YYYY"
															placeholder="Date To" id="date-to" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class Rating extends React.Component {
    constructor(props) {
    	super(props);
	}
    componentWillMount(){
    	
    }
    componentDidMount(){
    	var _=this;
    	setTimeout(function(){
			var length = _.props.rating.length;
			for(var i = 0; i < length; i++){
				var percent =  _.props.rating[i].value*100/_.props.sum; 
				var classes =  _.props.rating[i].name.toLowerCase().replace(" ", '');
				$('.text__'+ i).text( _.props.rating[i].name);
				$('.percent__'+ i).attr('data-percent', percent.toFixed());
				$('.percent__' + i + ' .percent').text(percent.toFixed() + '%');
				$('#rating__percent__' + i).easyPieChart({
					scaleColor : false,
					barColor : _.props.color[i]
				});
				$('#rating__percent__' + i).data('easyPieChart').update(percent.toFixed());
			}
	  }, 2000);
    }
  
   render() {
      return (
    		  <div id="rating" className="view tab">
    			<div className="navbar">
    				<div data-page="rating" className="navbar-inner">
    					<div className="left sliding">
    						<img src={this.props.logo} />
    					</div>
    					<div className="center sliding">Rating</div>
    					<div className="right">
    						<a href="#" className="link icon-only open-picker"> <i
    							className="ios-icons">more_vertical</i></a>
    					</div>
    				</div>
    			</div>
    			<div className="pages navbar-through">
    				<div data-page="rating" className="page">
    					<div className="page-content rating_container">
	    					{this.props.rating.map(function(item, index){
								return (
									<div key={this.props.sum + "__" + index} className="row">
				    			       	  <div className="col-30">
				    			       	  	  <div className={"easypiechart percent__" + index} id={"rating__percent__" + index} 
				    			       	  	  		data-percent={(item.value*100/this.props.sum).toFixed()}>
				    								<span className="percent">{(item.value*100/this.props.sum).toFixed() + ' %'}</span>
				    								<span className={"text__" + index}>{item.name}</span>
				    						  </div>
				    			       	  </div>
				    			       	  <div className="col-70">
				    			       	  <div className="list-block media-list">	
		    			       	  			 <ul>
						    			       	{this.props.rating[index].item.map(function(subItem, idex){
				    								return (
				    										<li key={subItem.value + "__" + idex} className="item-content">'
				    								          <div className="item-inner">'
				    								        	  <div className="item-title-row">'	
				    								              <div className="item-title">{subItem.name}</div>
				    								              <div className={"item-after percent__" + idex}>{subItem.value}</div>
				    								        	  </div>
				    								          </div>
				    								        </li>	
				    								);
				    							})}
						    			       	</ul>
						    			      </div>
				    			       	  </div>
				    			       </div>
								);
							}, this)}
    					</div>
    				</div>
    			</div>
    		</div>
      );
   }
}
class Detail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				data:[]
		}
	}
    componentWillMount(){
    }
    componentDidMount(){
    	setInterval(this.getDetail.bind(this), 7000);
    }
    getDetail(){
    	var _= this;
    	var location = [];
    	$('.list-room input:checkbox').each(function () {
    		if ($(this).is(':checked')) {
    			location.push($(this).val());
    		}
    	 });
    	var from = $('#date-from').attr('data-date');
    	var to = $('#date-to').attr('data-date');
    	var between = eCommon.getDateBetween(from, to);
    	var employees = '-1';
    	var json = {
    			langid: "2", 
    			sid: eCommon.sid, 
    			datefrom: from, 
    			dateto: to, 
    			location: location, 
    			datebetween: between, 
    			employee: employees
    	};
    	var str = JSON.stringify(json);
    	$.get(eAPI.getDetail(), {data: str}, function(response){
    		var xml = $.parseXML(response);
    		  var xmlNodes = xml.getElementsByTagName('data');
    		  var length = xmlNodes.length;
    		  var data = [];
    		  $(xml).find('data').each(function(index, element){
    			 var obj = new Object();
    			 obj.name = $(element).find('name').text();
    			 var excellent = Number($(element).find('excellent').text());
    			 var good = Number($(element).find('good').text());
    			 var average = Number($(element).find('fair').text());
    			 var poor = Number($(element).find('poor').text());
    			 var verypoor = Number($(element).find('other').text());
    			 var sum = excellent + good + average + poor + verypoor;
    			 if(sum==0){
    				 sum = 1;
    			 }
    			 obj.excellent = (excellent*100/sum).toFixed() + ' %';
    			 obj.good = (good*100/sum).toFixed() + ' %';
    			 obj.average = (average*100/sum).toFixed() + ' %';
    			 obj.poor = (poor*100/sum).toFixed()+ ' %';
    			 obj.verypoor = (verypoor*100/sum).toFixed()+ ' %';
    			 obj.sum = sum;
    			 data.push(obj);
    		  });
    		  _.setState({
    			  data: data
    		  });
    	});
    }
   render() {
      return (
		  <div id="detail" className="view tab">
			<div className="navbar">
				<div data-page="detail" className="navbar-inner">
					<div className="left sliding">
						<img src={this.props.logo} />
					</div>
					<div className="center sliding">Detail</div>
					<div className="right">
						<a href="#" className="link icon-only open-picker"> <i
							className="ios-icons">more_vertical</i></a>
					</div>
				</div>
			</div>
			<div className="pages navbar-through">
				<div data-page="detail" className="page">
					<div className="page-content list-survey">
						{this.state.data.map(function(item, index){
							return (
									<div key={item.sum + "__" + index} className="card">
								      <div className="card-header">{item.name}</div>
									  <div className="card-content">
									    <div className="card-content-inner">
							            	<div className="row center">
								           		<div className="col-20">
								            		<span className="percent__0">{item.excellent}</span>
								            	</div>
							            		<div className="col-20">
							            			<span className="percent__1">{item.good}</span>
							            		</div>
								           		<div className="col-20">
								            		<span className="percent__2">{item.average}</span>
								            	</div>
								          		<div className="col-20">
								        			<span className="percent__3">{item.poor}</span>
								            	</div>
								            	<div className="col-20">
								            		<span className="percent__4">{item.verypoor}</span>
								            	</div>
								            </div>
									    </div>
									  </div>
									</div>
							);
						}, this)}
					</div>
				</div>
			</div>
		</div>
      );
   }
}
class Notify extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications:[],
		}
	}
    componentWillMount(){
		this.checkNotify();
    }
    componentDidMount(){
    	setInterval(this.checkNotify.bind(this), 2000);
    }
    checkNotify(){
    	$.get(eAPI.checkNotifications(), function(response) {
			var xml = $.parseXML(response);
			var notifications = [];
			var node = $(xml).find('item');
			var length = node.length;
			for(var i = 0; i < length; i++){
				var obj = {
					id: node[i].attributes["id"].textContent,
					name: node.find("name_children")[i].textContent,
					type: node.find("name_parent")[i].textContent,
					location: node.find("location")[i].textContent
				}
				notifications.push(obj);
			}
			this.setState({
				notifications: notifications
			});
			if(length > 0){
				$('.toolbar a[href="#notify"] i span').text(length);
				$('.toolbar a[href="#notify"] i span').removeClass("hidden");
			} else {
				$('.toolbar a[href="#notify"] i span').addClass('hidden');
			}
        }.bind(this));
    }
    
    deleteClick(item){
		var _= this.state;
		var $this = ReactDOM.findDOMNode(this.refs["noty__" + item.id]);
		 app.confirm('Are you sure?', 'Delete Notify', function () {
	   		var obj = {
	   			id: item.id
	   	  };
		 $.get(eAPI.deleteNotify(), {data: JSON.stringify(obj)}, function(response){
			 console.log(response);
		 });
		});
	}
    rederHtml(obj){
//		var badge = <span className="badge bg-yellow">{obj.type}</span>;
		var badge = <span className="badge">{obj.type}</span>;
		var swipeout = <a href="#" ref="delete_click" onClick={this.deleteClick.bind(this, obj)} 
						data-index={obj.index} className="bg-red e-delete">Delete</a>;
		
		var tmp = <li ref={"noty__" + obj.id} key={"noty__" + obj.id} className="swipeout">
				  <div className="swipeout-content">
				   <a href="#" className="item-content item-link">
				     <div className="item-inner">
				        <div className="item-title-row">
				          <div className="item-title">{obj.location} </div>
				          <div className="item-after">
								{badge}
				          </div>
				        </div>
						<div className="item-text">{obj.name}</div>
				       {/*<div className="item-text">
				        	{obj.type}
				        </div>*/} 
				      </div>
				    </a>
				  </div>
				  <div className="swipeout-actions-right">
						{swipeout}
				  </div>
				</li>;
		return (tmp);
	};
	render(){
		return (
			<div id="notify" className="view tab">
		        <div className="pages navbar-fixed">
		          <div data-page="notify" className="page">
		            <div className="navbar">
			          <div data-page="notify" className="navbar-inner">
			            <div className="left sliding">
			            	<img src={this.props.logo} />
			            </div>
			            <div className="center sliding">Notifications</div>
			          </div>
			        </div>
		            <div className="page-content">
		              <div className="list-block media-list">
						  <ul>
						  	{this.state.notifications.map(this.rederHtml, this)}
						  </ul>
						</div>
		            </div>
		          </div>
		        </div>
	      </div>
		);
	}
}
class Tabbar extends React.Component {
   render() {
      return (
    		 <div className="toolbar tabbar tabbar-labels">
				<div className="toolbar-inner">
					<a href="#dashboard" className="tab-link active"> <i
						className="ios-icons icons-home">home_fill</i><span
						className="tabbar-label">Home</span></a>
					<a href="#rating" className="tab-link"> <i
						className="ios-icons icons-graph-round">star_fill</i> 
						<span className="tabbar-label">Rating</span></a>
					<a href="#detail" className="tab-link"> <i
						className="ios-icons icons-pie">pie_fill</i> <span className="tabbar-label">Detail</span></a>
					<a href="#notify"
						className="tab-link"> <i className="ios-icons icons-bell">bell_fill<span className="badge bg-red hidden">0</span></i><span
						className="tabbar-label">Notifications</span></a>
				</div>
			</div>
      );
   }
}


export default App;
