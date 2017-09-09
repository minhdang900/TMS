import eCommon from './app.common';
import eAPI from './app.api';

var eRating ={
	element: '.list-room',
	element_survey: '.list-survey',
	element_rating: '.rating_container',
	rating: [],
	sum: 0,
	color : ['#1ebfae', '#30a5ff', '#ffb53e', '#c7c700', '#f9243f', '#669999']
}
eRating.getSid = function(callback){
	$.ajax({
		url: eAPI.getURLSid(),
		type: "GET",
		success: function(response){
			var xml = $.parseXML(response);
			eCommon.sid = $(xml).find('site').attr('siteid');
			callback();
		},
		error: function(){}
	});
}
eRating.getRoom = function(callback){
	var _=this;
	$.ajax({
		url: eAPI.getLocation(),
		type: "GET",
		success: function(response){
			var xml = $.parseXML(response);
			$(_.element).empty();
			$(xml).find('location').each(function(index, element){
				var name = $(element).find('name').text();
				var id = $(element).attr('lid');
				if(id != null){
					var item = '<li>'
						+'  <label class="label-checkbox item-content">'
						+'     <input type="checkbox" name="room-checkbox" onchange="eRating.roomChange(event)" value="'+id+'" checked="checked">'
						+'     <div class="item-media">'
						+'       <i class="icon icon-form-checkbox"></i>'
						+'     </div>'
						+'     <div class="item-inner">'
						+'       <div class="item-title">'+name+'</div>'
						+'     </div>'
						+'   </label>'
						+' </li>';
					$(_.element).append(item);
				}
			});
			callback();
		},
		error: function(){}
	});
}
eRating.roomChange = function(event){
	var _ = this;
	var $this;
	var i = 0;
	var location = [];
	$(_. element + ' input:checkbox').each(function () {
		if ($(this).is(':checked')) {
			i+= 1;
			location.push( $(this).val());
			$this = $(this);
		}
	 });
	if(i == 1){
		$($this).attr('disabled', 'disabled');
	} else {
		$(_.element + ' input:checkbox').each(function () {
			$(this).removeAttr('disabled');
		 });
	}
	return location;
}
eRating.getRating = function(){
	var _=this;
	var location = [];
	$(_.element + ' input:checkbox').each(function () {
		if ($(this).is(':checked')) {
			location.push($(this).val());
		}
	 });
	var from = $('#date-from').attr('data-date');
	var to = $('#date-to').attr('data-date');
	var between = eCommon.getDateBetween(from, to);
	var employees = '-1';
	var json = {sid: eCommon.sid, 'datefrom': from, 'dateto': to, 'location': location, 'datebetween': between, 'employee': employees};
	var str = JSON.stringify(json);
	$.get(eAPI.getRating(), {data: str}, function(response){
		var xml = $.parseXML(response);
		var dataNode = $(xml).find('data');
		var length = dataNode.length;
		// check change data
		var isChange = false;
		if(_.rating.length > 0){
			for(var i = 0; i < length; i++){
				var val = Number($(xml).find('data').find('page0').find('value')[i].textContent);
				if(val != _.rating[i].value){
					isChange = true;
				}
			}
			if(!isChange){
				isChange = false;
				return;
			}
		}
		_.rating = [];
		_.sum = 0;
		for(var i = 0; i < length; i++){
			var nodeRating = dataNode[i].childNodes[0].childNodes;
			var pLength = nodeRating.length;
			var obj = {
				id: dataNode[i].attributes["id"].textContent,
				name: dataNode[i].attributes["name"].textContent,
				value:0,
				item:[]
			}
			var sumRating = 0;
			for(var j = 0; j < pLength; j++){
				var pObject = {
					id: nodeRating[j].childNodes[0].textContent,
					name: nodeRating[j].childNodes[1].textContent,
					value: Number(nodeRating[j].childNodes[3].textContent),
					sum: Number(nodeRating[j].childNodes[4].textContent),
				}
				obj.item.push(pObject);
				sumRating+= pObject.value;
			}
			obj.value = sumRating;
			_.sum+= sumRating;
			_.rating.push(obj);
		}
		if(_.sum == 0){
			_.sum = 1;
		}
		_.drawCircleChart('#', _.rating);
		_.drawColumnChart('rating_container', _.rating);
		_.drawRating(_.rating);
	});

}

eRating.drawCircleChart = function(element, data){
	var _=this;
	var length = data.length;
	for(var i = 0; i < length; i++){
		var percent = data[i].value*100/_.sum; 
		var classes = data[i].name.toLowerCase().replace(" ", '');
		$('.text__'+ i).text(data[i].name);
		$('.percent__'+ i).attr('data-percent', percent.toFixed());
		$('.percent__' + i + ' .percent').text(percent.toFixed() + '%');
		$(element + 'percent__' + i).easyPieChart({
			scaleColor : false,
			barColor : _.color[i]
		});
		$(element + 'percent__' + i).data('easyPieChart').update(percent.toFixed());
	}
	 
}

