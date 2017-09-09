/**
 * 
 * @author DangTM R&D Department
 * @date Jul 2, 2017
 * @addr ELCOM-HCM
 * 
 */
import '../assets/stylesheets/css/app-aba-report.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Common from  ".././common/app.common";
import Cookie from "react-cookie";
import FWPlugin from ".././common/app.plugin"; 
import { Link } from 'react-router-dom';

class Report extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
				dateFrom :'',
				dateTo: '',
				report:[{
					quantity: 0,
					salary: 0,
					star: 1
				}]
		}
	}
	componentWillMount() {
		
	}
	componentDidMount(){	
		$('.date-from').on('change', function(){
			this.setAttribute(
			   "data-date", 
			   moment(this.value, "YYYY-MM-DD").format( this.getAttribute("data-date-format") ));
		});
		$('.date-to').on('change', function(){
			this.setAttribute(
			   "data-date", 
			   moment(this.value, "YYYY-MM-DD").format( this.getAttribute("data-date-format") ));
		});
		$('.date-from').val(moment().format('YYYY-MM-DD')); // get today
		
		$('.date-to').val(moment().format('YYYY-MM-DD')); // get today
		this.getReport();
	}
	getReport(){
		var _ = this;
		var dateFrom = $('.date-from').val();
		var dateTo = $('.date-to').val();
		_.setState({
			dateFrom: moment(dateFrom).format('YYYY-MM-DD'),
			dateTo: moment(dateTo).format('YYYY-MM-DD')
		});
		Common.request({type:'GET', url:'/report',
			data:{user: Common.user.username, from: dateFrom, to: dateTo}}, 
			function(res){
				if(res.status){
					if(res.data.length > 0){
						_.setState({
							report: res.data
						});
					}
					var data = _.state.report;
					var length = data.length;
					for(var i = 0; i < length; i++){
						$('#rating-' + i).barrating({
							theme: 'fontawesome-stars',
							initialRating: data[i].star,
							showValues: false,
							readonly: true
						});
					}
				}
		});
	}
	filterDate(){
		FWPlugin.pickerModal('.picker-report');
	}
	render(){
		return (<div data-page="report-screen" className="report-screen" style={{height: '100%'}}>
				<div className="navbar">
				  <div className="navbar-inner">
				    <div className="left sliding">
				    	<Link to={'/home'} className="back link"> 
				    		<i className="ios-icons">left</i><span style={{fontSize: '14px'}}>TRỞ LẠI</span>
				    	</Link>
				    </div>
				    <div className="center sliding">BÁO CÁO</div>
				  </div>
				</div>
				<div className="pages">
				  <div data-page="report" className="page">
				    <div className="page-content">
					    <div className="data-table data-table-init card">
							 <div className="card-header">
							    <div className="data-table-title">
							    	<i className="fa fa-calendar" aria-hidden="true" style={{marginRight:'5px'}}></i>   
							    	{this.state.dateFrom + ' - ' + this.state.dateTo}
							    </div>
							    <div className="data-table-actions">
							      <Link className="link icon-only" to="/report" onClick={this.filterDate.bind(this)}  replace ><i className="ios-icons">calendar_fill</i></Link>
							    </div>
							  </div>
							  <div className="card-content">
								  <table>
								    <thead>
								      <tr>
								        <th className="label-cell">SỐ LƯỢNG</th>
								        <th className="tablet-only">ĐÁNH GIÁ</th>
								        <th className="numeric-cell">TIỀN CÔNG</th>
								      </tr>
								    </thead>
								    <tbody>
								    { this.state.report.map(function(item, index){
								    	   return (
							    			  <tr key={'report_' + index}>
										        <td className="label-cell">{item.quantity}</td>
										        <td className="tablet-only">
											        <select id={"rating-" + index}>
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														<option value="4">4</option>
														<option value="5">5</option>
													</select>
										        </td>
										        <td className="numeric-cell">{Number(item.salary).toLocaleString('vn')}</td>
										      </tr>
								    	   )
								       })
								     }
								    </tbody>
								  </table>
							  </div>
						</div>
				  </div>
				</div>
				<Picker dateFrom ={this.state.dateFrom} dateTo ={this.state.dateTo} report = {this.getReport.bind(this)}/>
			</div>	
		</div>);
	};
}
class Picker extends Component{
	filterData(){
		FWPlugin.closeModal();
		this.props.report();
	}
	closeFilter(){
		FWPlugin.closeModal();
		// set old value
		$('.date-from').val(moment(this.props.dateFrom).format('YYYY-MM-DD')); // get today
		$('.date-to').val(moment(this.props.dateTo).format('YYYY-MM-DD')); // get today
	}
	render(){
		return(
			<div className="picker-modal picker-report">
			    <div className="toolbar">
			      <div className="toolbar-inner">
			        <div className="left">
			        	<Link to="/report" replace onClick={this.closeFilter.bind(this)} className="close-picker">ĐÓNG</Link>
			        </div>
			        <div className="right"><Link to="/report" replace onClick={this.filterData.bind(this)} className="close-picker">TÌM</Link></div>
			      </div>
			    </div>
			    <div className="picker-modal-inner">
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
											placeholder="Date From" className="date-from" />
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
export default Report;