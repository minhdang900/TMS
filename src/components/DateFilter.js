/**
 * @DangTM
 * 29/10/2017
 * 
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FWPlugin from ".././common/app.plugin"; 
import Common from ".././common/app.common";
import { HashRouter as Router, Route, Link, hashHistory, IndexRoute  } from 'react-router-dom';
class Filter extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			indexSelected: 0,
			dateFilter: [{
				id: 1,
				name: 'Hôm Nay',
			},
			{
				id: 2,
				name: 'Hôm Qua',
			},
			{
				id: 3,
				name: '7 Ngày Trước',
			},
			{
				id: 4,
				name: '30 Ngày Trước',
			},
			{
				id: 5,
				name: 'Tháng Này',
			},
			{
				id: 6,
				name: 'Tháng Trước'
			}]
			
		}
	}
	componentWillMount(){
		
	}
    
    componentDidMount(){
    	 
    }
    selectChanged(item){
    	console.log(item);
    	let from = new Date();
		let to = new Date();
		if(item.id == 2){
			from = Common.getYesterday();
			//to = Common.getYesterday();
		} else if(item.id == 3){
			from = Common.getLast7Days();
		} else if(item.id == 4){
			from = Common.getLast30Days();
		} else if(item.id == 5){
			from = Common.getToday();
			from.setDate(1);
		} else if(item.id == 6){
			from = new Date(Common.getLastMonth());
			from.setDate(1);
			to = Common.getLastMonth();
		} 
		$('.date-from').val(moment(from).format('YYYY-MM-DD')); // get today
		$('.date-to').val(moment(to).format('YYYY-MM-DD')); // get today
		$('.date-from').attr(
				   "data-date", 
				   moment(from).format( $('.date-from').attr("data-date-format") ));
		$('.date-to').attr(
				   "data-date", 
				   moment(to).format( $('.date-from').attr("data-date-format") ));
    }
    filterTrips(){
    	console.log('press button filter');
    	FWPlugin.closeModal('.picker-filter');
    	this.props.getTrips();
    }
	render(){
		return(
		  <div className="picker-modal picker-filter">
			<div className="toolbar">
				<div className="toolbar-inner">
					<div className="left">
					</div>
					<div className="right">
						<Link to="/home" replace className="close-picker" onClick={this.filterTrips.bind(this)}>
							CHỌN
						</Link>
					</div>
				</div>
			</div>
			<div className="picker-modal-inner" style={{overflow: 'auto'}}>
			   <div className="list-block" style={{margin: '0 0'}}>
					<ul className="list-room">
						{this.state.dateFilter.map(function(item, idx){
							return(
								<li key={'picker__' + item.id} onClick={this.selectChanged.bind(this, item)}>
								  <label className="label-radio item-content">
									     <input type="radio" name="date-radio" 
									    	 	defaultChecked={idx== this.state.indexSelected?'checked':''} 
									     		value={item.id} />
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
						<div className="list-block" style={{margin: '5px 0'}}> 
							<div className="item-content">
								<div className="item-media">
									<i className="ios-icons icon-form-calendar">today</i>
								</div>
								<div className="item-inner">
									<div className="item-input">
										<input type="date" data-date-format="DD-MM-YYYY"
											placeholder="Date From" className="date-from" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-50">
						<div className="list-block" style={{margin: '5px 0'}}>
							<div className="item-content">
								<div className="item-media">
									<i className="ios-icons icon-form-calendar">today</i>
								</div>
								<div className="item-inner">
									<div className="item-input">
										<input type="date" data-date-format="DD-MM-YYYY"
											placeholder="Date To" className="date-to" />
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
export default Filter;

