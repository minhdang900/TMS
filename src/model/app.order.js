import React from 'react';
import { render } from 'react-dom';
import eCommon from './app.common';
import eAPI from './app.api';
import Order from '.././components/Order';
var eOrder = {
	service : 'http://103.254.12.200:8280/eSurvey/Order?',//'http://localhost:8081/eSurvey/Order?',
	context: null,
	element: '#order',
	event: false,
	order:[]
}
eOrder.waitingClick = function($this){
	var _=this;
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
					+	(indx +1)
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
//    			var index = Number($($this).attr('data-index'));
//    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').empty();
//    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').append('<span class="badge bg-blue">Processing</span>');
//    			$($this).addClass('bg-blue').removeClass('bg-yellow');
//    			$($this).addClass('e-done').removeClass('e-processing');
//    			$($this).attr('onclick', 'eOrder.processingClick(this)');
//    			$($this).text("Processing");
//    			app.alert('','Message was send successfully');
    			var index = Number($($this).attr('data-index'));
    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').empty();
    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').append('<span class="badge bg-green">Done</span>');
    			$($this).addClass('bg-red').removeClass('bg-yellow');
    			$($this).addClass('e-delete').removeClass('e-processing');
    			$($this).attr('onclick', 'eOrder.deleteClick(this)');
    			$($this).text("Delete");
    			app.alert('','Message was send successfully');
    		})
    	}
      }
    );
}
eOrder.processingClick = function($this){
	var _ = this;
    app.prompt('Send a message to your guest', 'Confirm Done',
      function (value) {
    	if(value == ""){
    		app.alert('','Please input text');
    	} else {
    		var index = Number($($this).attr('data-index'));
    		var obj = {
    			code: _.order[index].code,
    			content:  '<h2 style="color:#2e1710; font-size:20px">'+value+'</h2>',
    			createdate: _.order[index].createdate,
    			id: _.order[index].id,
    			room: _.order[index].room,
    			type: 2
    		};
    		$.get(eAPI.getConfirm(), {data: JSON.stringify(obj)}, function(response){
    			var index = Number($($this).attr('data-index'));
    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').empty();
    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').append('<span class="badge bg-green">Done</span>');
    			$($this).addClass('bg-red').removeClass('bg-blue');
    			$($this).addClass('e-delete').removeClass('e-done');
    			$($this).attr('onclick', 'eOrder.deleteClick(this)');
    			$($this).text("Delete");
    			app.alert('','Message was send successfully');
    		})
    	}
      }
    );
}
eOrder.deleteClick = function($this){
	var _ = this;
	 app.confirm('Are you sure?', 'Delete Order', function () {
		 var index = Number($($this).attr('data-index'));
   		var obj = {
   			code: _.order[index].code,
   			id: _.order[index].id
   	 };
		 $.get(eAPI.deleteOrder(), {data: JSON.stringify(obj)}, function(response){
			 $($this).parent().parent().remove();
		 });
	 });
}
//eOrder.initEvent = function(){
//	var _=this;
//	$('e-done').off('click');
//	$('e-process').off('click');
//	$('e-waiting').off('click');
//	
//	$('.e-done').on('click', function () {
//		var $this = this;
//	    app.prompt('Send a message to your guest', 'Confirm Done',
//	      function (value) {
//	    	if(value == ""){
//	    		app.alert('','Please input text');
//	    	} else {
//	    		var index = Number($($this).attr('data-index'));
//	    		var obj = {
//	    			code: _.order[index].code,
//	    			content: value,
//	    			createdate: _.order[index].createdate,
//	    			id: _.order[index].id,
//	    			room: _.order[index].room,
//	    			type: 2
//	    		};
//	    		$.get(eAPI.getConfirm(), {data: JSON.stringify(obj)}, function(response){
//	    			var index = Number($($this).attr('data-index'));
//	    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').empty();
//	    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').append('<span class="badge bg-green">Done</span>');
//	    			$($this).addClass('bg-red').removeClass('bg-blue');
//	    			$($this).addClass('e-delete').removeClass('e-done');
//	    			$($this).text("Delete");
//	    			app.alert('','Message was send successfully');
//	    			eOrder.initEvent();
//	    		})
//	    	}
//	      }
//	    );
//	});
//	$('.e-processing').on('click', function () {
//		var $this = this;
//	    app.prompt('Send a message to your guest', 'Confirm Processing',
//	      function (value) {
//	    	if(value == ""){
//	    		app.alert('','Please input text');
//	    	} else {
//	    		var index = Number($($this).attr('data-index'));
//	    		var obj = {
//	    			code: _.order[index].code,
//	    			content: value,
//	    			createdate: _.order[index].createdate,
//	    			id: _.order[index].id,
//	    			room: _.order[index].room,
//	    			type: 1
//	    		};
//	    		$.get(eAPI.getConfirm(), {data: JSON.stringify(obj)}, function(response){
//	    			var index = Number($($this).attr('data-index'));
//	    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').empty();
//	    			$(_.element).find('.order-list li.swipeout').eq(index).find('.item-after').append('<span class="badge bg-blue">Processing</span>');
//	    			$($this).addClass('bg-blue').removeClass('bg-yellow');
//	    			$($this).addClass('e-done').removeClass('e-processing');
//	    			$($this).text("Processing");
//	    			app.alert('','Message was send successfully');
//	    			eOrder.initEvent();
//	    		})
//	    	}
//	      }
//	    );
//	});
//	$('.e-delete').on('click', function () {
//		 var $this = this;
//		 app.confirm('Are you sure?', 'Delete Order', function () {
//			 var index = Number($($this).attr('data-index'));
//	    		var obj = {
//	    			code: _.order[index].code,
//	    			id: _.order[index].id
//	    	 };
//			 $.get(eAPI.deleteOrder(), {data: JSON.stringify(obj)}, function(response){
//				 $($this).parent().parent().remove();
//				 eOrder.initEvent();
//			 });
//		 });
//	});
//}

