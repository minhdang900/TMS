import React, { Component } from 'react';
import eAPI from '.././common/app.api';
import app from '.././common/app.plugin';
import ReactDOM from 'react-dom';
class Order extends React.Component{
	constructor() {
		super();
		this.state = {
			service : 'http://103.254.12.200:8280/eSurvey/Order?',
			context: null,
			element: '#order',
			event: false,
			order:[],
		}
	}
	componentWillMount(){
	    setInterval(function(){
	    	var self = this;
			$.get(eAPI.getOrder('-1'), function(response) {
				var xml = $.parseXML(response);
				var order = [];
				$(xml).find('item').each(function(index, element) {
					var obj = {};
					obj.index = index;
					obj.id = $(element).find('id').text();
					obj.room = $(element).find('room').text();
					obj.createdate = $(element).find('createdate').text();
					obj.fulltime = obj.createdate + ' ' + $(element).find('time').text();
					obj.time = $(element).find('time').text();
					obj.code = $(element).find('code').text();
					obj.isconfirm = $(element).find('status').text();
					obj.menu = $(element).find('menuorder').text();
					order.push(obj);
				});
				this.setState({
					order: order
				});
	        }.bind(this));
	    }.bind(this), 1000);
	    setInterval(function(){
	    	$.ajax({
				url: eAPI.getOrder('0'),
				type:'GET',
				success: function(response){
					var xml = $.parseXML(response);
					var length = $(xml).find('item').length;
					if(length > 0){
						$('.toolbar a[href="#order"] i span').text(length);
						$('.toolbar a[href="#order"] i span').removeClass("hidden");
					} else {
						$('.toolbar a[href="#order"] i span').addClass('hidden');
					}
				},
				error: function(){
					console.log("--> Error[404]. Can't check order");
				}
			});
	    }, 3000);
	}
	componentDidMount(){
		var _= this.state;
		var self = this;
		$.get(eAPI.getOrder('-1'), function(response) {
			var xml = $.parseXML(response);
			var order = [];
			$(xml).find('item').each(function(index, element) {
				var obj = {};
				obj.index = index;
				obj.id = $(element).find('id').text();
				obj.room = $(element).find('room').text();
				obj.createdate = $(element).find('createdate').text();
				obj.fulltime = obj.createdate + ' ' + $(element).find('time').text();
				obj.time = $(element).find('time').text();
				obj.code = $(element).find('code').text();
				obj.isconfirm = $(element).find('status').text();
				obj.menu = $(element).find('menuorder').text();
				order.push(obj);
			});
			this.setState({
				order: order
			});
        }.bind(this));
	}
	waitingClick(){
		var _= this.state;
		var $this = ReactDOM.findDOMNode(this.refs.warning_click);
	    app.prompt('Send a message to your guest', 'Confirm Processing',
	      function (value) {
	    	if(value == ""){
	    		app.alert('','Please input text');
	    	} else {
	    		var index = Number($($this).attr('data-index'));
	    		var sum = 0;
	    		var row = '';
	    		for(var i = 0; i < $(_.order[index].menu).find('order').length; i++){
	    			var name = $(_.order[index].menu).find('order').find('name')[i].textContent;
	    			var count =$(_.order[index].menu).find('order').find('count')[i].textContent;
	    			var price = $(_.order[index].menu).find('order').find('price')[i].textContent;
	    			sum = sum + parseFloat(price);
	    			row = row + '<tr>' 
						+'<td class="vertical-middle text-center">'
						+	(i +1)
				      	+'</td>'
						+'<td class="vertical-middle">'+name +'</td>'
						+'<td class="vertical-middle text-center">'+count+'</td>'
						+'<td class="vertical-middle text-right">'+price+'</td>'
					+'</tr>';
	    		}
	    		var table = '<div class="bill__confirm">'
					    +'		<div class="col-md-6">'
	                    +'             <h6 class="text__name">Name: Mr.Henry</h6>'
	                    +'             <h6 class="text__room">Room: '+ _.order[index].room +'</h6>'
	                    +'         </div>'
					    +'		<div class="col-md-6">'
					    +'			<div class="pull-right">'
					    +'				<h6 class="due__date">Due Date: ' + _.order[index].createdate + '</h6>'
						+'				<h6 class="due__time">Due Time: ' + _.order[index].time + '</h6>'
						+'			</div>'
						+'		</div>'
						+'		<table class="table table-striped">'
						+'			<thead>'
						+'				<tr>'
						+'					<th class="text-center">Quantity</th>'
	                    +'                    <th>Item</th>'
	                    +'                    <th class="text-center">Count</th>'
	                    +'                    <th class="text-right">Price</th>'
						+'				</tr>'
						+'			</thead>'
						+'			<tbody>'+row+'</tbody>'
						+'		</table>'
						+'		<div class="col-md-12 col-sm-12 col-xs-12">'
						+'			<div class="pull-right">'
						+'				<h6 class="sub__price">SubPrice = $' + sum +' </h6>'
						+'				<!--<h6 class="delivery__price"></h6>-->'
						+'				<h6 class="total__price">Total Price = $' + sum+'</h6>'
						+'			</div>'
						+'		</div>'
						+'	</div>';
	    		var content = "<!DOCTYPE html>"+
						"<html>"+
						"<head>"+
						"	<meta charset='utf-8'>"+
						"	<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'>"+
						"	<link href='http://103.254.12.200:8280/vinpearl/STYLE-INF/css/bootstrap.paper.min.default.css' rel='stylesheet'>"+
						"</head>"+
					"<body style='background-color:#f2f2f2'>"+
					    "<div class='col-md-12 col-sm-12 col-xs-12'>"+
					    	table +
					    
					    	value +
					    "</div>"+
					"</body>"+
					"</html>";
	    		
	    		var obj = {
	    			code: _.order[index].code,
	    			content: content,
	    			createdate: _.order[index].createdate,
	    			id: _.order[index].id,
	    			room: _.order[index].room,
	    			type: 2
	    		};
	    		$.get(eAPI.getConfirm(), {data: JSON.stringify(obj)}, function(response){
//	    			var index = Number($($this).attr('data-index'));
//	    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').empty();
//	    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').append('<span class="badge bg-green">Done</span>');
//	    			$($this).addClass('bg-red').removeClass('bg-yellow');
//	    			$($this).addClass('e-delete').removeClass('e-processing');
//	    			$($this).attr('onclick', 'eOrder.deleteClick(this)');
//	    			$($this).text("Delete");
	    			app.alert('','Message was send successfully');
	    		})
	    	}
	      }
	    );
	};
	
