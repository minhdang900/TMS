/**
 * 
 * @author DangTM R&D Department
 * @date Jun 1, 2017
 * @addr ELCOM-HCM
 * 
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FWPlugin from ".././common/app.plugin";
import { Link } from 'react-router-dom';
class Person extends Component{
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		
	}
	componentDidMount(){
		
	}
	render(){
		return (
			<div data-page="personal-screen">
				<div className="navbar">
				  <div className="navbar-inner">
				    <div className="left sliding">
				    	<Link to={'/home'} className="back link"> 
				    		<i className="ios-icons">left</i><span>Back</span>
				    	</Link>
				    </div>
				    <div className="center sliding">My Cars</div>
				  </div>
				</div>
				<div className="pages">
				  <div data-page="personal" className="page">
				    <div className="page-content">
				      <div className="content-block-title">My Cars</div>
					      <form id="my-form" className="list-block">
						      <ul>
						        <li> 
						          <div className="item-content">
						            <div className="item-inner">
						              <div className="item-title label">Name</div>
						              <div className="item-input">
						                <input type="text" name="name" placeholder="Your name" />
						              </div>
						            </div>
						          </div>
						        </li>
						      </ul>
					       </form>
				     </div>
				  </div>
				</div>
			</div>
		   )
	}
}
export default Person;