eOrder.checkOrder= function(){
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
};
eOrder.getOrder = function(){
	render(<Order />, document.getElementById('order-list'));
//	var _=this;
//	$.ajax({
//		url: eAPI.getOrder('-1'),
//		type: 'GET',
//		success: function(response){
//			var xml = $.parseXML(response);
//			var changed = false;
//			if($(_.element).find('.order-list li.swipeout').length == $(xml).find('item').length){
//				var length = _.order.length;
//				for(var i = 0; i < length; i++){
//					var val = Number($(xml).find('item').find('status')[i].textContent);
//					if(val != _.order[i].isconfirm){
//						changed = true;
//					}
//				}
//				if(!changed){
//					changed = false;
//					return;
//				}
//			}
//			_.order = [];
//			$(_.element).find('.order-list').empty();
//			$(xml).find('item').each(function(index, element) {
//				var obj = {};
//				obj.index = index;
//				obj.id = $(element).find('id').text();
//				obj.room = $(element).find('room').text();
//				obj.createdate = $(element).find('createdate').text();
//				obj.fulltime = obj.createdate + ' ' + $(element).find('time').text();
//				obj.time = $(element).find('time').text();
//				obj.code = $(element).find('code').text();
//				obj.isconfirm = $(element).find('status').text();
//				obj.menu = $(element).find('menuorder').text();
//				_.order.push(obj);
//				//$(_.element).find('.order-list').append(eOrder.itemHtml(obj)); //document.getElementById('order')
//				render(<Order/>, document.getElementById('order'));
//			});
//		}, 
//		error: function(){
//			console.log("--> Error[404]. Can't get order");
//		}
//	});
}
eOrder.itemHtml = function(obj){
	var submenu = '';
	$(obj.menu).find('order').each(function(indx, el){
		var name = $(el).find('name').text();
		var count = $(el).find('count').text();
		var price = $(el).find('price').text() + ' $';
		submenu = submenu+ '<li class="list-group-item"><span>'+(indx + 1) + ". " +name+'</span><span class="badge hidden">'+count+'</span><span class="right">'+price+'</span></li>';
	});
	var badge = '<span class="badge bg-green">Done</span>';
	var swipeout = '<a href="#" onClick="eOrder.deleteClick(this)" data-index="'+obj.index+'" class="bg-red e-delete">Delete</a>'
	if(obj.isconfirm == '0'){
		badge = '<span class="badge bg-yellow">Waiting</span>';
		swipeout = '<a href="#" onClick="waitingClick(this)"  data-index="'+obj.index+'" class="bg-yellow e-processing">Waiting</a>';
	} else if(obj.isconfirm == '1'){
		badge = '<span class="badge bg-blue">Processing</span>';
		swipeout = '<a href="#" onClick="eOrder.processingClick(this)" data-index="'+obj.index+'" class="bg-blue e-done">Processing</a>';
	}
	var tmp = '<li class="swipeout">'
			+'  <div class="swipeout-content">'
			+'    <a href="#" class="item-content item-link">'
			+'     <div class="item-inner">'
			+'        <div class="item-title-row">'
			+'          <div class="item-title">Room '+obj.room+'</div>'
			+'          <div class="item-after">'
			+				badge
			+'          </div>'
			+'        </div>'
			+'		  <div class="item-text">'+obj.fulltime+'</div>'
			+'        <div class="item-text">'
			+'        	<ul class="list-group">'
			+				submenu 			
			+'        	</ul>'
			+'        </div>'
			+'      </div>'
			+'    </a>'
			+'  </div>'
			+'  <div class="swipeout-actions-right">'
			+		swipeout
			+'  </div>'
			+'</li>';
	return tmp;
}
export default eOrder;