	processingClick(){
	};
	
	deleteClick(){
		var _= this.state;
		var $this = ReactDOM.findDOMNode(this.refs.delete_click);
		 app.confirm('Are you sure?', 'Delete Order', function () {
			 var index = Number($($this).attr('data-index'));
	   		var obj = {
	   			code: _.order[index].code,
	   			id: _.order[index].id
	   	 };
			 $.get(eAPI.deleteOrder(), {data: JSON.stringify(obj)}, function(response){
				 console.log(response);
			 });
		 });
	};
	
	itemHtml(obj){
		var tmpItem = function(item){
			return (
					<li key={item.index} className="list-group-item">
						<span>{item.index}. {item.name}</span>
						<span className="badge hidden">{item.count}</span>
						<span className="right">{item.price}</span>
					</li>
			);
		}
		var tmpSubmenu = function(menu){
			var data = [];
			$(menu).find('order').each(function(indx, el){
				var obj = {};
				obj.index = indx;
				obj.name = $(el).find('name').text();
				obj.count = $(el).find('count').text();
				obj.price = $(el).find('price').text() + ' $';
				data.push(obj);
			});
			return (
				<div>{data.map(tmpItem)}</div>
			);
		}
		var badge = <span className="badge bg-green">Done</span>;
		var swipeout = <a href="#" ref="delete_click" onClick={this.deleteClick.bind(this)} data-index={obj.index} className="bg-red e-delete">Delete</a>;
		if(obj.isconfirm == '0'){
			badge = <span className="badge bg-yellow">Waiting</span>;
			swipeout = <a href="#" ref="warning_click" onClick={this.waitingClick.bind(this)} data-index={obj.index} className="bg-yellow e-processing">Waiting</a>;
		} else if(obj.isconfirm == '1'){
			badge = <span className="badge bg-blue">Processing</span>;
			swipeout = <a href="#" onClick={this.processingClick.bind(this)} data-index={obj.index} className="bg-blue e-done">Processing</a>;
		}
		var tmp = <li key={obj.isconfirm + '_' + obj.id} className="swipeout">
				  <div className="swipeout-content">
				   <a href="#" className="item-content item-link">
				     <div className="item-inner">
				        <div className="item-title-row">
				          <div className="item-title">Room {obj.room}</div>
				          <div className="item-after">
								{badge}
				          </div>
				        </div>
						  <div className="item-text">{obj.fulltime}</div>
				        <div className="item-text">
				        	<ul className="list-group">
				        	    {tmpSubmenu(obj.menu)}		
				        	</ul>
				        </div>
				      </div>
				    </a>
				  </div>
				  <div className="swipeout-actions-right">
						{swipeout}
				  </div>
				</li>;
		return (tmp);
	};
	
	render() {
        return (
        	// passed context of this to the function passed to map
        	<div>{this.state.order.map(this.itemHtml, this)}</div>
        );
	}
}
export default Order;