eRating.drawColumnChart = function(element, data){
	var _=this;
	var arr = [];
	var length = data.length;
	for(var i = 0; i < length; i++){
		var obj = {};
        obj.name = data[i].name;
        obj.color = _.color[i];
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
eRating.drawRating = function(data){
	var _=this;
	$(_.element_rating).empty();
	var length = data.length;
	for(var i = 0; i < length; i++){
		var obj = {};
		obj.index = i;
		obj.element = data[i].name.toLowerCase().replace(" ", '');
		var size = data[i].item.length;
		obj.item = '<div class="list-block media-list"><ul>';
		if(size == 0){
			itemSub = '<li class="item-content">'
			        +'  <div class="item-inner">'
			        +'	  <div class="item-title-row">'	
			        +'    	<div class="item-title">No Content</div>'
			        +'	  </div>'
			        +'  </div>'
			        +'</li>';
			obj.item +=itemSub;
		}
		for(var j = 0; j < size; j++){
			var itemSub = '';
			itemSub = '<li class="item-content">'
		        +'  <div class="item-inner">'
		        +'	  <div class="item-title-row">'	
		        +'      <div class="item-title">'+data[i].item[j].name+'</div>'
		        +'      <div class="item-after percent__'+obj.index+'">'+data[i].item[j].value+'</div>'
		        +'	  </div>'
		        +'  </div>'
		        +'</li>';
			obj.item +=itemSub;
		}
		obj.item += '</ul></div>';
		$(_.element_rating).append(_.itemRating(obj));
	}
	_.drawCircleChart('#rating__', data);
}
eRating.itemRating = function(obj){
	var _=this;
	var tmp = '<div class="row">'
		       	+'  <div class="col-30">'
		       	+'  	  <div class="easypiechart percent__'+obj.index+'" id="rating__percent__'+obj.index+'" data-percent="">'
				+'			<span class="percent"></span>'
				+'			<span class="text__'+obj.index+'"></span>'
				+'		</div>'
		       	+' </div>'
		       	+'  <div class="col-70">'
		       	+ 		obj.item
		       	+'  </div>'
		       +'</div>';
	return tmp;
}
eRating.getDetail = function(){
	var _=this;
	var location = [];
	$(_.element + ' input:checkbox').each(function () {
		if ($(this).is(':checked')) {
			location.push($(this).val());
		}
	 });
	var from = $('#date-from').attr('data-date');
	var to = $('#date-to').attr('data-date');
	var between = eCommon.getDateBetween(from, to);
	var employees = '-1';
	var json = {langid: "2", sid: eCommon.sid, 'datefrom': from, 'dateto': to, 'location': location, 'datebetween': between, 'employee': employees};
	var str = JSON.stringify(json);
	$.get(eAPI.getDetail(), {data: str}, function(response){
		var xml = $.parseXML(response);
		  var xmlNodes = xml.getElementsByTagName('data');
		  var length = xmlNodes.length;
		  $(_.element_survey).empty();
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
			 $(eRating.element_survey).append(eRating.itemSurvey(obj));
		  });
	});
}
eRating.itemSurvey = function(obj){
	var tmp = '<div class="card">'
		    +'  <div class="card-header">'+obj.name+'</div>'
			+'  <div class="card-content">'
			+'    <div class="card-content-inner">'
	        +'    	<div class="row center">'
	        +'    		<div class="col-20">'
	    //    +'    			<span><i class="fontello fontello-excellent percent__0"></i></span>'
	        +'    			<span class="percent__0">'+obj.excellent+'</span>'
	        +'    		</div>'
	        +'    		<div class="col-20">'
	     //   +'    			<span><i class="fontello fontello-good percent__1"></i></span>'
	        +'    			<span class="percent__1">'+obj.good+'</span>'
	        +'    		</div>'
	        +'    		<div class="col-20">'
	     //   +'    			<span><i class="fontello fontello-average percent__2"></i></span>'
	        +'    			<span class="percent__2">'+obj.average+'</span>'
	        +'    		</div>'
	        +'    		<div class="col-20">'
	     //   +'    			<span><i class="fontello fontello-poor percent__3"></i></span>'
	        +'    			<span class="percent__3">'+obj.poor+'</span>'
	        +'    		</div>'
	        +'    		<div class="col-20">'
	    //    +'    			<span><i class="fontello fontello-very-poor percent__4"></i></span>'
	        +'    			<span class="percent__4">'+obj.verypoor+'</span>'
	        +'    		</div>'
	        +'    	</div>'
			+'    </div>'
			+'  </div>'
			+'</div>';
	return tmp;
}
export default eRating;